const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
fs.copyFileSync(path.join(rootDir, 'SKILL.md'), path.join(tempDir, 'SKILL.md'));
fs.copyFileSync(path.join(rootDir, 'README.md'), path.join(tempDir, 'README.md'));

// Buat metadata skill
const manifest = {
  name: "eyd-v",
  version: "5.1.1",
  description: "Pedoman resmi EYD Edisi Kelima Kemendikdasmen RI & Panduan Penulisan Alami Bebas AI Slop",
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
  execSync(`cd "${tempDir}" && zip -r "${outputSkillFile}" .`, { stdio: 'ignore' });
  console.log('✅ Claude skill package created:', outputSkillFile);
} catch (e) {
  console.error('⚠️ Gagal membuat zip archive:', e.message);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
