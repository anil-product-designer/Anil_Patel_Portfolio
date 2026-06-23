const fs = require('fs');
const path = require('path');

function replacePlaceholders(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules, .git, dev-scripts, and any hidden folders
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name) || entry.name.startsWith('.')) continue;
      replacePlaceholders(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Replace placeholder [?] and the Unicode replacement character �
      content = content.replace(/\[\?\]/g, '<i data-lucide="help-circle"></i>');
      content = content.replace(/�/g, '<i data-lucide="help-circle"></i>');
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

const projectRoot = path.resolve(__dirname, '..'); // assume dev-scripts is inside project root
replacePlaceholders(projectRoot);
console.log('All placeholder icons have been replaced with help-circle.');
