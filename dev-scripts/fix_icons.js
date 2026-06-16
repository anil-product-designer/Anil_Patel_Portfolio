const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

const edgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

let totalUpdated = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let updated = false;

    const newSun = `<span class="sun-icon">${sunSvg}</span>`;
    const newMoon = `<span class="moon-icon">${moonSvg}</span>`;
    const newEdge = `<div class="edge-icon">${edgeSvg}</div>`;

    if (/<span class="sun-icon">[\s\S]*?<\/span>/.test(content)) {
        content = content.replace(/<span class="sun-icon">[\s\S]*?<\/span>/g, newSun);
        updated = true;
    }

    if (/<span class="moon-icon">[\s\S]*?<\/span>/.test(content)) {
        content = content.replace(/<span class="moon-icon">[\s\S]*?<\/span>/g, newMoon);
        updated = true;
    }

    if (/<div class="edge-icon">[\s\S]*?<\/div>/.test(content)) {
        content = content.replace(/<div class="edge-icon">[\s\S]*?<\/div>/g, newEdge);
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
        console.log(`Updated icons in ${file}`);
        totalUpdated++;
    }
});

console.log(`\nFinished processing! Updated icons in ${totalUpdated} HTML files.`);
