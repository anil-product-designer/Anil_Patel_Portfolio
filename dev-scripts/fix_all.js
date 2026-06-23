const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Get all HTML files dynamically
const htmlFiles = fs.readdirSync(ROOT).filter(file => file.endsWith('.html'));
let totalFixes = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // FIX 1: Meaningless "layers" icon separator
    content = content.replace(
        /B2B SaaS\s*<i data-lucide="layers"><\/i>\s*AI-powered/g,
        'B2B SaaS <span class="sep" aria-hidden="true">·</span> AI-powered'
    );

    // FIX 2: Broken inline lucide icons in text
    content = content.replace(
        /what next\?\s*<i data-lucide="alert-circle"><\/i>\s*<i data-lucide="arrow-right"><\/i>/g,
        '"what next?"'
    );

    // FIX 3: Replace broken ? with proper arrows/unicode
    content = content.replace(/class="back-btn">[\?\uFFFD]\s*Back/g, 'class="back-btn">← Back');
    content = content.replace(/View Case Study\s*(?:&nbsp;)?\s*[\?\uFFFD]/g, 'View Case Study →');
    content = content.replace(/[\?\uFFFD]\s*View Case Study/g, '← View Case Study');
    content = content.replace(/View All Projects\s*[\?\uFFFD]/g, 'View All Projects →');
    content = content.replace(/>[\?\uFFFD]\s*Return to Work/g, '>← Return to Work');
    content = content.replace(/Next Project\s*[\?\uFFFD]/g, 'Next Project →');
    
    // Status Tags
    content = content.replace(/scope-tag-ship(?:"[^>]*>|>)\s*[\?\uFFFD]\s*Shipped/g, 'scope-tag-ship">✓ Shipped');
    content = content.replace(/scope-block-title"[^>]*>[\?\uFFFD]\s*Shipped/g, 'scope-block-title" style="color:var(--accent-green);">✓ Shipped');
    
    content = content.replace(/scope-tag-cut(?:"[^>]*>|>)\s*[\?\uFFFD]\s*Cut/g, 'scope-tag-cut">✕ Cut');
    content = content.replace(/scope-block-title"[^>]*>[\?\uFFFD]\s*Cut/g, 'scope-block-title" style="color:var(--accent-red);">✕ Cut');
    
    content = content.replace(/scope-tag-later(?:"[^>]*>|>)\s*[\?\uFFFD]\s*Postponed/g, 'scope-tag-later">◷ Postponed');
    content = content.replace(/scope-block-title"[^>]*>[\?\uFFFD]\s*Planned/g, 'scope-block-title" style="color:var(--accent-amber);margin-top:40px;">◷ Planned');

    content = content.replace(/>[\?\uFFFD]\s*The Defining Moment/g, '>◆ The Defining Moment');

    // Portfolio link with ?
    content = content.replace(/>[\?\uFFFD]\s*Portfolio/g, '>← Portfolio');
    content = content.replace(/>[\?\uFFFD]\s*System Overview/g, '>◆ System Overview');
    content = content.replace(/>[\?\uFFFD]\s*Component Library/g, '>◆ Component Library');

    // Calendar blocks with ?
    // "Week 02<i data-lucide="calendar"></i>03" -> "Week 02 · 03"
    content = content.replace(/Week 02\s*<i data-lucide="calendar"><\/i>\s*03/g, 'Week 02 · 03');
    content = content.replace(/Month 01\s*<i data-lucide="calendar"><\/i>\s*02/g, 'Month 01 · 02');
    content = content.replace(/Month 02\s*<i data-lucide="calendar"><\/i>\s*03/g, 'Month 02 · 03');
    content = content.replace(/Month 03\s*<i data-lucide="calendar"><\/i>\s*06/g, 'Month 03 · 06');

    // "in ? predictable out"
    content = content.replace(/in\s*[\?\uFFFD]\s*predictable out/g, 'in → predictable out');

    // Workflow arrows
    content = content.replace(/Upload\s*[\?\uFFFD]\s*(?:click translate|Select Tag)/g, match => match.replace(/[\?\uFFFD]/g, '→'));
    content = content.replace(/Select Tag\s*[\?\uFFFD]\s*Translate/g, 'Select Tag → Translate');
    content = content.replace(/Translate\s*[\?\uFFFD]\s*$/gm, 'Translate →');
    content = content.replace(/message\s*[\?\uFFFD]\s*Features\s*[\?\uFFFD]\s*Trust\s*[\?\uFFFD]\s*Value\s*[\?\uFFFD]\s*Social proof/g, 'message → Features → Trust → Value → Social proof');
    content = content.replace(/Value\s*[\?\uFFFD]\s*Simplification\s*[\?\uFFFD]\s*Rewards\s*[\?\uFFFD]\s*Flexibility\s*[\?\uFFFD]\s*Habit building\s*[\?\uFFFD]\s*Perks\s*[\?\uFFFD]\s*Security\s*[\?\uFFFD]/g, 'Value → Simplification → Rewards → Flexibility → Habit building → Perks → Security →');
    content = content.replace(/mockups\s*[\?\uFFFD]\s*Concept visuals\s*[\?\uFFFD]\s*Reward visuals/g, 'mockups → Concept visuals → Reward visuals');
    content = content.replace(/this\?\s*[\?\uFFFD]\s*Why care\?\s*[\?\uFFFD]\s*Is it safe\?\s*[\?\uFFFD]\s*What do I gain\?/g, 'this? → Why care? → Is it safe? → What do I gain?');
    
    // Tool stack
    content = content.replace(/>[\?\uFFFD]\s*Design\s*<span class="sep"/g, '>🔧 Design <span class="sep"');
    content = content.replace(/Crafted with\s*[\?\uFFFD]\s*/g, 'Crafted with ❤️ ');

    // CSS `content: '?'` -> `content: '↓'`
    content = content.replace(/(\.scroll-hint::after\s*\{\s*content:\s*)'[\?\uFFFD]'/g, "$1'↓'");
    content = content.replace(/(content:\s*)'[\?\uFFFD]'/g, "$1'→'");

    // CSS raw SVGs
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="12" y1="5" x2="12" y2="19"[^>]*><\/line><polyline points="19 12 12 19 5 12"[^>]*><\/polyline><\/svg>['"]/g, "content: '↓'");
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="5" y1="12" x2="19" y2="12"[^>]*><\/line><polyline points="12 5 19 12 12 19"[^>]*><\/polyline><\/svg>['"]/g, "content: '→'");
    content = content.replace(/content:\s*['"]<svg[^>]*><line x1="19" y1="12" x2="5" y2="12"[^>]*><\/line><polyline points="12 19 5 12 12 5"[^>]*><\/polyline><\/svg>['"]/g, "content: '←'");
    content = content.replace(/content:\s*['"]\s*<svg[^]*?<\/svg>\s*['"]/g, "content: '→'");

    // Contact button
    content = content.replace(/Send now\s*<span>[\?\uFFFD]<\/span>/g, 'Send now <span>→</span>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed ${file}`);
        totalFixes++;
    }
});

console.log(`\nFixed ${totalFixes} files total.`);
