const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { reviewAcademic, checkEyd } = require('../src');
const { createEydServer } = require('../src/server');
const { handleToolCall } = require('../src/mcp-server');
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'bin/cli.js');
const run = (args, input, cwd) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', input, cwd });
const codes = result => result.findings.map(f => f.code);
const apa = 'Menurut Sari (2024a), metode ini dapat digunakan. Temuan berikut mendukungnya (Sari, 2024b; Budi & Citra, 2023).\n\n## Daftar Pustaka\nSari, A. (2024a). Judul pertama.\nSari, A. (2024b). Judul kedua.\nBudi, B., & Citra, C. (2023). Judul ketiga.';
const ieee = 'Temuan [1], [2, 3], [1–3], dan [1]–[3] dibahas.\n\nReferences\n[1] A. Sari, Judul pertama.\n[2] B. Budi, Judul kedua.\n[3] C. Citra, Judul ketiga.';

test('APA narrative, groups, two authors, year suffixes and CRLF', () => {
  for (const text of [apa, apa.replace(/\n/g, '\r\n')]) {
    const result = reviewAcademic(text, { citationStyle: 'apa' });
    assert.deepEqual(result.findings, []);
    assert.equal(result.citations.items.length, 3);
    assert.equal(result.citations.references.length, 3);
    assert.equal(result.citations.status, 'checked');
    for (const item of [...result.citations.items, ...result.citations.references]) assert.equal(text.slice(item.location.index, item.location.index + item.location.length), item.text);
  }
});

test('APA et al., organization names, multiple years and apostrophes', () => {
  const text = "Sari et al. (2024) membahas temuan (Badan Pusat Statistik, 2023). O'Neil (2022a, 2022b) setuju.\nDaftar Pustaka\nSari, A., Budi, B., & Citra, C. (2024). Artikel.\nBadan Pusat Statistik. (2023). Laporan.\nO'Neil, A. (2022a). Artikel satu.\nO'Neil, A. (2022b). Artikel dua.";
  assert.deepEqual(reviewAcademic(text, { citationStyle: 'apa' }).findings, []);
});

test('APA full author matching, missing and unused references', () => {
  const result = reviewAcademic('(Sari & Citra, 2024)\nDaftar Pustaka\nSari, A., & Budi, B. (2024). Artikel.', { citationStyle: 'apa' });
  assert.ok(codes(result).includes('SITASI_TANPA_RUJUKAN'));
  assert.ok(codes(result).includes('RUJUKAN_TIDAK_DISITASI'));
  assert.equal(result.valid, false);
});

test('APA duplicate keys and ambiguous abbreviated authors', () => {
  const result = reviewAcademic('Sari et al. (2024) setuju.\nDaftar Pustaka\nSari, A., Budi, B., & Citra, C. (2024). Satu.\nSari, A., Budi, B., & Citra, C. (2024). Dua.\nSari, A., Dodi, D., & Eka, E. (2024). Tiga.', { citationStyle: 'apa' });
  assert.ok(codes(result).includes('PENGENAL_RUJUKAN_GANDA'));
  assert.ok(codes(result).includes('SITASI_AMBIGU'));
});

test('IEEE single, grouped and both range notations', () => {
  const result = reviewAcademic(ieee, { citationStyle: 'ieee' });
  assert.deepEqual(result.findings, []);
  assert.equal(result.citations.items.length, 9);
  assert.equal(result.citations.status, 'checked');
});

test('IEEE missing, duplicate and unused entries', () => {
  const result = reviewAcademic('Temuan [1, 3].\nReferences\n[1] A. Judul.\n[1] B. Judul.\n[2] C. Judul.', { citationStyle: 'ieee' });
  for (const code of ['PENGENAL_RUJUKAN_GANDA', 'SITASI_TANPA_RUJUKAN', 'RUJUKAN_TIDAK_DISITASI']) assert.ok(codes(result).includes(code));
});

test('unknown dates, references and invalid/oversized IEEE ranges are partial', () => {
  for (const [text, citationStyle] of [
    ['(Sari, n.d.)\nReferences\nSari, A. (n.d.). Artikel.', 'apa'],
    ['(Sari, 2024)\nReferences\nEntri tidak berformat.', 'apa'],
    ['Temuan [3–1], [1-9999999999999], [1 x].\nReferences\n[1] A. Judul.', 'ieee']
  ]) {
    const result = reviewAcademic(text, { citationStyle });
    assert.equal(result.citations.status, 'partial');
    assert.ok(result.citations.unparsedCount > 0);
    assert.ok(codes(result).includes('FORMAT_SITASI_TIDAK_DIKENALI'));
  }
});

