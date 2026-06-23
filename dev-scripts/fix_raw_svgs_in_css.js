const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlFiles = [
    'transify-case-study.html',
    'idp-case-study.html',
    'rumble-rewards-case-study.html',
    'trailtribe-case-study.html',
    'Zenisth_DS.html',
    'project.html',
    'my-tool-stack.html',
    'index.html',
    'about.html',
    'contact.html',
];

htmlFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // FIX: Any CSS content: '<svg ... >' should be replaced.
    // SVG tags as raw text inside CSS content property will just print the code.
    
    // We will find all `content: '<svg...>'` patterns in the CSS.
    // Because CSS content shouldn't have raw HTML, we replace it with a unicode arrow based on the shape.

    // 1. Down arrow svgs (often used for scroll hints)
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="12" y1="5" x2="12" y2="19"[^>]*><\/line><polyline points="19 12 12 19 5 12"[^>]*><\/polyline><\/svg>['"]/g, "content: '↓'");
    
    // 2. Right arrow svgs
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="5" y1="12" x2="19" y2="12"[^>]*><\/line><polyline points="12 5 19 12 12 19"[^>]*><\/polyline><\/svg>['"]/g, "content: '→'");

    // 3. Left arrow svgs
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="19" y1="12" x2="5" y2="12"[^>]*><\/line><polyline points="12 19 5 12 12 5"[^>]*><\/polyline><\/svg>['"]/g, "content: '←'");

    // 4. Any remaining raw SVGs inside CSS content properties are broken, let's just clear them or use a generic dot/arrow.
    // We match `content: '<svg ... </svg>'` globally.
    content = content.replace(/content:\s*['"]\s*<svg[^]*?<\/svg>\s*['"]/g, "content: '→'");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed raw CSS SVGs in ${file}`);
    }
});
