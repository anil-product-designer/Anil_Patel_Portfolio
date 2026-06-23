const fs = require('fs');
const files = [
  'rumble-rewards-case-study.html',
  'transify-case-study.html',
  'Zenisth_DS.html',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;

  const SEP = '<span class="sep" aria-hidden="true">·</span>';

  // Fix number ranges broken by separator: 5·8 → 5–8
  c = c.replace(/(\d)<span class="sep" aria-hidden="true">·<\/span>(\d)/g, '$1\u20138');

  // Fix contractions: don·t → don't, what·s → what's
  c = c.replace(/([a-z])<span class="sep" aria-hidden="true">·<\/span>([a-z])/g, "$1'$2");

  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed: ' + f);
  }
}
console.log('Done.');