test('missing bibliography and explicit-only citation style', () => {
  const noStyle = reviewAcademic('Hal ini perlu [PERLU DATA: jumlah sampel].');
  assert.equal(noStyle.citations.status, 'not-requested');
  assert.equal(noStyle.valid, true);
  assert.equal(noStyle.findings.every(f => !f.autoFix && f.severity === 'warning'), true);
  const missing = reviewAcademic('Sari (2024) meneliti.', { citationStyle: 'apa' });
  assert.equal(missing.citations.status, 'partial');
  assert.ok(codes(missing).includes('DAFTAR_PUSTAKA_TIDAK_DITEMUKAN'));
});

test('academic correction preserves quotations, statistics, code, links, citations and bibliography', () => {
  const protectedText = '"dimana praktek\nmerubah" “dimana” ‘praktek’ \'merubah\'\n> dimana merubah\n\n`dimana`\n```js\ndimana praktek\n```\n~~~\nmerubah\n~~~\n    dimana\nhttps://example.org/dimana DOI:10.1234/praktek\np < 0,001; 94,2%; -2,5; 2020-2025; [1–3]; (Praktek, 2024); Praktek (2024)\nDaftar Pustaka\nPraktek, A. (2024). dimana merubah.';
  const input = 'dimana penelitian dilakukan?\n' + protectedText;
  const result = checkEyd(input, { mode: 'academic' });
  assert.equal(result.correctedText, 'di mana penelitian dilakukan?\n' + protectedText);
  const general = checkEyd('dimana');
  assert.equal(general.correctedText, 'di mana');
  assert.equal(checkEyd('```\ndimana', { mode: 'academic' }).correctedText, '```\ndimana');
});

test('advisory style does not change prose or universally prohibit first person', () => {
  const text = 'Saya dan kami menguji model. Hal ini sangat signifikan.';
  const result = reviewAcademic(text);
  assert.equal(result.eyd.correctedText, text);
  assert.ok(!codes(result).includes('RAGAM_AKADEMIK'));
  assert.ok(codes(result).includes('ACUAN_KABUR'));
  assert.ok(codes(result).includes('UNGKAPAN_BERLEBIHAN'));
  assert.equal(reviewAcademic(text, { avoidFirstPerson: true }).findings.some(f => f.code === 'RAGAM_AKADEMIK' && !f.autoFix), true);
  assert.ok(codes(reviewAcademic('Dari hasil analisis menunjukkan peningkatan.')).includes('SUBJEK_TIDAK_JELAS'));
});

test('quotes and code do not become evidence placeholders or citation findings', () => {
  const text = '`[PERLU DATA: n] (Palsu, 2024)`\n> (Palsu, 2024)\n"[PERLU RUJUKAN: klaim]"\n```\nReferences\n```\nSari (2024) setuju.\nReferences\nSari, A. (2024). Judul.';
  assert.deepEqual(reviewAcademic(text, { citationStyle: 'apa' }).findings, []);
});

test('invalid public inputs fail consistently', () => {
  for (const text of ['', ' ', null, 42]) assert.throws(() => reviewAcademic(text), TypeError);
  for (const options of [null, [], { citationStyle: 'vancouver' }, { avoidFirstPerson: 'yes' }, { ignoreWords: [42] }]) {
    assert.throws(() => reviewAcademic('Naskah.', options), TypeError);
    assert.throws(() => handleToolCall('review_academic', { text: 'Naskah.', options }), TypeError);
  }
});

