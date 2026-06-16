const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add loading="lazy" to <img> if not present
  content = content.replace(/<img([^>]*)>/gi, (match, p1) => {
    if (!p1.includes('loading=')) {
      changed = true;
      return `<img${p1} loading="lazy">`;
    }
    return match;
  });

  // Add loading="lazy" to <iframe> if not present
  content = content.replace(/<iframe([^>]*)>/gi, (match, p1) => {
    if (!p1.includes('loading=')) {
      changed = true;
      return `<iframe${p1} loading="lazy">`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file} with lazy loading.`);
  }
});
