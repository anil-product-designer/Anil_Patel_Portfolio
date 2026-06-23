const fs   = require('fs');
const path = require('path');
const dir  = 'c:/Users/Anil/OneDrive/Desktop/Trial Anti/New Try';
const skip = new Set(['Zenisth_DS.html']);
const oldFonts = ['Bricolage Grotesque', 'Fraunces', 'Syne'];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !skip.has(f));
let found = false;

files.forEach(f => {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  // Remove documentation/code display blocks to avoid false positives
  const stripped = html
    .replace(/<code[^>]*>[\s\S]*?<\/code>/gi, '')
    .replace(/class="ib-url"[^<]*<\/span>/gi, '');

  const lines = stripped.split('\n');
  oldFonts.forEach(font => {
    lines.forEach((line, i) => {
      if (line.includes(font)) {
        console.log(`${f}:${i+1}:  ${line.trim().slice(0, 100)}`);
        found = true;
      }
    });
  });
});

if (!found) {
  console.log('✅ All clean — no old display fonts remaining in active CSS.');
}
