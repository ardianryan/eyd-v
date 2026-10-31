const fs = require('fs');
const path = require('path');

function copySkillBundle(destination) {
  const root = path.resolve(__dirname, '..');
  const destPath = path.resolve(destination);
  for (const directory of ['skills', 'docs', 'data']) {
    const source = path.join(root, directory);
    if (destPath === source || destPath.startsWith(source + path.sep)) throw new Error('Tujuan instalasi tidak boleh berada di dalam direktori sumber paket.');
  }
  fs.mkdirSync(destination, { recursive: true });
  for (const filename of ['SKILL.md', 'README.md', 'CHANGELOG.md']) {
    fs.copyFileSync(path.join(root, filename), path.join(destination, filename));
  }
  for (const directory of ['skills', 'docs']) {
    fs.cpSync(path.join(root, directory), path.join(destination, directory), { recursive: true });
  }
  for (const filename of ['glosarium-istilah-teknologi.json', 'glosarium-istilah-hukum-finansial.json']) {
    const dest = path.join(destination, 'data', filename);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, 'data', filename), dest);
  }
}

module.exports = { copySkillBundle };
