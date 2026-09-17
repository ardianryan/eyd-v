const http = require('http');
const url = require('url');
const { checkEyd, searchRules, getRuleById, listCategories, checkSingleWord, lookupTechTerm, getTechTerms } = require('./index');

function createEydServer() {
  return http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = reqUrl.pathname;

    if (pathname === '/health' || pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'ok', service: 'eyd-v', version: '5.2.1' }));
      return;
    }

    if (pathname === '/api/check' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const text = payload.text || '';
          const options = {
            mode: payload.mode || 'general',
            ignoreWords: payload.ignoreWords || [],
            preferredPronoun: payload.preferredPronoun || null
          };

          const result = checkEyd(text, options);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(result));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload', message: e.message }));
        }
      });
      return;
    }

    if (pathname === '/api/kata' && req.method === 'GET') {
      const w = reqUrl.searchParams.get('word') || reqUrl.searchParams.get('w');
      if (!w) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: "Parameter 'word' atau 'w' wajib diisi" }));
        return;
      }
      const result = checkSingleWord(w);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
      return;
    }

    if (pathname === '/api/istilah' && req.method === 'GET') {
      const q = reqUrl.searchParams.get('q') || reqUrl.searchParams.get('query');
      const results = q ? lookupTechTerm(q) : getTechTerms();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ query: q || '', total: results.length, terms: results }));
      return;
    }

    if (pathname === '/api/rules' && req.method === 'GET') {
      const q = reqUrl.searchParams.get('q');
      if (q) {
        const results = searchRules(q, { limit: 10 });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ query: q, results }));
        return;
      }

      const categories = listCategories();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ categories }));
      return;
    }

    if (pathname.startsWith('/api/rule/') && req.method === 'GET') {
      const id = pathname.replace('/api/rule/', '');
      const rule = getRuleById(id);
      if (!rule) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Rule not found', id }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(rule));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
}

module.exports = { createEydServer };

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = createEydServer();
  server.listen(port, () => {
    console.log(`EYD V REST API server berjalan di http://localhost:${port}`);
  });
}
