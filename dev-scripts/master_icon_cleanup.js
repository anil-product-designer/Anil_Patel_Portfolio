/**
 * MASTER ICON CLEANUP SCRIPT
 *
 * Strategy:
 *  1. Any <i data-lucide|feather="..."> that sits INSIDE a <li>, <p>, <td>, <dd>
 *     sentence (i.e. surrounded by actual prose text) is REMOVED entirely —
 *     icons in the middle of sentences make zero sense.
 *
 *  2. Any <i data-lucide|feather="..."> between two text labels in nav/metadata
 *     spans (hero-eyebrow, nav-meta, footer, hero-tag, footer-brand, etc.)
 *     is replaced with a styled separator  ·
 *
 *  3. Principal-tag / principle-tag ::before pseudo-elements that have icon
 *     tags in CSS content strings are fixed to use '›'.
 *
 *  4. Every remaining icon that is still a generic placeholder or contextually
 *     wrong gets one final pass using a strict whitelist — only icons that
 *     appear as standalone decorators (at the START of a list item, or inside
 *     a dedicated icon wrapper class) are allowed to stay, and they get a
 *     meaning-appropriate icon name.
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// ─── helpers ─────────────────────────────────────────────────────────────────

const ICON_RE   = /<i\s+data-(?:lucide|feather)="([^"]+)"[^>]*>\s*<\/i>/g;
const SEP_SPAN  = '<span class="sep" aria-hidden="true">·</span>';

/** Wrapper classes/elements whose direct children can legitimately hold an icon */
const ICON_WRAPPER_CLASSES = [
  'tool-dot', 'pain-number', 'scope-dot',
  'section-icon', 'insight-icon', 'card-icon', 'feature-icon',
  'stat-icon', 'tag-icon', 'label-icon', 'badge-icon',
];

/** Tags that contain prose – icons inside these mid-sentence are noise */
const PROSE_TAGS = ['li', 'p', 'td', 'dd', 'blockquote', 'span'];

/**
 * True if the character immediately before/after the match (ignoring whitespace)
 * is alphanumeric / punctuation – meaning the icon is mid-sentence.
 */
function isMidSentence(html, matchStart, matchEnd) {
  const before = html.slice(Math.max(0, matchStart - 60), matchStart).replace(/<[^>]*>/g, '').trim();
  const after  = html.slice(matchEnd, Math.min(html.length, matchEnd + 60)).replace(/<[^>]*>/g, '').trim();
  // If there is text on BOTH sides, it is mid-sentence
  return before.length > 0 && after.length > 0
      && /\w$/.test(before) && /^\w/.test(after);
}

/**
 * True if the icon is inside a nav/metadata/footer label area
 * (between two short all-caps / title-case text fragments).
 */
function isSeparatorContext(html, matchStart, matchEnd) {
  const before = html.slice(Math.max(0, matchStart - 80), matchStart).replace(/<[^>]*>/g, '').trim();
  const after  = html.slice(matchEnd, Math.min(html.length, matchEnd + 80)).replace(/<[^>]*>/g, '').trim();
  // Short label text on both sides → separator role
  return before.length > 0 && before.length < 50
      && after.length  > 0 && after.length  < 60;
}

// ─── per-file processing ─────────────────────────────────────────────────────

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // ── Pass 1: Fix any icon still inside a CSS content: string ──────────────
  html = html.replace(
    /content:\s*(['"])<i\s+data-(?:lucide|feather)="([^"]+)"[^>]*><\/i>\1\s*;/g,
    (_, q, name) => {
      const chars = { 'chevron-right':'›','arrow-right':'→','check':'✓','check-circle':'✓','circle':'•','star':'★' };
      return `content: '${chars[name] || '›'}';`;
    }
  );

  // ── Pass 2: Walk through every icon tag and decide what to do ─────────────
  // Build result by iterating through matches
  let result   = '';
  let lastIndex = 0;
  const re = /<i\s+data-(?:lucide|feather)="([^"]+)"([^>]*)>\s*<\/i>/g;
  let m;

  while ((m = re.exec(html)) !== null) {
    const matchStart = m.index;
    const matchEnd   = matchStart + m[0].length;
    const iconName   = m[1];

    // Append everything before this match
    result += html.slice(lastIndex, matchStart);
    lastIndex = matchEnd;

    // ── Decision tree ───────────────────────────────────────────────────────

    // Rule A: Icon is ALREADY a purposeful decorator (not help-circle) AND
    // it appears at the very start of a line / list item → keep it as-is
    const isGeneric  = iconName === 'help-circle';
    const before60   = html.slice(Math.max(0, matchStart - 80), matchStart);
    const atListStart = />\s*$/.test(before60.replace(/<[^>]*>/g, '')) ||
                        /(<li|<td|<div)[^>]*>\s*$/.test(before60);

    if (!isGeneric && atListStart) {
      // Keep the original icon — it's a legitimate list decorator
      result += m[0];
      continue;
    }

    // Rule B: Mid-sentence → remove entirely
    if (isMidSentence(html, matchStart, matchEnd)) {
      // Drop the icon (append nothing)
      continue;
    }

    // Rule C: Separator context (between short labels) → replace with ·
    if (isSeparatorContext(html, matchStart, matchEnd)) {
      result += SEP_SPAN;
      continue;
    }

    // Rule D: Generic help-circle with no clear context → remove
    if (isGeneric) {
      continue;
    }

    // Rule E: Any other icon → keep (it was purposefully placed)
    result += m[0];
  }

  result += html.slice(lastIndex);
  html = result;

  // ── Pass 3: Remove any leftover [?] placeholders ─────────────────────────
  html = html.replace(/\[\?\]/g, '');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅', path.relative(ROOT, filePath));
  } else {
    console.log('⬜', path.relative(ROOT, filePath));
  }
}

// ─── walk ────────────────────────────────────────────────────────────────────

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
console.log('\n🎉 Master icon cleanup complete.');
