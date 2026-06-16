const fs = require('fs');
const path = require('path');

const lucideHead = '<script src="https://unpkg.com/lucide@latest"></script>';
const lucideBody = '<script>lucide.createIcons();</script>';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('.', filePath => {
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dev-scripts')) return;
  if (!filePath.endsWith('.html')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (!content.includes('unpkg.com/lucide')) {
    content = content.replace('</head>', `  ${lucideHead}\n</head>`);
    changed = true;
  }

  if (!content.includes('lucide.createIcons')) {
    content = content.replace('</body>', `  ${lucideBody}\n</body>`);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Added Lucide to ${filePath}`);
  }
});
