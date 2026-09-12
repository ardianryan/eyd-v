#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { checkEyd, searchRules, getRuleById, getAllRules } = require('../src/index');
const { startMcpServer } = require('../src/mcp-server');

const PKG = require('../package.json');

const args = process.argv.slice(2);
const command = args[0] || '--help';

const COLOR = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function printBanner() {
  console.log(`
${COLOR.cyan}${COLOR.bold}=============================================================
  EYD V - Pedoman Ejaan Bahasa Indonesia yang Disempurnakan
  (Edisi Kelima - Kemendikdasmen RI) | v${PKG.version}
=============================================================${COLOR.reset}
`);
}

function printHelp() {
  printBanner();
  console.log(`
${COLOR.bold}PENGGUNAAN:${COLOR.reset}
  npx eyd-v <perintah> [opsi]

${COLOR.bold}DAFTAR PERINTAH:${COLOR.reset}
  ${COLOR.green}check <teks|file>${COLOR.reset}       Periksa kesalahan ejaan & tata bahasa EYD V pada teks atau berkas
  ${COLOR.green}search <kata-kunci>${COLOR.reset}     Cari pasal dan kaidah resmi EYD V
  ${COLOR.green}list${COLOR.reset}                    Tampilkan seluruh bab dan kategori aturan EYD V
  ${COLOR.green}rule <id>${COLOR.reset}               Tampilkan detail pasal berdasarkan ID
  ${COLOR.green}install [opsi]${COLOR.reset}          Pasang Agent Skill ke environment AI Anda
  ${COLOR.green}mcp${COLOR.reset}                     Jalankan Model Context Protocol (MCP) Server via stdio
  ${COLOR.green}init-hook${COLOR.reset}               Pasang git pre-commit hook untuk auto-lint EYD V
  ${COLOR.green}--help, -h${COLOR.reset}              Tampilkan panduan bantuan ini
  ${COLOR.green}--version, -v${COLOR.reset}           Tampilkan versi aplikasi

${COLOR.bold}OPSI INSTALL:${COLOR.reset}
  --antigravity           Pasang ke Google Antigravity (~/.gemini/antigravity/skills/eyd-v)
  --claude                Pasang ke Claude Code (.claude/skills/eyd-v/ & CLAUDE.md)
  --cursor                Pasang ke Cursor IDE (.cursor/rules/eyd-v.mdc)
  --all                   Pasang ke seluruh direktori AI Agent yang terdeteksi
  --target <dir>          Tentukan direktori target instalasi secara manual

${COLOR.bold}CONTOH PENGGUNAAN:${COLOR.reset}
  npx eyd-v check "Dimana kamu kuliah pasca sarjana?"
  npx eyd-v check README.md
  npx eyd-v search "huruf kapital nama jabatan"
  npx eyd-v install --all
`);
}

// 1. Perintah CHECK
function handleCheck() {
  const target = args.slice(1).join(' ').trim();
  if (!target) {
    console.error(`${COLOR.red}❌ Harap masukkan teks atau path berkas yang ingin diperiksa.${COLOR.reset}`);
    console.log(`Contoh: npx eyd-v check "Dimana letak pasca sarjana?"`);
    process.exit(1);
  }

  let textToCheck = target;
  let isFile = false;

  if (fs.existsSync(target)) {
    try {
      textToCheck = fs.readFileSync(target, 'utf8');
      isFile = true;
      console.log(`${COLOR.blue}📄 Memeriksa berkas:${COLOR.reset} ${target}`);
    } catch (e) {
      // Treat as plain text
    }
  }

  const result = checkEyd(textToCheck);

  if (result.valid) {
    console.log(`\n${COLOR.green}✨ Sempurna! Tidak ditemukan pelanggaran EYD V pada teks ini.${COLOR.reset}\n`);
    process.exit(0);
  }

  console.log(`\n${COLOR.yellow}${COLOR.bold}⚠️ Ditemukan ${result.errorCount} potensi ketidaksesuaian EYD V:${COLOR.reset}\n`);

  result.errors.forEach((err, idx) => {
    console.log(`${COLOR.bold}${idx + 1}. [${COLOR.red}${err.type}${COLOR.reset}${COLOR.bold}]${COLOR.reset} "${COLOR.red}${err.original}${COLOR.reset}" ➔ "${COLOR.green}${COLOR.bold}${err.suggestion}${COLOR.reset}"`);
    console.log(`   ${COLOR.dim}Kaidah :${COLOR.reset} ${err.rule}`);
    if (err.reference) {
      console.log(`   ${COLOR.dim}Rujukan:${COLOR.reset} https://ejaan.kemendikdasmen.go.id/${err.reference}`);
    }
    console.log('');
  });

  if (isFile) {
    const backupFile = target + '.bak';
    console.log(`${COLOR.dim}Untuk menerapkan perbaikan otomatis ke berkas, gunakan opsi penulisan ulang.${COLOR.reset}`);
  } else {
    console.log(`${COLOR.bold}${COLOR.cyan}Rekomendasi Teks Bersih:${COLOR.reset}`);
    console.log(`${COLOR.green}${result.correctedText}${COLOR.reset}\n`);
  }
}

// 2. Perintah SEARCH
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

    // Potongan isi
    const preview = r.content.split('\n').slice(0, 8).join('\n   ');
    console.log(`   ${preview}`);
    if (r.content.split('\n').length > 8) {
      console.log(`   ${COLOR.dim}... (baca selengkapnya via npx eyd-v rule ${r.id})${COLOR.reset}`);
    }
    console.log('\n------------------------------------------------------------\n');
  });
}

