const fs = require('fs');

let content = fs.readFileSync('design-system-doc.html', 'utf8');

// The replacement character is \uFFFD

// Replace \uFFFD with mdash when it's surrounded by spaces
content = content.replace(/ \uFFFD /g, ' &mdash; ');

// Replace \uFFFD with ndash when it's between numbers (e.g. 10\uFFFD12px, 0.15\uFFFD0.25em)
content = content.replace(/(\d)\uFFFD(\d)/g, '$1&ndash;$2');

// Fix specific CSS content rules that got corrupted to '?'
content = content.replace(/\.demo-impact-item::before\s*\{\s*content:\s*'\?';/g, ".demo-impact-item::before {\n      content: '\\2192';");
content = content.replace(/\.demo-principle::before\s*\{\s*content:\s*'\?';/g, ".demo-principle::before {\n      content: '\\2022';");

// Global fallback for any remaining \uFFFD characters
content = content.replace(/\uFFFD/g, '&mdash;');

fs.writeFileSync('design-system-doc.html', content);
console.log('Fixed corrupted characters in design-system-doc.html');