test('CLI reports the same JSON and has exit codes 0, 1, 2 without mutations', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eyd-academic-'));
  try {
    const file = path.join(dir, 'naskah.md');
    fs.writeFileSync(file, apa);
    const ok = run(['academic', file, '--citation-style=apa', '--json']);
    assert.equal(ok.status, 0, ok.stderr);
    assert.deepEqual(JSON.parse(ok.stdout), reviewAcademic(apa, { citationStyle: 'apa' }));
    assert.equal(fs.readFileSync(file, 'utf8'), apa);
    assert.equal(run(['academic', '--json'], 'Hal ini perlu ditinjau.').status, 0);
    assert.equal(run(['academic', '-', '--citation-style', 'apa'], '(Sari, 2024)').status, 1);
    assert.equal(run(['academic', '--citation-style=wrong'], 'Naskah.').status, 2);
    assert.equal(run(['academic', '--fix'], 'Naskah.').status, 2);
    assert.equal(run(['academic', path.join(dir, 'missing.md')]).status, 2);
    assert.equal(run(['academic'], '').status, 2);
    assert.equal(run(['academic', '--format=xml'], 'Naskah.').status, 2);
    const fixFile = path.join(dir, 'fix.md');
    const input = 'dimana hasilnya? "praktek" 2020-2025\nReferences\nPraktek, A. (2024). dimana.';
    fs.writeFileSync(fixFile, input);
    run(['check', fixFile, '--mode=academic', '--fix']);
    assert.equal(fs.readFileSync(fixFile, 'utf8'), checkEyd(input, { mode: 'academic' }).correctedText);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('REST API, MCP calls and stdio protocol share library results', async () => {
  const server = createEydServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/academic`;
  try {
    for (const [text, citationStyle] of [[apa, 'apa'], [ieee, 'ieee']]) {
      const payload = { text, options: { citationStyle } };
      const expected = reviewAcademic(text, payload.options);
      const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), expected);
      assert.deepEqual(handleToolCall('review_academic', payload), expected);
      const request = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'review_academic', arguments: payload } };
      const processResult = spawnSync(process.execPath, [path.join(root, 'src/mcp-server.js')], { input: JSON.stringify(request) + '\n', encoding: 'utf8' });
      assert.equal(processResult.status, 0, processResult.stderr);
      assert.deepEqual(JSON.parse(JSON.parse(processResult.stdout).result.content[0].text), expected);
    }
    for (const body of ['{', 'null', '{}', JSON.stringify({ text: 'Naskah.', options: { citationStyle: 'x' } })]) {
      const res = await fetch(url, { method: 'POST', body });
      assert.equal(res.status, 400);
    }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

test('custom and project installations include standalone academic resources', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eyd-install-'));
  const required = ['SKILL.md', 'skills/eyd-v-academic/SKILL.md', 'skills/eyd-v-academic/references/bahasa-akademik.md', 'skills/eyd-v-academic/references/matriks-literatur.md', 'skills/eyd-v-academic/references/pemeriksaan-klaim.md', 'skills/eyd-v-academic/references/sitasi.md', 'skills/eyd-v-academic/templates/imrad-abstract.md', 'docs/02-penulisan-kata/kata-depan.md'];
  try {
    const custom = path.join(dir, 'custom');
    assert.equal(run(['install', '--target', custom], undefined, dir).status, 0);
    for (const f of required) assert.ok(fs.existsSync(path.join(custom, f)), f);
    assert.equal(run(['install', '--claude', '--cursor', '--windsurf', '--copilot', '--cline'], undefined, dir).status, 0);
    for (const bundle of ['.claude/skills/eyd-v', '.agents/skills/eyd-v']) {
      for (const f of required) assert.ok(fs.existsSync(path.join(dir, bundle, f)), `${bundle}/${f}`);
    }
    assert.ok(fs.readFileSync(path.join(dir, '.github/copilot-instructions.md'), 'utf8').includes('.agents/skills/eyd-v/skills/eyd-v-academic/SKILL.md'));
    const sandboxedHomeInstall = spawnSync(process.execPath, ['-e', "const cli = process.argv[1]; const home = process.argv[2]; require('os').homedir = () => home; process.argv = [process.execPath, cli, 'install', '--antigravity']; require(cli);", cli, dir], { encoding: 'utf8', cwd: dir });
    assert.equal(sandboxedHomeInstall.status, 0, sandboxedHomeInstall.stderr);
    for (const f of required) assert.ok(fs.existsSync(path.join(dir, '.gemini/config/skills/eyd-v', f)), f);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('unrecognized entries, incomplete delimiters and unsupported aliases stay visible', () => {
  for (const [text, citationStyle] of [
    ['(Sari, 2024)\nReferences\nSari, A. (2024). Judul.\nEntri tidak dikenali.', 'apa'],
    ['Sari (2024\nReferences\nSari, A. (2024). Judul.', 'apa'],
    ['Temuan [1\nReferences\n[1] A. Judul.', 'ieee'],
    ['Temuan [1]–[x].\nReferences\n[1] A. Judul.', 'ieee'],
    ['(Badan Pusat Statistik [BPS], 2024)\nReferences\nBadan Pusat Statistik. (2024). Data.', 'apa'],
    ['Naskah.\nReferences\n', 'apa']
  ]) {
    const report = reviewAcademic(text, { citationStyle });
    assert.equal(report.citations.status, 'partial', text);
    assert.ok(codes(report).includes('FORMAT_SITASI_TIDAK_DIKENALI'), text);
  }
});

test('wrapped references keep original locations and first-person suggestions are advisory', () => {
  const text = '(Sari, 2024)\r\nReferences\r\nSari, A. (2024). Judul\r\n  lanjutan.\r\n';
  const result = reviewAcademic(text, { citationStyle: 'apa' });
  assert.deepEqual(result.findings, []);
  const ref = result.citations.references[0];
  assert.equal(text.slice(ref.location.index, ref.location.index + ref.location.length), ref.text);
  const protectedName = 'Praktek (n.d.) melaporkan temuan.';
  assert.equal(checkEyd(protectedName, { mode: 'academic' }).correctedText, protectedName);
});