// 3. Perintah LIST
function handleList() {
  printBanner();
  const allRules = getAllRules();
  console.log(`${COLOR.bold}DAFTAR BAB & SUBBAB EYD EDISI KELIMA:${COLOR.reset}\n`);

  let currentCategory = '';
  allRules.forEach(doc => {
    if (doc.category !== currentCategory) {
      currentCategory = doc.category;
      console.log(`\n${COLOR.cyan}${COLOR.bold}📁 ${currentCategory.toUpperCase()}${COLOR.reset}`);
    }
    console.log(`   • ${COLOR.bold}${doc.title}${COLOR.reset} ${COLOR.dim}(${doc.rules.length} pasal)${COLOR.reset}`);
  });
  console.log(`\n${COLOR.dim}Gunakan 'npx eyd-v search <topik>' untuk mencari kaidah spesifik.${COLOR.reset}\n`);
}

// 4. Perintah RULE
function handleRule() {
  const id = args[1];
  if (!id) {
    console.error(`${COLOR.red}❌ Masukkan ID pasal.${COLOR.reset} Contoh: npx eyd-v rule "huruf-kapital#1"`);
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

// 5. Perintah INSTALL
function handleInstall() {
  printBanner();
  console.log(`${COLOR.bold}📦 Menginstal EYD V Agent Skill...${COLOR.reset}\n`);

  const rootPkgDir = path.resolve(__dirname, '..');
  const skillSource = path.join(rootPkgDir, 'SKILL.md');
  const cursorSource = path.join(rootPkgDir, 'templates/cursor/eyd-v.mdc');
  const claudeSource = path.join(rootPkgDir, 'templates/claude/CLAUDE.md');

  let installedCount = 0;

  const hasFlag = (flag) => args.includes(flag);
  const targetIndex = args.indexOf('--target');
  const customTarget = targetIndex !== -1 ? args[targetIndex + 1] : null;

  if (customTarget) {
    const dest = path.resolve(customTarget);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(skillSource, path.join(dest, 'SKILL.md'));
    console.log(`✅ [Custom Target] Skill terpasang di: ${path.join(dest, 'SKILL.md')}`);
    installedCount++;
    return;
  }

  const installAll = hasFlag('--all');
  const installAntigravity = hasFlag('--antigravity') || installAll;
  const installClaude = hasFlag('--claude') || installAll;
  const installCursor = hasFlag('--cursor') || installAll;

  // Default jika tanpa flag: pasang ke direktori saat ini & direktori user antigravity
  const isDefault = !hasFlag('--antigravity') && !hasFlag('--claude') && !hasFlag('--cursor') && !installAll;

  // 1. Google Antigravity
  if (installAntigravity || isDefault) {
    const homeDir = os.homedir();
    const antigravitySkillDir = path.join(homeDir, '.gemini/config/skills/eyd-v');
    try {
      fs.mkdirSync(antigravitySkillDir, { recursive: true });
      fs.copyFileSync(skillSource, path.join(antigravitySkillDir, 'SKILL.md'));
      console.log(`✅ [Google Antigravity] Terpasang di: ${path.join(antigravitySkillDir, 'SKILL.md')}`);
      installedCount++;
    } catch (e) {
      console.warn(`⚠️ Tidak dapat menulis ke direktori Antigravity: ${e.message}`);
    }
  }

  // 2. Cursor IDE
  if (installCursor || isDefault) {
    const cursorDir = path.resolve(process.cwd(), '.cursor/rules');
    try {
      fs.mkdirSync(cursorDir, { recursive: true });
      fs.copyFileSync(cursorSource, path.join(cursorDir, 'eyd-v.mdc'));
      console.log(`✅ [Cursor IDE] Rules terpasang di: ${path.join(cursorDir, 'eyd-v.mdc')}`);
      installedCount++;
    } catch (e) {
      console.warn(`⚠️ Gagal memasang Cursor rule: ${e.message}`);
    }
  }

  // 3. Claude Code
  if (installClaude || isDefault) {
    const claudeSkillDir = path.resolve(process.cwd(), '.claude/skills/eyd-v');
    try {
      fs.mkdirSync(claudeSkillDir, { recursive: true });
      fs.copyFileSync(skillSource, path.join(claudeSkillDir, 'SKILL.md'));
      console.log(`✅ [Claude Code] Skill terpasang di: ${path.join(claudeSkillDir, 'SKILL.md')}`);
      installedCount++;
    } catch (e) {
      console.warn(`⚠️ Gagal memasang Claude skill: ${e.message}`);
    }
  }

  console.log(`\n${COLOR.green}${COLOR.bold}🎉 Berhasil memasang ${installedCount} konfigurasi Agent Skill!${COLOR.reset}`);
  console.log(`${COLOR.dim}Agent Anda kini otomatis menerapkan pedoman EYD V Kemendikdasmen RI.${COLOR.reset}\n`);
}

// 6. Perintah INIT-HOOK (Git Pre-Commit)
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
git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(md|txt)$' | while read file; do
  if [ -f "$file" ]; then
    npx eyd-v check "$file" || exit 1
  fi
done
`;

  fs.writeFileSync(hookFile, hookScript, { mode: 0o755 });
  console.log(`${COLOR.green}✅ Pre-commit hook berhasil dipasang di: ${hookFile}${COLOR.reset}`);
  console.log(`Setiap commit berkas .md/.txt akan otomatis divalidasi dengan aturan EYD V.`);
}

// Route command
switch (command) {
  case 'check':
    handleCheck();
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
