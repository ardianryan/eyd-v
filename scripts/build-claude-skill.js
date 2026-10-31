const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const tempDir = path.join(distDir, 'temp-skill');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Salin SKILL.md dan dokumentasi penting
require('../src/skill-bundle').copySkillBundle(tempDir);

// Buat metadata skill
const pkg = require(path.join(rootDir, 'package.json'));
const manifest = {
  name: "eyd-v",
  version: pkg.version,
  description: pkg.description || "Pedoman resmi EYD Edisi Kelima Kemendikdasmen RI & Panduan Penulisan Alami Bebas AI Slop",
  author: "Ardian Ryan",
  entrypoint: "SKILL.md"
};
fs.writeFileSync(path.join(tempDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

// Kompresi ke eyd-v.skill (zip archive)
const outputSkillFile = path.join(distDir, 'eyd-v.skill');
if (fs.existsSync(outputSkillFile)) {
  fs.unlinkSync(outputSkillFile);
}

try {
  execFileSync('zip', ['-r', outputSkillFile, '.'], { cwd: tempDir, stdio: 'ignore' });
  console.log('✅ Claude skill package created:', outputSkillFile);
} catch (e) {
  console.error('⚠️ Gagal membuat zip archive:', e.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
