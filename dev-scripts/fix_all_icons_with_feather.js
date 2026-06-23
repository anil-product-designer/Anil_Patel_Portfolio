// dev-scripts/fix_all_icons_with_feather.js
// This script scans all .html files in the project and replaces generic placeholder icons
// with context‑aware Lucide icons. If no suitable Lucide icon exists, it falls back to a Feather icon.
// It also injects the Feather CDN script into each page (once per file).

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// ---------- Keyword → Icon maps ----------
// Lucide icon map – primary choice
const LUCIDE_MAP = {
  wireframe: 'layout-template',
  layout: 'layout-template',
  component: 'box',
  system: 'box',
  rocket: 'rocket',
  user: 'user',
  designer: 'user',
  ai: 'bot',
  bot: 'bot',
  coding: 'code',
  document: 'file-text',
  file: 'file-text',
  pricing: 'dollar-sign',
  cost: 'dollar-sign',
  audit: 'clock',
  history: 'clock',
  trust: 'shield',
  safety: 'shield',
  next: 'arrow-right',
  progress: 'arrow-right',
  error: 'alert-circle',
  fail: 'alert-circle',
  panic: 'alert-circle',
  settings: 'settings',
  config: 'settings',
  dashboard: 'layout-dashboard',
  analytics: 'bar-chart'
};

// Feather fallback map – used when no Lucide match exists
const FEATHER_MAP = {
  pricing: 'dollar-sign',
  cost: 'dollar-sign',
  audit: 'clock',
  history: 'clock',
  trust: 'shield',
  safety: 'shield',
  next: 'arrow-right',
  progress: 'arrow-right',
  error: 'alert-circle',
  fail: 'alert-circle',
  panic: 'alert-circle'
};

/**
 * Determine the best icon for a given text snippet.
 * Returns { library: 'lucide'|'feather', icon: string } | null
 */
function findIcon(snippet) {
  const lowered = snippet.toLowerCase();
  for (const [kw, icon] of Object.entries(LUCIDE_MAP)) {
    if (lowered.includes(kw)) return { library: 'lucide', icon };
  }
  for (const [kw, icon] of Object.entries(FEATHER_MAP)) {
    if (lowered.includes(kw)) return { library: 'feather', icon };
  }
  return null;
}

/**
 * Ensure the Feather CDN script is present before </head>.
 */
function ensureFeatherScript(html) {
  if (html.includes('feather-icons')) return html; // already added
  const featherTag = `\n    <script src="https://unpkg.com/feather-icons"></script>\n    <script>feather.replace();</script>\n`;
  return html.replace(/<\/head>/i, featherTag + '</head>');
}

/**
 * Replace placeholders inside a single HTML file.
 */
function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1️⃣ Add Feather CDN if needed
  content = ensureFeatherScript(content);

  // 2️⃣ Clean up stray Unicode replacement characters
  content = content.replace(/\uFFFD/g, '');

  // 3️⃣ Replace generic placeholders "[?]" and empty help-circle icons
  const genericRegex = /\[\?\]|<i\s+data-lucide="help-circle"\s*>\s*<\/i>/g;
  content = content.replace(genericRegex, (match, offset) => {
    // Grab surrounding text for context (30 chars before/after)
    const start = Math.max(0, offset - 30);
    const end = Math.min(content.length, offset + 30);
    const context = content.slice(start, end);
    const result = findIcon(context);
    
    if (!result) return '';
    const { library, icon } = result;
    return library === 'lucide'
      ? `<i data-lucide="${icon}"></i>`
      : `<i data-feather="${icon}"></i>`;
  });

  // 4️⃣ Also replace any remaining help-circle icons that sit inside sentences
  const remainingHelp = /<i\s+data-lucide="help-circle"\s*>\s*<\/i>/g;
  content = content.replace(remainingHelp, (match, offset) => {
    const start = Math.max(0, offset - 30);
    const end = Math.min(content.length, offset + 30);
    const context = content.slice(start, end);
    const result = findIcon(context);
    
    if (!result) return '';
    const { library, icon } = result;
    return library === 'lucide'
      ? `<i data-lucide="${icon}"></i>`
      : `<i data-feather="${icon}"></i>`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Updated', filePath);
  }
}

/**
 * Recursively walk the directory tree and process .html files.
 */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.antigravityignore'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      replaceInFile(full);
    }
  }
}

walk(projectRoot);

// ---------- REPORT ----------
const reportPath = path.join(projectRoot, 'dev-scripts', 'icon-replacement-report.md');
let report = '# Icon Replacement Report\n\nAll HTML files have been processed. The following files now contain context‑aware icons:\n\n';
function collectHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', '.antigravityignore'].includes(e.name)) continue;
      files.push(...collectHtmlFiles(f));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      files.push(f);
    }
  }
  return files;
}
const htmlFiles = collectHtmlFiles(projectRoot);
for (const f of htmlFiles) {
  const rel = path.relative(projectRoot, f);
  report += `- [${rel}](file://${f})\n`;
}
fs.writeFileSync(reportPath, report, 'utf8');
console.log('✅ Icon replacement complete. Report written to', reportPath);
