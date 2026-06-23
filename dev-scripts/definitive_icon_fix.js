/**
 * DEFINITIVE Icon & Broken Unicode Cleanup Script
 * Fixes ALL icon issues across ALL pages permanently.
 * 
 * Issues found:
 * 1. Lucide <i data-lucide="layers"> used as separator between "B2B SaaS" and "AI-powered..." (meaningless)
 * 2. Lucide alert-circle and arrow-right icons inline in text content (looks broken)
 * 3. Broken unicode ? characters where arrows (→, ←) should be
 * 4. Broken unicode ? where emojis should be (✅, ❌, ⏳, 🔧, 💡, etc.)
 */

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

let totalFixes = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠ Skipping ${file} (not found)`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let fixes = 0;

    // ═══════════════════════════════════════════
    // FIX 1: Remove the meaningless "layers" icon used as separator in nav/footer
    // "B2B SaaS <i data-lucide="layers"></i> AI-powered translation Tool"
    // Replace with a proper dot separator
    // ═══════════════════════════════════════════
    content = content.replace(
        /B2B SaaS\s*<i data-lucide="layers"><\/i>\s*AI-powered/g,
        'B2B SaaS <span class="sep" aria-hidden="true">·</span> AI-powered'
    );

    // ═══════════════════════════════════════════
    // FIX 2: Remove broken inline lucide icons in text content
    // "what next?<i data-lucide="alert-circle"></i><i data-lucide="arrow-right"></i>"
    // ═══════════════════════════════════════════
    content = content.replace(
        /what next\?\s*<i data-lucide="alert-circle"><\/i>\s*<i data-lucide="arrow-right"><\/i>/g,
        '"what next?"'
    );

    // ═══════════════════════════════════════════
    // FIX 3: Replace broken ? with proper arrows → in text content
    // But NOT in CSS content properties, URLs, or actual question marks in sentences
    // ═══════════════════════════════════════════
    
    // "? Back" → "← Back"
    content = content.replace(
        /class="back-btn">[\?\uFFFD]\s*Back/g,
        'class="back-btn">← Back'
    );

    // "View Case Study &nbsp; ?" at end → "View Case Study →"
    content = content.replace(
        /View Case Study\s*(?:&nbsp;)?\s*[\?\uFFFD]/g,
        'View Case Study →'
    );

    // "? View Case Study" at start → "← View Case Study"
    content = content.replace(
        /[\?\uFFFD]\s*View Case Study/g,
        '← View Case Study'
    );

    // "View All Projects ?" → "View All Projects →"
    content = content.replace(
        /View All Projects\s*[\?\uFFFD]/g,
        'View All Projects →'
    );

    // "? Return to Work" → "← Return to Work"
    content = content.replace(
        />[\?\uFFFD]\s*Return to Work/g,
        '>← Return to Work'
    );

    // "Next Project ?" → "Next Project →"
    content = content.replace(
        /Next Project\s*[\?\uFFFD]/g,
        'Next Project →'
    );

    // "? Shipped in V1" → "✓ Shipped in V1"
    content = content.replace(
        /scope-tag-ship">[\?\uFFFD]\s*Shipped/g,
        'scope-tag-ship">✓ Shipped'
    );

    // "? Cut for V1" → "✕ Cut for V1"
    content = content.replace(
        /scope-tag-cut">[\?\uFFFD]\s*Cut/g,
        'scope-tag-cut">✕ Cut'
    );

    // "? Postponed to V2" → "◷ Postponed to V2"
    content = content.replace(
        /scope-tag-later"[^>]*>[\?\uFFFD]\s*Postponed/g,
        'scope-tag-later">◷ Postponed'
    );

    // "? The Defining Moment" → "⟐ The Defining Moment"
    content = content.replace(
        />[\?\uFFFD]\s*The Defining Moment/g,
        '>◆ The Defining Moment'
    );

    // Process flow arrows in text: "Upload ? Select Tag ? Translate ? Download"
    // These are describing workflows and should use →
    content = content.replace(
        /Upload\s*[\?\uFFFD]\s*(?:click translate|Select Tag)/g,
        match => match.replace(/[\?\uFFFD]/g, '→')
    );
    content = content.replace(
        /Select Tag\s*[\?\uFFFD]\s*Translate/g,
        'Select Tag → Translate'
    );
    content = content.replace(
        /Translate\s*[\?\uFFFD]\s*$/gm,
        'Translate →'
    );

    // Fix workflow arrows in content text (Rumble Rewards)
    // "Emotional message ? Features ? Trust ? Value ? Social proof"
    content = content.replace(
        /message\s*[\?\uFFFD]\s*Features\s*[\?\uFFFD]\s*Trust\s*[\?\uFFFD]\s*Value\s*[\?\uFFFD]\s*Social proof/g,
        'message → Features → Trust → Value → Social proof'
    );
    content = content.replace(
        /Value\s*[\?\uFFFD]\s*Simplification\s*[\?\uFFFD]\s*Rewards\s*[\?\uFFFD]\s*Flexibility\s*[\?\uFFFD]\s*Habit building\s*[\?\uFFFD]\s*Perks\s*[\?\uFFFD]\s*Security\s*[\?\uFFFD]/g,
        'Value → Simplification → Rewards → Flexibility → Habit building → Perks → Security →'
    );
    content = content.replace(
        /mockups\s*[\?\uFFFD]\s*Concept visuals\s*[\?\uFFFD]\s*Reward visuals/g,
        'mockups → Concept visuals → Reward visuals'
    );
    content = content.replace(
        /this\?\s*[\?\uFFFD]\s*Why care\?\s*[\?\uFFFD]\s*Is it safe\?\s*[\?\uFFFD]\s*What do I gain\?/g,
        'this? → Why care? → Is it safe? → What do I gain?'
    );

    // Fix "? Design · Build · Ship · Repeat" in tool stack
    content = content.replace(
        />[\?\uFFFD]\s*Design\s*<span class="sep"/g,
        '>🔧 Design <span class="sep"'
    );

    // Fix "Crafted with ? " in tool stack footer marquee
    content = content.replace(
        /Crafted with\s*[\?\uFFFD]\s*/g,
        'Crafted with ❤️ '
    );

    // Fix CSS content: '?' → proper unicode arrows
    // Only in CSS style blocks with content property
    content = content.replace(
        /(\.scroll-hint::after\s*\{\s*content:\s*)'[\?\uFFFD]'/g,
        "$1'↓'"
    );

    // Fix the ? in "Upload ? click translate ? download"
    content = content.replace(
        /upload\s*[\?\uFFFD]\s*click translate\s*[\?\uFFFD]\s*download/gi,
        'upload → click translate → download'
    );

    // Fix "Send now <span>?</span>" button → proper arrow
    content = content.replace(
        /Send now\s*<span>[\?\uFFFD]<\/span>/g,
        'Send now <span>→</span>'
    );

    // Count fixes
    if (content !== original) {
        const diff = original.length - content.length;
        // Count the actual replacements by comparing
        let count = 0;
        for (let i = 0; i < Math.min(original.length, content.length); i++) {
            if (original[i] !== content[i]) count++;
        }
        fixes = Math.max(1, Math.floor(count / 5)); // rough estimate
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${file} — fixed`);
    } else {
        console.log(`  ${file} — no issues found`);
    }
    totalFixes += fixes;
});

console.log(`\n═══════════════════════════════════════`);
console.log(`Done. Processed ${htmlFiles.length} files.`);
console.log(`═══════════════════════════════════════`);
