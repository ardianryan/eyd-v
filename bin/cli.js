#!/usr/bin/env node

/**
 * EYD V Command Line Interface (CLI)
 * Universal tool for Indonesian spelling checking, rule searching, and Agent Skill installer
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');
const { checkEyd, searchRules, getRuleById, listCategories, checkSingleWord, lookupTechTerm, getTechTerms, startServer } = require('../src/index');
const { startMcpServer } = require('../src/mcp-server');

const PKG = require('../package.json');
const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : null;

// ANSI Colors
const COLOR = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

function loadConfig() {
  const possibleFiles = ['.eydvrc.json', 'eyd.config.json', '.eydvrc'];
  for (const f of possibleFiles) {
    const full = path.resolve(process.cwd(), f);
    if (fs.existsSync(full)) {
      try {
        return JSON.parse(fs.readFileSync(full, 'utf8'));
      } catch (e) {
        console.warn(`${COLOR.yellow}⚠️ Gagal membaca berkas konfigurasi ${f}: ${e.message}${COLOR.reset}`);
      }
    }
  }
  return {};
}

function printBanner() {
  console.log(`
${COLOR.cyan}${COLOR.bold}================================================================${COLOR.reset}
${COLOR.bold}🇮🇩  EYD V: Ejaan Bahasa Indonesia yang Disempurnakan (Edisi V)${COLOR.reset}
${COLOR.dim}    Kemendikdasmen RI | Universal AI Agent Skill, Dataset & Linter${COLOR.reset}
${COLOR.dim}    Versi ${PKG.version} | Ardian Ryan <me@ardianryan.com>${COLOR.reset}
${COLOR.cyan}================================================================${COLOR.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`${COLOR.bold}PENGGUNAAN:${COLOR.reset}
  npx eyd-v <perintah> [opsi/argumen]

${COLOR.bold}PERINTAH UTAMA:${COLOR.reset}
  ${COLOR.green}check${COLOR.reset} <teks|berkas>      Periksa ejaan & tata bahasa EYD V (dapat di-pipe)
  ${COLOR.green}kata${COLOR.reset} <kata>              Periksa kebakaan satu kata secara instan
  ${COLOR.green}istilah${COLOR.reset} <istilah>        Cari padanan resmi istilah teknologi & AI (120+ istilah)
  ${COLOR.green}serve${COLOR.reset} [--port 3000]       Jalankan REST API microservice bawaan
  ${COLOR.green}watch${COLOR.reset} <direktori>         Pantau berkas markdown/teks secara realtime
  ${COLOR.green}repl${COLOR.reset}                     Jalankan playground interaktif di terminal
  ${COLOR.green}prompt${COLOR.reset}                   Tampilkan / salin System Prompt optimal ke clipboard
  ${COLOR.green}search${COLOR.reset} <kata kunci>      Cari pasal dan kaidah ejaan resmi
  ${COLOR.green}list${COLOR.reset}                     Lihat daftar bab dan pasal EYD V
  ${COLOR.green}rule${COLOR.reset} <id-pasal>          Tampilkan isi lengkap satu pasal
  ${COLOR.green}install${COLOR.reset}                  Pasang Agent Skill ke IDE / AI coding agent
  ${COLOR.green}mcp${COLOR.reset}                      Jalankan Model Context Protocol (MCP) server stdio
  ${COLOR.green}hook${COLOR.reset} / ${COLOR.green}init-hook${COLOR.reset}         Pasang Git pre-commit hook otomatis

${COLOR.bold}OPSI PERINTAH CHECK:${COLOR.reset}
  --mode=[ux|marketing|seo|academic]  Pilih ranah penulisan profesional
  --score                             Tampilkan metrik & skor keterbacaan naskah
  --staged                            Periksa hanya berkas yang di-stage di git
  --format=[human|json|github]        Format keluaran (human, json, atau github annotations)
  --fix, -f                           Terapkan perbaikan otomatis langsung ke berkas (in-place)
  --json                              Keluarkan hasil pemeriksaan dalam format JSON mesin

${COLOR.bold}OPSI PERINTAH PROMPT:${COLOR.reset}
  --copy, -c               Salin naskah System Prompt langsung ke Clipboard OS

${COLOR.bold}OPSI PERINTAH INSTALL:${COLOR.reset}
  --all                    Pasang ke semua platform (Antigravity, Cursor, Windsurf, Claude, Copilot, Cline)
  --antigravity            Pasang skill ke Google Antigravity (~/.gemini/config/skills/eyd-v)
  --cursor                 Pasang rules ke Cursor IDE (.cursor/rules/eyd-v.mdc & .cursorrules)
  --windsurf               Pasang rules ke Windsurf (.windsurfrules)
  --claude                 Pasang skill ke Claude Code (.claude/skills/eyd-v/SKILL.md)
  --copilot                Pasang instruksi ke GitHub Copilot (.github/copilot-instructions.md)
  --cline                  Pasang rules ke Cline / Roo Code (.clinerules)
  --target <dir>           Pasang berkas SKILL.md ke direktori kustom

${COLOR.bold}CONTOH PENGGUNAAN:${COLOR.reset}
  npx eyd-v check "Dimana kamu pasca sarjana?"
  npx eyd-v check artikel.md --mode=seo --score
  npx eyd-v check --staged
  npx eyd-v kata antri
  npx eyd-v istilah cache
  npx eyd-v serve --port 3000
  npx eyd-v watch docs/
`);
}

function checkI18nJson(content, options = {}) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    return null;
  }

  const errors = [];
  function traverse(obj, currentPath = '') {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const p = currentPath ? `${currentPath}.${key}` : key;
      if (typeof val === 'string') {
        const res = checkEyd(val, options);
        if (!res.valid) {
          res.errors.forEach(err => {
            errors.push({ ...err, jsonPath: p });
          });
          obj[key] = res.correctedText;
        }
      } else if (typeof val === 'object' && val !== null) {
        traverse(val, p);
      }
    }
  }

  traverse(parsed);
  return {
    valid: errors.length === 0,
    errorCount: errors.length,
    errors: errors,
    correctedText: JSON.stringify(parsed, null, 2)
  };
}

// 1. Perintah CHECK
function handleCheck() {
  const flags = args.filter(a => a.startsWith('-'));
  const isFix = flags.includes('--fix') || flags.includes('-f');
  const isJson = flags.includes('--json') || flags.includes('--format=json');
  const isGithub = flags.includes('--format=github');
  const isScore = flags.includes('--score');
  const isStaged = flags.includes('--staged');

  // Baca konfigurasi lokal jika ada
  const config = loadConfig();

  // Mode pemeriksaan
  let mode = config.mode || 'general';
  const modeFlag = flags.find(f => f.startsWith('--mode='));
  if (modeFlag) {
    mode = modeFlag.split('=')[1].toLowerCase();
  }

  const checkOptions = {
    mode: mode,
    ignoreWords: config.ignoreWords || [],
    preferredPronoun: config.preferredPronoun || null
  };

  // Jika --staged dipilih
  if (isStaged) {
    try {
      const output = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
      const stagedFiles = output.split('\n')
        .map(f => f.trim())
        .filter(f => f && /\.(md|txt|json)$/i.test(f));

      if (stagedFiles.length === 0) {
        console.log(`${COLOR.green}✨ Tidak ada berkas teks/markdown/json yang di-stage di git.${COLOR.reset}`);
        process.exit(0);
      }

      console.log(`\n${COLOR.cyan}🔍 Memeriksa ${stagedFiles.length} berkas staged di git:${COLOR.reset}\n`);
      let hasError = false;

      for (const f of stagedFiles) {
        const full = path.resolve(process.cwd(), f);
        if (fs.existsSync(full)) {
          const content = fs.readFileSync(full, 'utf8');
          const isJsonFile = f.toLowerCase().endsWith('.json');
          const result = isJsonFile ? checkI18nJson(content, checkOptions) : checkEyd(content, checkOptions);

          if (!result.valid) {
            hasError = true;
            console.log(`${COLOR.yellow}⚠️ ${f}: ${result.errorCount} potensi ketidaksesuaian EYD V${COLOR.reset}`);
            result.errors.forEach((err, idx) => {
              if (isGithub) {
                console.log(`::warning file=${f},line=1,col=1::[${err.type}] ${err.original} -> ${err.suggestion}. ${err.rule}`);
              } else {
                console.log(`   ${COLOR.bold}${idx + 1}.${COLOR.reset} "${COLOR.red}${err.original}${COLOR.reset}" ➔ "${COLOR.green}${err.suggestion}${COLOR.reset}" (${COLOR.dim}${err.rule}${COLOR.reset})`);
              }
            });
            console.log('');
          } else {
            console.log(`${COLOR.green}✅ ${f}: Sesuai kaidah${COLOR.reset}`);
          }
        }
      }

      if (hasError) {
        console.log(`\n${COLOR.red}❌ Terdapat pelanggaran ejaan pada berkas staged.${COLOR.reset}`);
        process.exit(1);
      } else {
        console.log(`\n${COLOR.green}🎉 Seluruh berkas staged lulus validasi EYD V!${COLOR.reset}\n`);
        process.exit(0);
      }
    } catch (e) {
      console.error(`${COLOR.red}❌ Gagal menjalankan git diff: ${e.message}${COLOR.reset}`);
      process.exit(1);
    }
  }

  const rawTarget = args.slice(1).filter(a => !a.startsWith('-')).join(' ').trim();

  // Cek apakah ada input via Stdin (pipe)
  if (!rawTarget && !process.stdin.isTTY) {
    let stdinData = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { stdinData += chunk; });
    process.stdin.on('end', () => {
      runCheckProcess(stdinData.trim(), false, isFix, isJson, isGithub, isScore, null, checkOptions);
    });
    return;
  }

  if (!rawTarget) {
    console.error(`${COLOR.red}❌ Harap masukkan teks atau path berkas yang ingin diperiksa.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v check "Dimana letak pasca sarjana?" atau npx eyd-v check artikel.md --mode=seo`);
    process.exit(1);
  }

  let textToCheck = rawTarget;
  let isFile = false;
  let filePath = null;

  if (fs.existsSync(rawTarget)) {
    try {
      textToCheck = fs.readFileSync(rawTarget, 'utf8');
      isFile = true;
      filePath = path.resolve(rawTarget);
    } catch (e) {
      // treat as plain text
    }
  }

  runCheckProcess(textToCheck, isFile, isFix, isJson, isGithub, isScore, filePath, checkOptions);
}

function runCheckProcess(textToCheck, isFile, isFix, isJson, isGithub, isScore, filePath, options) {
  const isJsonFile = isFile && filePath && filePath.toLowerCase().endsWith('.json');
  const result = isJsonFile ? (checkI18nJson(textToCheck, options) || checkEyd(textToCheck, options)) : checkEyd(textToCheck, options);

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  }

  if (isGithub) {
    result.errors.forEach(err => {
      console.log(`::warning file=${filePath || 'stdin'},line=1,col=1::[${err.type}] ${err.original} -> ${err.suggestion}. ${err.rule}`);
    });
    if (!result.valid) {
      process.exit(1);
    }
    process.exit(0);
  }

  if (result.valid) {
    console.log(`\n${COLOR.green}✨ Sempurna! Tidak ditemukan pelanggaran EYD V pada teks ini.${COLOR.reset}`);
    if (isScore && result.readability) {
      printReadability(result.readability);
    }
    console.log('');
    process.exit(0);
  }

  if (isFile) {
    console.log(`${COLOR.blue}📄 Memeriksa berkas:${COLOR.reset} ${filePath} ${options.mode !== 'general' ? `[Mode: ${options.mode}]` : ''}`);
  }

  console.log(`\n${COLOR.yellow}${COLOR.bold}⚠️ Ditemukan ${result.errorCount} potensi ketidaksesuaian EYD V:${COLOR.reset}\n`);

  result.errors.forEach((err, idx) => {
    const loc = err.jsonPath ? ` [Kunci: ${err.jsonPath}]` : '';
    console.log(`${COLOR.bold}${idx + 1}. [${COLOR.red}${err.type}${COLOR.reset}${COLOR.bold}]${COLOR.reset}${loc} "${COLOR.red}${err.original}${COLOR.reset}" ➔ "${COLOR.green}${COLOR.bold}${err.suggestion}${COLOR.reset}"`);
    console.log(`   ${COLOR.dim}Kaidah :${COLOR.reset} ${err.rule}`);
    if (err.reference) {
      console.log(`   ${COLOR.dim}Rujukan:${COLOR.reset} https://ejaan.kemendikdasmen.go.id/${err.reference}`);
    }
    console.log('');
  });

  if (isScore && result.readability) {
    printReadability(result.readability);
  }

  if (isFile && isFix) {
    const backupFile = filePath + '.bak';
    fs.writeFileSync(backupFile, textToCheck, 'utf8');
    fs.writeFileSync(filePath, result.correctedText, 'utf8');
    console.log(`${COLOR.green}${COLOR.bold}✅ Berkas berhasil diperbaiki secara in-place:${COLOR.reset} ${filePath}`);
    console.log(`${COLOR.dim}Cadangan berkas asli disimpan di:${COLOR.reset} ${backupFile}\n`);
  } else if (isFile) {
    console.log(`${COLOR.cyan}💡 Gunakan opsi --fix untuk menerapkan perbaikan otomatis langsung ke berkas:${COLOR.reset}`);
    console.log(`   npx eyd-v check "${filePath}" --fix\n`);
  } else {
    console.log(`${COLOR.bold}${COLOR.cyan}Rekomendasi Teks Bersih:${COLOR.reset}`);
    console.log(`${COLOR.green}${result.correctedText}${COLOR.reset}\n`);
  }

  process.exit(result.valid ? 0 : 1);
}

function printReadability(readability) {
  console.log(`${COLOR.bold}${COLOR.cyan}📊 Skor Keterbacaan Naskah (Readability Score):${COLOR.reset}`);
  console.log(`   ${COLOR.bold}Indeks Keterbacaan :${COLOR.reset} ${COLOR.green}${readability.score}/100${COLOR.reset} (${readability.grade})`);
  console.log(`   ${COLOR.bold}Jumlah Kata        :${COLOR.reset} ${readability.wordCount} kata`);
  console.log(`   ${COLOR.bold}Jumlah Kalimat     :${COLOR.reset} ${readability.sentenceCount} kalimat`);
  console.log(`   ${COLOR.bold}Rata-rata Kata/Klm :${COLOR.reset} ${readability.avgWordsPerSentence} kata/kalimat`);
  console.log(`   ${COLOR.bold}Rasio Verba Aktif  :${COLOR.reset} ${readability.activeRatio}% aktif\n`);
}

// 2. Perintah PROMPT (Tampilkan / Salin System Prompt)
function handlePrompt() {
  const rootPkgDir = path.resolve(__dirname, '..');
  const promptFile = path.join(rootPkgDir, 'prompts/system-prompt-indonesia.md');
  const content = fs.readFileSync(promptFile, 'utf8');

  // Ambil hanya isi markdown di dalam backticks bila ada
  let promptText = content;
  const match = content.match(/```markdown\n([\s\S]*?)\n```/);
  if (match) {
    promptText = match[1];
  }

  const isCopy = args.includes('--copy') || args.includes('-c');

  if (isCopy) {
    try {
      const platform = os.platform();
      if (platform === 'darwin') {
        execSync('pbcopy', { input: promptText });
      } else if (platform === 'win32') {
        execSync('clip', { input: promptText });
      } else {
        execSync('xclip -selection clipboard || xsel -b', { input: promptText });
      }
      console.log(`\n${COLOR.green}${COLOR.bold}📋 Berhasil menyalin System Prompt EYD V ke Clipboard!${COLOR.reset}`);
      console.log(`${COLOR.dim}Buka ChatGPT Web, Claude.ai, atau Gemini ➔ Tekan Paste (Ctrl+V / Cmd+V) di kolom Custom Instructions/System Prompt.${COLOR.reset}\n`);
      return;
    } catch (e) {
      console.warn(`⚠️ Tidak dapat menyalin otomatis ke clipboard (${e.message}). Menampilkan teks di bawah:\n`);
    }
  }

  console.log(`\n${COLOR.bold}${COLOR.cyan}=== SYSTEM PROMPT EYD V INDONESIA ===${COLOR.reset}\n`);
  console.log(promptText);
  console.log(`\n${COLOR.dim}Tip: Gunakan "npx eyd-v prompt --copy" untuk langsung menyalin ke clipboard OS.${COLOR.reset}\n`);
}

// 3. Perintah REPL (Interactive Terminal)
function handleRepl() {
  printBanner();
  console.log(`${COLOR.bold}${COLOR.green}🎮 Memulai Playground Interaktif EYD V...${COLOR.reset}`);
  console.log(`${COLOR.dim}Ketik teks bahasa Indonesia untuk langsung diuji. Ketik ".exit" atau tekan Ctrl+C untuk keluar.${COLOR.reset}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${COLOR.cyan}eyd-v > ${COLOR.reset}`
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }
    if (input.toLowerCase() === '.exit' || input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const res = checkEyd(input);
    if (res.valid) {
      console.log(`${COLOR.green}✨ Sesuai EYD V! Tidak ada kesalahan ejaan.${COLOR.reset}\n`);
    } else {
      console.log(`${COLOR.yellow}⚠️  Ditemukan ${res.errorCount} kesalahan:${COLOR.reset}`);
      res.errors.forEach(e => {
        console.log(`   • ${COLOR.red}${e.original}${COLOR.reset} ➔ ${COLOR.green}${e.suggestion}${COLOR.reset} (${COLOR.dim}${e.rule}${COLOR.reset})`);
      });
      console.log(`${COLOR.cyan}Hasil Bersih:${COLOR.reset} ${res.correctedText}\n`);
    }
    rl.prompt();
  }).on('close', () => {
    console.log(`\n${COLOR.dim}Terima kasih telah menggunakan EYD V! Sampai jumpa.${COLOR.reset}\n`);
    process.exit(0);
  });
}

// 4. Perintah SEARCH
function handleSearch() {
  const query = args.slice(1).join(' ').trim();
  if (!query) {
    console.error(`${COLOR.red}❌ Harap masukkan kata kunci pencarian.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v search "tanda koma"`);
    process.exit(1);
  }

  console.log(`${COLOR.cyan}🔍 Menelusuri aturan EYD V untuk:${COLOR.reset} "${query}"...\n`);
  const results = searchRules(query, { limit: 5 });

  if (results.length === 0) {
    console.log(`${COLOR.yellow}Tidak ditemukan aturan yang cocok dengan kata kunci "${query}".${COLOR.reset}`);
    console.log(`Coba kata kunci lain seperti: "kapital", "koma", "titik dua", "partikel", "imbuhan", "serapan".`);
    process.exit(0);
  }

  results.forEach((r, idx) => {
    console.log(`${COLOR.bold}${COLOR.green}${idx + 1}. ${r.title}${COLOR.reset} ${COLOR.dim}(Skor: ${r.score})${COLOR.reset}`);
    console.log(`   ${COLOR.dim}Kategori: ${r.category} | ID: ${r.id}${COLOR.reset}`);
    console.log(`   ${COLOR.dim}Tautan  : ${r.url}${COLOR.reset}\n`);

    const preview = r.content.split('\n').slice(0, 8).join('\n   ');
    console.log(`   ${preview}`);
    console.log(`\n   ${COLOR.dim}Ketik "npx eyd-v rule ${r.id}" untuk membaca pasal lengkap.${COLOR.reset}\n`);
  });
}

// 5. Perintah LIST
function handleList() {
  console.log(`${COLOR.bold}${COLOR.cyan}📚 Daftar Bab & Subbab Resmi EYD Edisi Kelima:${COLOR.reset}\n`);
  const categories = listCategories();

  categories.forEach((cat, idx) => {
    console.log(`${COLOR.bold}${idx + 1}. ${cat.title} (${cat.count} subbab)${COLOR.reset}`);
    cat.documents.forEach(doc => {
      console.log(`   • ${doc.title} ${COLOR.dim}(${doc.slug})${COLOR.reset}`);
    });
    console.log('');
  });
}

// 6. Perintah RULE
function handleRule() {
  const id = args[1];
  if (!id) {
    console.error(`${COLOR.red}❌ Masukkan ID pasal yang ingin dibaca.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v rule "tanda-titik#1"`);
    process.exit(1);
  }

  const rule = getRuleById(id);
  if (!rule) {
    console.error(`${COLOR.red}❌ Pasal dengan ID '${id}' tidak ditemukan.${COLOR.reset}`);
    process.exit(1);
  }

  console.log(`\n${COLOR.bold}${COLOR.green}${rule.title}${COLOR.reset}`);
  console.log(`${COLOR.dim}Kategori: ${rule.category} | ${rule.url}${COLOR.reset}\n`);
  console.log(rule.content);
  console.log('');
}

// 7. Perintah INSTALL
function handleInstall() {
  printBanner();
  const hasFlag = (flag) => args.includes(flag);
  const targetIndex = args.indexOf('--target');
  const customTarget = targetIndex !== -1 ? args[targetIndex + 1] : null;

  const rootPkgDir = path.resolve(__dirname, '..');
  const skillSource = path.join(rootPkgDir, 'SKILL.md');
  const cursorSource = path.join(rootPkgDir, 'templates/cursor/eyd-v.mdc');
  const cursorrulesSource = path.join(rootPkgDir, 'templates/.cursorrules');
  const claudeSource = path.join(rootPkgDir, 'templates/claude/CLAUDE.md');
  const windsurfSource = path.join(rootPkgDir, 'templates/windsurf/.windsurfrules');
  const copilotSource = path.join(rootPkgDir, 'templates/copilot/copilot-instructions.md');
  const clineSource = path.join(rootPkgDir, 'templates/cline/.clinerules');

  if (customTarget) {
    const dest = path.resolve(customTarget);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(skillSource, path.join(dest, 'SKILL.md'));
    console.log(`✅ [Custom Target] Skill terpasang di: ${path.join(dest, 'SKILL.md')}`);
    return;
  }

  const installAll = hasFlag('--all');
  const installAntigravity = hasFlag('--antigravity') || installAll;
  const installCursor = hasFlag('--cursor') || installAll;
  const installWindsurf = hasFlag('--windsurf') || installAll;
  const installClaude = hasFlag('--claude') || installAll;
  const installCopilot = hasFlag('--copilot') || installAll;
  const installCline = hasFlag('--cline') || installAll;

  // Jika tidak ada argumen sama sekali di terminal TTY, tampilkan prompt interaktif
  const noFlags = !installAntigravity && !installCursor && !installWindsurf && !installClaude && !installCopilot && !installCline && !installAll;

  if (noFlags && process.stdin.isTTY) {
    showInteractiveInstallMenu();
    return;
  }

  executeInstallation({
    antigravity: installAntigravity || noFlags,
    cursor: installCursor || noFlags,
    windsurf: installWindsurf,
    claude: installClaude || noFlags,
    copilot: installCopilot,
    cline: installCline
  });
}

function showInteractiveInstallMenu() {
  console.log(`${COLOR.bold}Pilih platform yang ingin dipasangi aturan EYD V:${COLOR.reset}`);
  console.log(`1. 🚀 Google Antigravity (~/.gemini/config/skills/eyd-v)`);
  console.log(`2. 🖱️  Cursor IDE (.cursor/rules & .cursorrules)`);
  console.log(`3. 🏄 Windsurf / Cascade (.windsurfrules)`);
  console.log(`4. 🤖 Claude Code CLI (.claude/skills/eyd-v)`);
  console.log(`5. 🐙 GitHub Copilot (.github/copilot-instructions.md)`);
  console.log(`6. 🦾 Cline / Roo Code (.clinerules)`);
  console.log(`7. 🌟 Pasang ke SEMUA Platform di atas (Recommended)`);
  console.log(`0. Batal\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`${COLOR.cyan}Masukkan nomor pilihan (1-7, atau dipisah koma misal: 1,2,3): ${COLOR.reset}`, (answer) => {
    rl.close();
    const ans = answer.trim();
    if (!ans || ans === '0') {
      console.log(`Pemasangan dibatalkan.`);
      return;
    }

    if (ans === '7') {
      executeInstallation({ antigravity: true, cursor: true, windsurf: true, claude: true, copilot: true, cline: true });
      return;
    }

    const choices = ans.split(',').map(s => s.trim());
    executeInstallation({
      antigravity: choices.includes('1'),
      cursor: choices.includes('2'),
      windsurf: choices.includes('3'),
      claude: choices.includes('4'),
      copilot: choices.includes('5'),
      cline: choices.includes('6')
    });
  });
}

function executeInstallation(targets) {
  const rootPkgDir = path.resolve(__dirname, '..');
  const skillSource = path.join(rootPkgDir, 'SKILL.md');
  const cursorSource = path.join(rootPkgDir, 'templates/cursor/eyd-v.mdc');
  const cursorrulesSource = path.join(rootPkgDir, 'templates/.cursorrules');
  const claudeSource = path.join(rootPkgDir, 'templates/claude/CLAUDE.md');
  const windsurfSource = path.join(rootPkgDir, 'templates/windsurf/.windsurfrules');
  const copilotSource = path.join(rootPkgDir, 'templates/copilot/copilot-instructions.md');
  const clineSource = path.join(rootPkgDir, 'templates/cline/.clinerules');

  let count = 0;

  if (targets.antigravity) {
    try {
      const dir = path.join(os.homedir(), '.gemini/config/skills/eyd-v');
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(skillSource, path.join(dir, 'SKILL.md'));
      console.log(`✅ [Google Antigravity] Terpasang di: ${path.join(dir, 'SKILL.md')}`);
      count++;
    } catch (e) { console.warn(`⚠️ Antigravity error: ${e.message}`); }
  }

  if (targets.cursor) {
    try {
      const dir = path.resolve(process.cwd(), '.cursor/rules');
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(cursorSource, path.join(dir, 'eyd-v.mdc'));
      fs.copyFileSync(cursorrulesSource, path.resolve(process.cwd(), '.cursorrules'));
      console.log(`✅ [Cursor IDE] Rules terpasang di: .cursor/rules/eyd-v.mdc & .cursorrules`);
      count++;
    } catch (e) { console.warn(`⚠️ Cursor error: ${e.message}`); }
  }

  if (targets.windsurf) {
    try {
      fs.copyFileSync(windsurfSource, path.resolve(process.cwd(), '.windsurfrules'));
      console.log(`✅ [Windsurf] Rules terpasang di: .windsurfrules`);
      count++;
    } catch (e) { console.warn(`⚠️ Windsurf error: ${e.message}`); }
  }

  if (targets.claude) {
    try {
      const dir = path.resolve(process.cwd(), '.claude/skills/eyd-v');
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(skillSource, path.join(dir, 'SKILL.md'));
      fs.copyFileSync(claudeSource, path.join(dir, 'CLAUDE.md'));
      console.log(`✅ [Claude Code] Skill terpasang di: .claude/skills/eyd-v/SKILL.md`);
      count++;
    } catch (e) { console.warn(`⚠️ Claude error: ${e.message}`); }
  }

  if (targets.copilot) {
    try {
      const dir = path.resolve(process.cwd(), '.github');
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(copilotSource, path.join(dir, 'copilot-instructions.md'));
      console.log(`✅ [GitHub Copilot] Instructions terpasang di: .github/copilot-instructions.md`);
      count++;
    } catch (e) { console.warn(`⚠️ Copilot error: ${e.message}`); }
  }

  if (targets.cline) {
    try {
      fs.copyFileSync(clineSource, path.resolve(process.cwd(), '.clinerules'));
      console.log(`✅ [Cline / Roo Code] Rules terpasang di: .clinerules`);
      count++;
    } catch (e) { console.warn(`⚠️ Cline error: ${e.message}`); }
  }

  console.log(`\n${COLOR.green}${COLOR.bold}🎉 Selesai! Berhasil memasang ${count} konfigurasi Agent Skill.${COLOR.reset}\n`);
}

// 8. Perintah INIT-HOOK / HOOK
function handleInitHook() {
  const gitDir = path.resolve(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    console.error(`${COLOR.red}❌ Direktori .git tidak ditemukan di lokasi ini.${COLOR.reset}`);
    process.exit(1);
  }

  const hooksDir = path.join(gitDir, 'hooks');
  fs.mkdirSync(hooksDir, { recursive: true });

  const hookFile = path.join(hooksDir, 'pre-commit');
  const hookScript = `#!/bin/sh
# EYD V Pre-commit Linter
echo "🔍 Menjalankan pemeriksaan EYD V sebelum commit..."
npx eyd-v check --staged || exit 1
`;

  fs.writeFileSync(hookFile, hookScript, { mode: 0o755 });
  console.log(`${COLOR.green}✅ Pre-commit hook berhasil dipasang di: ${hookFile}${COLOR.reset}`);
  console.log(`Setiap commit berkas naskah akan otomatis divalidasi dengan aturan EYD V (--staged).`);
}

// 9. Perintah KATA (Cek satu kata cepat)
function handleKata() {
  const word = args[1];
  if (!word) {
    console.error(`${COLOR.red}❌ Harap masukkan satu kata yang ingin diperiksa.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v kata antri`);
    process.exit(1);
  }

  const res = checkSingleWord(word);
  console.log(`\n🔍 ${COLOR.bold}Pemeriksaan Kata:${COLOR.reset} "${COLOR.cyan}${res.word}${COLOR.reset}"`);
  if (res.isBaku) {
    console.log(`✅ Status      : ${COLOR.green}${COLOR.bold}BAKU${COLOR.reset}`);
    console.log(`📖 Keterangan  : ${COLOR.dim}${res.rule}${COLOR.reset}\n`);
  } else {
    console.log(`❌ Status      : ${COLOR.red}${COLOR.bold}TIDAK BAKU${COLOR.reset}`);
    console.log(`✨ Bentuk Baku : ${COLOR.green}${COLOR.bold}${res.suggestion}${COLOR.reset}`);
    console.log(`📚 Rujukan     : ${res.reference}`);
    console.log(`📖 Keterangan  : ${COLOR.dim}${res.rule}${COLOR.reset}\n`);
  }
}

// 10. Perintah ISTILAH (Glosarium Teknologi & AI)
function handleIstilah() {
  const query = args.slice(1).join(' ').trim();
  if (!query) {
    console.error(`${COLOR.red}❌ Harap masukkan istilah teknologi yang dicari.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v istilah cache atau npx eyd-v istilah prompt`);
    process.exit(1);
  }

  const results = lookupTechTerm(query);
  console.log(`\n📚 ${COLOR.bold}Glosarium Istilah Teknologi & AI (Hasil untuk "${query}"):${COLOR.reset}\n`);
  if (results.length === 0) {
    console.log(`${COLOR.yellow}Tidak ditemukan padanan langsung untuk "${query}".${COLOR.reset}`);
    console.log(`Panduan lengkap: docs/profesional/05-glosarium-istilah-teknologi-dan-ai.md\n`);
  } else {
    results.forEach((item, idx) => {
      console.log(`${COLOR.bold}${idx + 1}. ${COLOR.cyan}${item.term}${COLOR.reset} [${COLOR.dim}${item.kategori}${COLOR.reset}]`);
      console.log(`   ${COLOR.bold}Padanan Baku :${COLOR.reset} ${COLOR.green}${COLOR.bold}${item.padanan}${COLOR.reset}`);
      if (item.keterangan) {
        console.log(`   ${COLOR.dim}Catatan      :${COLOR.reset} ${item.keterangan}`);
      }
      console.log('');
    });
  }
}

// 11. Perintah SERVE (REST API Microservice)
function handleServe() {
  let port = 3000;
  const portIndex = args.indexOf('--port');
  if (portIndex !== -1 && args[portIndex + 1]) {
    port = parseInt(args[portIndex + 1], 10) || 3000;
  }
  startServer(port);
}

// 12. Perintah WATCH (Realtime File Watcher)
function handleWatch() {
  const targetDir = path.resolve(process.cwd(), args[1] || '.');
  if (!fs.existsSync(targetDir)) {
    console.error(`${COLOR.red}❌ Direktori ${targetDir} tidak ditemukan.${COLOR.reset}`);
    process.exit(1);
  }

  console.log(`\n${COLOR.cyan}${COLOR.bold}👀 Mode Pengawas (Watcher) Aktif:${COLOR.reset} ${targetDir}`);
  console.log(`${COLOR.dim}Memantau perubahan berkas .md, .txt, dan .json. Tekan Ctrl+C untuk berhenti.${COLOR.reset}\n`);

  let debounceTimer = null;
  fs.watch(targetDir, { recursive: true }, (event, filename) => {
    if (!filename || !/\.(md|txt|json)$/i.test(filename)) return;
    if (filename.endsWith('.bak')) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const full = path.join(targetDir, filename);
      if (fs.existsSync(full)) {
        console.log(`\n${COLOR.blue}🔄 Berkas berubah:${COLOR.reset} ${filename}`);
        const content = fs.readFileSync(full, 'utf8');
        const res = checkEyd(content, loadConfig());
        if (res.valid) {
          console.log(`   ${COLOR.green}✅ EYD V: 0 Galat${COLOR.reset}`);
        } else {
          console.log(`   ${COLOR.yellow}⚠️ EYD V: ${res.errorCount} Potensi Galat${COLOR.reset}`);
          res.errors.forEach(e => {
            console.log(`     • "${COLOR.red}${e.original}${COLOR.reset}" ➔ "${COLOR.green}${e.suggestion}${COLOR.reset}" (${e.rule})`);
          });
        }
      }
    }, 200);
  });
}

// Route command
switch (command) {
  case 'check':
    handleCheck();
    break;
  case 'kata':
    handleKata();
    break;
  case 'istilah':
  case 'glosarium':
    handleIstilah();
    break;
  case 'serve':
    handleServe();
    break;
  case 'watch':
    handleWatch();
    break;
  case 'prompt':
    handlePrompt();
    break;
  case 'repl':
    handleRepl();
    break;
  case 'search':
    handleSearch();
    break;
  case 'list':
    handleList();
    break;
  case 'rule':
    handleRule();
    break;
  case 'install':
    handleInstall();
    break;
  case 'hook':
  case 'init-hook':
    handleInitHook();
    break;
  case 'mcp':
    startMcpServer();
    break;
  case '-v':
  case '--version':
    console.log(`eyd-v v${PKG.version}`);
    break;
  case '-h':
  case '--help':
  default:
    printHelp();
    break;
}
