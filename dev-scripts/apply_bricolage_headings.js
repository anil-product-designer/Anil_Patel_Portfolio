const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['Zenisth_DS.html']);

const NEW_GFONTS_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet">';

const NEW_CSS_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');";

function processHtmlFile(filePath) {
  const fileName = path.basename(filePath);
  if (SKIP.has(fileName)) return;

  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // 1. Replace the Google Fonts link tag (Inter/DM Mono) with Bricolage Grotesque/DM Mono
  html = html.replace(/<link[\s\S]*?fonts\.googleapis\.com\/css2[\s\S]*?>/gi, NEW_GFONTS_LINK);

  // 2. Replace 'Inter' / Inter in font-family css/style properties
  html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, open, content, close) => {
    let updated = content.replace(/'Inter'/g, "'Bricolage Grotesque'");
    updated = updated.replace(/Inter, sans-serif/g, "Bricolage Grotesque, sans-serif");
    return open + updated + close;
  });

  html = html.replace(/style="([^"]*)"/g, (_, styles) => {
    let updated = styles.replace(/'Inter'/g, "'Bricolage Grotesque'");
    updated = updated.replace(/Inter, sans-serif/g, "Bricolage Grotesque, sans-serif");
    return `style="${updated}"`;
  });

  // 3. Replace --display: 'Inter' with --display: 'Bricolage Grotesque'
  html = html.replace(/--display\s*:\s*['"]Inter['"]/gi, "--display: 'Bricolage Grotesque'");

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ HTML: ${fileName}`);
  }
}

function processCssFile(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');
  const original = css;

  // Replace @import link
  css = css.replace(/@import url\(['"]https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[\s\S]*?['"]\);/gi, NEW_CSS_IMPORT);
  css = css.replace(/@import url\(['"]https:\/\/fonts\.googleapis\.com\/css2\?family=IBM\+Plex[\s\S]*?['"]\);/gi, NEW_CSS_IMPORT);

  // Replace font variables & references
  css = css.replace(/--font-heading:\s*['"]?Inter['"]?,\s*sans-serif/gi, "--font-heading: 'Bricolage Grotesque', sans-serif");
  css = css.replace(/'Inter'/g, "'Bricolage Grotesque'");

  if (css !== original) {
    fs.writeFileSync(filePath, css, 'utf8');
    console.log(`✅ CSS: ${path.basename(filePath)}`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts', 'Desktop Fonts'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.html')) {
        processHtmlFile(full);
      } else if (entry.name.endsWith('.css')) {
        processCssFile(full);
      }
    }
  }
}

walk(ROOT);
console.log('🎉 Bricolage Grotesque headings script completed.');
