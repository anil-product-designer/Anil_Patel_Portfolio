const fs = require('fs');
const file = 'c:/Users/Anil/OneDrive/Desktop/My Portfolio/Zenisth_DS.html';
let content = fs.readFileSync(file, 'utf8');

// Replace specific ranges
content = content.replace(/Week 02\uFFFD03/g, 'Week 02-03');
content = content.replace(/Month 01\uFFFD02/g, 'Month 01-02');
content = content.replace(/Month 02\uFFFD03/g, 'Month 02-03');
content = content.replace(/Month 03\uFFFD06/g, 'Month 03-06');
content = content.replace(/\uFFFD Founding Designer/g, '— Founding Designer');
content = content.replace(/Chapter 05 \uFFFD The Twist/g, 'Chapter 05 — The Twist');
// Replace all remaining with middot
content = content.replace(/\uFFFD/g, '·');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed \\uFFFD symbols.');
