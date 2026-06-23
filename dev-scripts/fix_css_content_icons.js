/**
 * fix_css_content_icons.js
 *
 * CSS `content:` properties cannot render HTML.
 * Any <i data-lucide="..."> or <i data-feather="..."> tag inside a content: '' string
 * is rendered as raw HTML text in the browser.
 *
 * This script replaces all such broken patterns with a proper CSS unicode character:
 *   chevron-right  →  '›'   (U+203A Single Right-Pointing Angle Quotation Mark)
 *   arrow-right    →  '→'   (U+2192)
 *   circle         →  '•'   (U+2022)
 *   check          →  '✓'   (U+2713)
 *   any other      →  '›'   (fallback)
 *
 * It also finds ::before / ::after rules that use an icon tag and rewrites
 * the entire declaration so the rule still works visually.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Map icon names to CSS unicode content values
const ICON_TO_CHAR = {
  'chevron-right':  '›',
  'chevron-left':   '‹',
  'chevron-down':   '⌄',
  'arrow-right':    '→',
  'arrow-left':     '←',
  'arrow-down':     '↓',
  'arrow-up':       '↑',
  'check':          '✓',
  'check-circle':   '✓',
  'circle':         '•',
  'dot':            '•',
  'star':           '★',
  'heart':          '♥',
  'plus':           '+',
  'minus':          '−',
  'x':              '×',
};

function iconToChar(iconName) {
  return ICON_TO_CHAR[iconName] || '›';
}

function fixFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // Pattern: content: '<i data-lucide="ICON_NAME" ...></i>';
  // or       content: "<i data-lucide="ICON_NAME" ...></i>";
  // The icon tag may have extra attributes like style="..."
  const pattern = /content:\s*(['"])<i\s+data-(?:lucide|feather)="([^"]+)"[^>]*>\s*<\/i>\1\s*;/g;

  html = html.replace(pattern, (match, quote, iconName) => {
    const char = iconToChar(iconName);
    return `content: '${char}';`;
  });

  // Also catch the reverse-quote case where the outer quote may differ
  // e.g.  content: "<i data-lucide='chevron-right'></i>";
  const pattern2 = /content:\s*(['"])<i\s+data-(?:lucide|feather)='([^']+)'[^>]*>\s*<\/i>\1\s*;/g;
  html = html.replace(pattern2, (match, quote, iconName) => {
    const char = iconToChar(iconName);
    return `content: '${char}';`;
  });

  // Catch any remaining escaped versions that may have survived (e.g. &lt;i data-lucide...&gt;)
  // These are in inline <style> blocks that got HTML-encoded
  html = html.replace(/content:\s*'&lt;i\s+data-lucide="([^"]+)"[^&]*&gt;&lt;\/i&gt;'\s*;/g, (match, iconName) => {
    const char = iconToChar(iconName);
    return `content: '${char}';`;
  });

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅ Fixed:', path.relative(ROOT, filePath));
  } else {
    console.log('⬜ No changes:', path.relative(ROOT, filePath));
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fixFile(full);
    }
  }
}

walk(ROOT);
console.log('\n🎉 CSS content icon fix complete.');
