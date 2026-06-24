const fs = require('fs');
const path = require('path');

const files = [
  'idp-case-study.html',
  'rumble-rewards-case-study.html',
  'transify-case-study.html',
  'Zenisth_DS.html',
  'trailtribe-case-study.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../', file); // Fixed path
  if (!fs.existsSync(filePath)) {
    console.log("File not found: " + filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix flow-arrow and benefit-arrow
  content = content.replace(/<span class="([^"]*arrow[^"]*)">\s*\?\s*<\/span>/g, (match, cls) => {
    changed = true;
    return `<span class="${cls}"><i data-lucide="arrow-right" style="width: 1em; height: 1em;"></i></span>`;
  });
  
  content = content.replace(/<div class="([^"]*arrow[^"]*)">\s*\?\s*<\/div>/g, (match, cls) => {
    changed = true;
    return `<div class="${cls}"><i data-lucide="arrow-right" style="width: 1em; height: 1em;"></i></div>`;
  });

  // Fix metric-num
  content = content.replace(/<div class="metric-num">\s*\?\s*<\/div>/g, () => {
    changed = true;
    return `<div class="metric-num"><i data-lucide="check-circle" style="width: 1em; height: 1em;"></i></div>`;
  });

  // Fix span style="font-size:12px..."
  content = content.replace(/<span([^>]*)>\s*\?\s*<\/span>/g, (match, attrs) => {
    changed = true;
    return `<span${attrs}><i data-lucide="check" style="width: 1em; height: 1em;"></i></span>`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ? icons in ${file}`);
  }
});
