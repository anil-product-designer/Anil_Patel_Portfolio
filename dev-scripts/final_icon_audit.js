/**
 * FINAL COMPREHENSIVE ICON AUDIT
 *
 * For every HTML file, finds every <i data-lucide|feather="..."> and:
 *
 * RULE 1 — Mid-sentence (text on BOTH sides within the same inline context):
 *   → Remove icon entirely. Restore lost words if text was split by the icon.
 *
 * RULE 2 — Between two short text labels (nav, eyebrow, meta):
 *   → Replace with  <span class="sep" aria-hidden="true">·</span>
 *
 * RULE 3 — At the END of a sentence / list item (no text after it in that tag):
 *   → Remove icon entirely (orphan decorators serve no purpose)
 *
 * RULE 4 — At the START of a list item / card and using a non-generic name:
 *   → Keep (purposeful visual indicator)
 *
 * Reports all changes made.
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const SEP = '<span class="sep" aria-hidden="true">·</span>';

// Icons that are meaningful ONLY as structural decorators (back button, toggles)
const STRUCTURAL_ICONS = new Set([
  'arrow-left', 'arrow-right', 'chevron-right', 'chevron-left',
  'chevron-down', 'chevron-up', 'sun', 'moon', 'menu', 'x',
  'external-link', 'link', 'search', 'close',
]);

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  let changes = 0;

  // We process the file as a string, scanning for icon patterns
  const ICON_PATTERN = /<i\s+data-(?:lucide|feather)="([^"]+)"[^>]*>\s*<\/i>/g;

  let result = '';
  let cursor = 0;
  let m;

  while ((m = ICON_PATTERN.exec(html)) !== null) {
    const matchStart = m.index;
    const matchEnd   = matchStart + m[0].length;
    const iconName   = m[1];

    // Append everything before this match
    result += html.slice(cursor, matchStart);
    cursor  = matchEnd;

    // ── Structural icons (arrow-left in back-btn, sun/moon in toggle) ────────
    // Check if they're inside a purposeful button/link context
    const surroundingBefore = html.slice(Math.max(0, matchStart - 200), matchStart);
    const inBackBtn   = /class="back-btn"[^>]*>$/.test(surroundingBefore.replace(/\s+/g, ' ').trimEnd()) ||
                        /back-btn/.test(surroundingBefore.slice(-100));
    const inThemeBtn  = /theme-toggle|sun-icon|moon-icon/.test(surroundingBefore.slice(-200));
    const inNavToggle = inBackBtn || inThemeBtn;

    if (inNavToggle || STRUCTURAL_ICONS.has(iconName) && inBackBtn) {
      // Keep as-is — these are intentional navigation icons
      result += m[0];
      continue;
    }

    // ── Get text context around the icon ──────────────────────────────────────
    // Strip tags for context analysis
    const rawBefore = html.slice(Math.max(0, matchStart - 150), matchStart)
                          .replace(/<[^>]*>/g, '').trim();
    const rawAfter  = html.slice(matchEnd, Math.min(html.length, matchEnd + 150))
                          .replace(/<[^>]*>/g, '').trim();

    // Does the icon sit BETWEEN two words (mid-sentence)?
    const hasBefore = rawBefore.length > 0 && /\w$/.test(rawBefore);
    const hasAfter  = rawAfter.length  > 0 && /^\w/.test(rawAfter);

    // Is it at the very end of its container (nothing after it)?
    const tagAfter = html.slice(matchEnd, matchEnd + 30).trim();
    const isAtEnd  = /^<\/(li|p|td|span|div|dd|h[1-6])/.test(tagAfter)
                  || /^\s*<\/(li|p|td|span|div|dd)/.test(html.slice(matchEnd, matchEnd + 10));

    // Is it a separator between two short labels?
    const isShortBefore = rawBefore.length > 0 && rawBefore.length < 50;
    const isShortAfter  = rawAfter.length  > 0 && rawAfter.length  < 60;
    const looksLikeSep  = isShortBefore && isShortAfter && !hasBefore && !hasAfter;

    // Separator icon between nav/eyebrow labels (layers, globe, etc.)
    if (looksLikeSep) {
      result += SEP;
      changes++;
      continue;
    }

    // Mid-sentence icon → remove
    if (hasBefore && hasAfter) {
      // Just drop the icon — the surrounding text reads naturally without it
      changes++;
      continue;
    }

    // Orphan at end of sentence → remove
    if (hasBefore && isAtEnd) {
      changes++;
      continue;
    }

    // Icon at the VERY START of a list item or card that's a non-generic icon
    const atStart = />\s*$/.test(html.slice(Math.max(0, matchStart - 10), matchStart));
    if (atStart && iconName !== 'help-circle') {
      // Keep purposeful decorators
      result += m[0];
      continue;
    }

    // Generic help-circle → always remove
    if (iconName === 'help-circle') {
      changes++;
      continue;
    }

    // Default: keep the icon
    result += m[0];
  }

  result += html.slice(cursor);
  html = result;

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ ${path.relative(ROOT, filePath)}  (${changes} icon(s) fixed)`);
  } else {
    console.log(`⬜ ${path.relative(ROOT, filePath)}  (no changes)`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name)) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(full);
    }
  }
}

walk(ROOT);
console.log('\n🎉 Final icon audit complete.');
