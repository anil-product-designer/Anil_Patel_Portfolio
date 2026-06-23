/**
 * Repair transify-case-study.html nav/head corruption.
 *
 * The previous edits accidentally:
 *  1. Removed </head>, <body>, <!-- NAV -->, <nav>…</nav>
 *  2. Removed the opening <section class="hero"> and its wrapper divs
 *
 * This script:
 *  - Finds the corrupted seam (the orphaned hero-eyebrow <span> at line ~1303)
 *  - Injects the proper structural HTML before it
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '../transify-case-study.html');
let html   = fs.readFileSync(FILE, 'utf8');

// ── 1. Close the style tag that should end the <head> ──────────────────────
// After the .sep style tag, we need </head><body> then nav then hero opening

const BROKEN_SEAM =
  `    <script src="https://unpkg.com/lucide@latest"></script>\n` +
  `\n` +
  `    <style>.sep{margin:0 0.35em;opacity:0.4;font-style:normal;}</style>\n` +
  `      <span>Product Design`;

const FIXED_SEAM =
  `    <script src="https://unpkg.com/lucide@latest"></script>\n` +
  `\n` +
  `    <style>.sep{margin:0 0.35em;opacity:0.4;font-style:normal;}</style>\n` +
  `  </head>\n` +
  `\n` +
  `  <body>\n` +
  `\n` +
  `  <!-- NAV -->\n` +
  `  <nav>\n` +
  `    <div class="nav-left" style="display:flex; align-items:center; gap:24px;">\n` +
  `      <a href="index.html#work" class="back-btn"><i data-lucide="arrow-left"></i> Back</a>\n` +
  `      <a href="index.html" class="nav-logo" style="text-decoration: none; color: inherit;">Zenisth Transify</a>\n` +
  `    </div>\n` +
  `    <div class="nav-meta">\n` +
  `      <a href="index.html"\n` +
  `        style="font-size: 11px; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; text-decoration: none; transition: color 0.2s;"\n` +
  `        onmouseover="this.style.color='var(--violet-bright)'" onmouseout="this.style.color='var(--text-muted)'">Home</a>\n` +
  `      <span>B2B SaaS <span class="sep" aria-hidden="true">·</span> AI-powered Translation Tool</span>\n` +
  `      <span class="nav-tag">Case Study</span>\n` +
  `      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Theme">\n` +
  `        <span class="sun-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></span>\n` +
  `        <span class="moon-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></span>\n` +
  `      </button>\n` +
  `    </div>\n` +
  `  </nav>\n` +
  `\n` +
  `  <!-- HERO -->\n` +
  `  <section class="hero" style="padding-top: 120px;">\n` +
  `    <div class="hero-bg"></div>\n` +
  `    <div class="hero-eyebrow">\n` +
  `      <span>Product Design`;

if (html.includes(BROKEN_SEAM)) {
  html = html.replace(BROKEN_SEAM, FIXED_SEAM);
  fs.writeFileSync(FILE, html, 'utf8');
  console.log('✅ Nav/head structure restored in transify-case-study.html');
} else {
  console.log('⚠️  Seam not found — checking current state...');
  // Show a snippet around line 1300 to diagnose
  const lines = html.split('\n');
  lines.slice(1295, 1310).forEach((l, i) => console.log(`${1296 + i}: ${l}`));
}
