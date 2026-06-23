const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');

function traverseAndReplace(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name)) continue;
      traverseAndReplace(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to replace the whole <button class="theme-toggle" ...> ... </button> block
      // The block spans multiple lines. We can use a regex.
      const themeBtnRegex = /<button class="theme-toggle"[^>]*>[\s\S]*?<\/button>/g;
      
      const newBtn = `<a href="https://wa.me/918160333948" target="_blank" rel="noopener noreferrer" class="hire-me-pill">Hire Me</a>`;
      
      if (themeBtnRegex.test(content)) {
        content = content.replace(themeBtnRegex, newBtn);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${entry.name}`);
      }
    }
  }
}

traverseAndReplace(dir);
console.log('Done replacing theme toggle with hire me button.');
