/**
 * ICON AUDIT — READ-ONLY VERIFICATION (v2)
 * Checks for actual problems only:
 *  1. back-btn elements missing any icon (lucide OR svg)
 *  2. Known icon-wrapper divs (ai-pipe-icon only — NOT tool-dot/scope-dot, those are CSS dots)
 *  3. Any remaining help-circle generic icons
 *  4. Any <i data-lucide> tags mid-sentence (text on both sides)
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Only these wrappers are EXPECTED to contain icons (not CSS-only dots)
const ICON_WRAPPER_CLASSES = ['ai-pipe-icon'];

let totalIssues = 0;

function auditFile(filePath) {
  const html  = fs.readFileSync(filePath, 'utf8');
  const rel   = path.relative(ROOT, filePath);
  const lines = html.split('\n');
  const issues = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const isCSS   = /\.back-btn\s*\{/.test(line) || /\.back-btn:hover/.test(line);

    // 1. Back button missing any icon (lucide OR svg)
    if (!isCSS && /class="back-btn"/.test(line)) {
      const hasIcon = /<i\s+data-(?:lucide|feather)/.test(line) || /<svg/.test(line);
      if (!hasIcon) {
        issues.push(`  L${lineNum}: back-btn missing icon → "${line.trim().slice(0, 80)}"`);
      }
    }

    // 2. Empty ai-pipe-icon wrappers (single-line form only)
    for (const cls of ICON_WRAPPER_CLASSES) {
      if (line.includes(`class="${cls}"`)) {
        // Check same line and next line for an icon
        const nextLine = lines[idx + 1] || '';
        const hasIcon  = /<i\s+data-(?:lucide|feather)/.test(line)
                      || /<svg/.test(line)
                      || /<i\s+data-(?:lucide|feather)/.test(nextLine);
        if (!hasIcon) {
          issues.push(`  L${lineNum}: empty .${cls} wrapper → "${line.trim().slice(0, 80)}"`);
        }
      }
    }

    // 3. Generic help-circle placeholders
    if (/data-lucide="help-circle"/.test(line)) {
      issues.push(`  L${lineNum}: generic help-circle icon → "${line.trim().slice(0, 80)}"`);
    }

    // 4. Mid-sentence icons (text immediately before AND after on same line, not in a link)
    const midSentenceRe = /\w+\s*<i\s+data-lucide="[^"]+"><\/i>\s*\w+/;
    if (midSentenceRe.test(line) && !/<a[\s>]/.test(line)) {
      issues.push(`  L${lineNum}: mid-sentence icon → "${line.trim().slice(0, 100)}"`);
    }
  });

  if (issues.length > 0) {
    console.log(`\n⚠️  ${rel} (${issues.length} issue${issues.length > 1 ? 's' : ''})`);
    issues.forEach(i => console.log(i));
    totalIssues += issues.length;
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      auditFile(full);
    }
  }
}

walk(ROOT);

if (totalIssues === 0) {
  console.log('\n✅ All files clean — no icon issues found.');
} else {
  console.log(`\n\n❌ Total issues found: ${totalIssues}`);
}
