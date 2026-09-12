const fs = require('fs');
const path = require('path');
const { checkEyd, getLeksikon } = require('./linter');

let cachedRules = null;
let cachedChunks = null;

function getAllRules() {
  if (!cachedRules) {
    const filePath = path.resolve(__dirname, '../data/eyd-v-all-rules.json');
    if (fs.existsSync(filePath)) {
      cachedRules = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
      cachedRules = [];
    }
  }
  return cachedRules;
}

function getRAGChunks() {
  if (!cachedChunks) {
    const filePath = path.resolve(__dirname, '../data/eyd-v-chunks.jsonl');
    if (fs.existsSync(filePath)) {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
      cachedChunks = lines.map(line => JSON.parse(line));
    } else {
      cachedChunks = [];
    }
  }
  return cachedChunks;
}

/**
 * Mencari aturan EYD V berdasarkan kata kunci
 * @param {string} query - Kata kunci pencarian
 * @param {object} options - Opsi pencarian (limit, category)
 * @returns {Array} Daftar aturan yang cocok
 */
function searchRules(query, options = {}) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(t => t.length > 1);
  const limit = options.limit || 10;
  const category = options.category;

  const chunks = getRAGChunks();
  const results = [];

  for (const chunk of chunks) {
    if (category && chunk.category !== category) continue;

    let score = 0;
    const titleLower = (chunk.title || '').toLowerCase();
    const contentLower = (chunk.content || '').toLowerCase();
    const tags = (chunk.tags || []).map(t => t.toLowerCase());

    // Full query match
    if (titleLower.includes(q)) score += 80;
    if (contentLower.includes(q)) score += 40;

    // Per token match
    for (const token of tokens) {
      if (titleLower.includes(token)) score += 20;
      if (tags.some(t => t.includes(token))) score += 15;
      if (contentLower.includes(token)) {
        const count = contentLower.split(token).length - 1;
        score += Math.min(count * 3, 20);
      }
    }

    if (score > 0) {
      results.push({ ...chunk, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Mengambil aturan tertentu berdasarkan ID
 * @param {string} id - ID aturan (misal: "huruf-kapital#1" atau "tanda-titik#1")
 * @returns {object|null}
 */
function getRuleById(id) {
  if (!id) return null;
  const chunks = getRAGChunks();
  return chunks.find(c => c.id === id) || null;
}

module.exports = {
  checkEyd,
  getLeksikon,
  getAllRules,
  getRAGChunks,
  searchRules,
  getRuleById
};
