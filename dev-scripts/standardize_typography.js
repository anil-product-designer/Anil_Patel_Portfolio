/**
 * TYPOGRAPHY STANDARDIZATION
 *
 * Target (all files EXCEPT Zenisth_DS.html):
 *   Headings / display / hero / labels  →  Inter (Google Fonts)
 *   Body / prose / UI text              →  Stage Grotesk (local, already in /fonts/)
 *   Code / mono labels                  →  DM Mono (kept)
 *
 * Steps per file:
 *  1. Replace the Google Fonts <link> with one that loads Inter + DM Mono only
 *  2. Inject @font-face for Stage Grotesk from the /fonts/ folder (if not already present)
 *  3. In CSS:
 *     - Replace 'Bricolage Grotesque', 'Fraunces', 'Syne', 'Nunito' font-family values with 'Inter'
 *     - Replace any remaining unlisted display fonts with 'Inter'
 *     - Ensure body uses 'Stage Grotesk'
 *  4. In inline styles: do the same replacements
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Files to skip (keep their fonts untouched)
const SKIP = new Set(['Zenisth_DS.html']);

// New Google Fonts link — Inter (all weights needed) + DM Mono
const NEW_GFONTS_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet">';

// Stage Grotesk @font-face block (using relative path from HTML root)
const STAGE_GROTESK_FACES = `
  <style id="stage-grotesk-faces">
    @font-face { font-family: 'Stage Grotesk'; src: url('fonts/StageGrotesk-Light.otf') format('opentype'); font-weight: 300; font-style: normal; font-display: swap; }
    @font-face { font-family: 'Stage Grotesk'; src: url('fonts/StageGrotesk-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
    @font-face { font-family: 'Stage Grotesk'; src: url('fonts/StageGrotesk-Medium.otf') format('opentype'); font-weight: 500; font-style: normal; font-display: swap; }
    @font-face { font-family: 'Stage Grotesk'; src: url('fonts/StageGrotesk-Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap; }
    @font-face { font-family: 'Stage Grotesk'; src: url('fonts/StageGrotesk-Italic.otf') format('opentype'); font-weight: 400; font-style: italic; font-display: swap; }
  </style>`;

// Old display fonts to replace with Inter
const DISPLAY_FONTS = [
  'Bricolage Grotesque',
  'Fraunces',
  'Syne',
  // Do NOT replace: Stage Grotesk, DM Mono, Inter
];

// Regex to find old Google Fonts link tags (handles multiline across multiple lines)
const GFONTS_LINK_RE = /<link[\s\S]*?fonts\.googleapis\.com\/css2[\s\S]*?>/gi;

function replaceFontsInCSS(css) {
  let result = css;

  // Replace old display font names with Inter
  for (const font of DISPLAY_FONTS) {
    // Handles: 'Font Name', "Font Name", Font Name (unquoted in CSS vars)
    const escaped = font.replace(/[-()]/g, '\\$&');
    const re = new RegExp(`(['"]?)${escaped}\\1`, 'gi');
    result = result.replace(re, "'Inter'");
  }

  return result;
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  if (SKIP.has(fileName)) {
    console.log(`⏭️  Skipping: ${fileName}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // ── 1. Replace ALL Google Fonts link tags with the new unified one ─────────
  let gfontsCount = 0;
  html = html.replace(GFONTS_LINK_RE, (match) => {
    gfontsCount++;
    if (gfontsCount === 1) return NEW_GFONTS_LINK; // Keep first, replace content
    return ''; // Remove duplicates
  });

  // Also handle preconnect links just before the fonts link (clean them up)
  html = html.replace(/<link[^>]*rel="preconnect"[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/gi, '');

  // ── 2. Inject Stage Grotesk @font-face if not already present ─────────────
  if (!html.includes('stage-grotesk-faces') && !html.includes("url('fonts/StageGrotesk")) {
    // Insert right after </head> opening <style> or right before </head>
    html = html.replace(/<\/head>/i, `${STAGE_GROTESK_FACES}\n</head>`);
  }

  // ── 3. Replace old display fonts in <style> blocks and inline styles ───────
  // Process <style>...</style> blocks
  html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, content, close) => {
    return open + replaceFontsInCSS(content) + close;
  });

  // Process inline style="" attributes
  html = html.replace(/style="([^"]*)"/g, (_, styles) => {
    return `style="${replaceFontsInCSS(styles)}"`;
  });

  // ── 4. Ensure body has Stage Grotesk ──────────────────────────────────────
  // If body already has a font-family declaration using Inter (after our replacement),
  // swap it back to Stage Grotesk
  html = html.replace(
    /(\bbody\b[^{]*\{[^}]*font-family:\s*)'Inter'/gi,
    `$1'Stage Grotesk'`
  );

  // ── 5. Remove old CSS variable overrides that hardcode old fonts ──────────
  // e.g. --display: 'Bricolage Grotesque' — now just set them to Inter
  html = html.replace(/(--display\s*:\s*)['"]?[^;'"]+['"]?/gi, "$1'Inter'");
  html = html.replace(/(--sans\s*:\s*)['"]?[^;'"]+['"]?(?!\s*\))/gi, "$1'Stage Grotesk'");

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ ${fileName}`);
  } else {
    console.log(`⬜ ${fileName} (no changes)`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts', 'Desktop Fonts'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(full);
    }
  }
}

walk(ROOT);
console.log('\n🎉 Typography standardization complete.');
console.log('   Headings → Inter  |  Body → Stage Grotesk  |  Code → DM Mono');
