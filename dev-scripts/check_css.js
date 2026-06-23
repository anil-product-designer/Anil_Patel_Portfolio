const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f.endsWith('.css'));
const matches = new Set();
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const m = txt.match(/content:\s*['"]<i data-lucide=[^>]+>.*?['"]/g);
  if (m) m.forEach(x => matches.add(x));
}
console.log(Array.from(matches));
