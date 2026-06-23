const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let totalFixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;

  // Replace ANY css content: property that contains raw <svg markup with a safe arrow symbol
  // Pattern: content: '...svg...' inside a style block
  content = content.replace(/content:\s*'<svg[\s\S]*?'(?=\s*;)/g, "content: '\u2192'");

  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    const count = (before.match(/content:\s*'<svg/g) || []).length;
    console.log(`Fixed ${count} SVG-in-content instances in ${file}`);
    totalFixed += count;
  }
});

console.log(`\nDone. Fixed ${totalFixed} total SVG-in-CSS-content instances.`);
