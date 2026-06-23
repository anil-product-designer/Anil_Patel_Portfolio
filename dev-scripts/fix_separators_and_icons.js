/**
 * fix_separators_and_icons.js
 *
 * This script does TWO things:
 *
 * 1. SEPARATORS – When <i data-lucide="help-circle"> sits between two plain text
 *    words (acting as a bullet/separator), replace it with a styled <span class="sep">·</span>
 *
 * 2. CSS ::before CONTENT STRINGS – Lucide icons injected inside CSS content:'...' strings
 *    are broken (they render as literal text). Remove them and use a CSS trick instead.
 *
 * 3. CONTEXTUAL ICONS – Any remaining help-circle that appears next to a keyword
 *    gets swapped for a meaningful Lucide icon.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// ─── 1. Contextual icon map ──────────────────────────────────────────────────
const ICON_MAP = [
  // Separators / category labels (these will be caught by step 1, but keep as safety)
  { re: /case.?stud/i,           icon: 'book-open'       },
  { re: /product.?design/i,      icon: 'pen-tool'        },
  { re: /b2b|saas/i,             icon: 'layers'          },
  { re: /fintech/i,              icon: 'dollar-sign'     },
  { re: /translation|translat/i, icon: 'globe'           },
  { re: /play.?store/i,          icon: 'shopping-bag'    },
  { re: /design/i,               icon: 'pen-tool'        },
  { re: /research/i,             icon: 'search'          },
  { re: /insight/i,              icon: 'eye'             },
  { re: /decision/i,             icon: 'check-circle'    },
  { re: /impact/i,               icon: 'trending-up'     },
  { re: /principle/i,            icon: 'list'            },
  { re: /scope/i,                icon: 'target'          },
  { re: /timeline|week|month/i,  icon: 'calendar'        },
  { re: /founding.?designer/i,   icon: 'user'            },
  { re: /author/i,               icon: 'user'            },
  { re: /shipped|roadmap/i,      icon: 'rocket'          },
  { re: /learning/i,             icon: 'lightbulb'       },
  { re: /ai.?powered|ai-powered/i,icon:'bot'             },
  { re: /intelligent.?doc/i,     icon: 'file-text'       },
  { re: /conversion/i,           icon: 'trending-up'     },
  { re: /end.?to.?end/i,         icon: 'arrow-right'     },
  { re: /2025|2026|2024/i,       icon: 'calendar'        },
  { re: /error|fail|panic/i,     icon: 'alert-circle'    },
  { re: /cost|pricing|billing/i, icon: 'dollar-sign'     },
  { re: /next|what.?next/i,      icon: 'arrow-right'     },
  { re: /screen/i,               icon: 'monitor'         },
  { re: /idp/i,                  icon: 'file-text'       },
  { re: /tool.?stack/i,          icon: 'wrench'          },
  { re: /build|ship|repeat/i,    icon: 'package'         },
  { re: /crafted/i,              icon: 'heart'           },
];

function findContextIcon(context) {
  const stripped = context.replace(/<[^>]+>/g, ' ');
  for (const { re, icon } of ICON_MAP) {
    if (re.test(stripped)) return icon;
  }
  return null;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

// Matches a single help-circle icon tag
const HELP_RE = /<i\s+data-lucide="help-circle"\s*><\/i>/g;

// Matches help-circle inside a CSS content: '...' or content: "..." value
// e.g.   content: '<i data-lucide="help-circle"></i>';
const CSS_CONTENT_RE = /content:\s*(['"])(.*?)\1\s*;/g;

/**
 * Decide what to do with a single help-circle icon at `offset` in `html`.
 * Returns a replacement string.
 */
function decideReplacement(html, offset) {
  const windowStart = Math.max(0, offset - 80);
  const windowEnd   = Math.min(html.length, offset + 80);
  const context     = html.slice(windowStart, windowEnd);

  // --- separator heuristic ---
  // A separator icon sits between two text runs with only whitespace around it.
  // Pattern: text-char [whitespace] <i...> [whitespace] text-char
  const before = html.slice(Math.max(0, offset - 30), offset).replace(/<[^>]*>/g, '').trim();
  const after  = html.slice(offset + 36, Math.min(html.length, offset + 66)).replace(/<[^>]*>/g, '').trim();
  const isSeparator = before.length > 0 && after.length > 0 &&
    /[\w\d\.\)\']$/.test(before) && /^[\w\d\(\'\"A-Z]/.test(after);

  if (isSeparator) {
    return '<span class="sep" aria-hidden="true">·</span>';
  }

  // --- contextual icon ---
  const icon = findContextIcon(context);
  if (icon) return `<i data-lucide="${icon}"></i>`;

  // --- no meaningful replacement – remove entirely ---
  return '';
}

/**
 * Strip broken icon HTML from CSS content strings.
 * e.g.  content: '<i data-lucide="help-circle"></i>';
 *   →   content: '›';    (a simple CSS arrow alternative)
 */
function fixCssContentStrings(html) {
  return html.replace(CSS_CONTENT_RE, (full, quote, inner) => {
    // Remove any embedded <i data-lucide="...">...</i> from the string
    const cleaned = inner
      .replace(/<i\s+data-lucide="[^"]+"\s*><\/i>/g, '›')
      .replace(/<i\s+data-feather="[^"]+"\s*><\/i>/g, '›');
    if (cleaned === inner) return full; // unchanged
    return `content: ${quote}${cleaned}${quote};`;
  });
}

/**
 * Add a lightweight separator CSS rule if not already present.
 */
function ensureSepStyle(html) {
  if (html.includes('.sep')) return html;
  const style = `\n    <style>.sep{margin:0 0.35em;opacity:0.4;font-style:normal;}</style>\n`;
  return html.replace(/<\/head>/i, style + '</head>');
}

// ─── main processing ──────────────────────────────────────────────────────────

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // Step A – fix broken CSS content strings first
  html = fixCssContentStrings(html);

  // Step B – ensure separator style
  html = ensureSepStyle(html);

  // Step C – replace every help-circle icon
  // We need to do this iteratively because offsets shift as we replace
  let result = '';
  let lastIndex = 0;
  const re = /<i\s+data-lucide="help-circle"\s*><\/i>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    result += html.slice(lastIndex, match.index);
    result += decideReplacement(html, match.index);
    lastIndex = match.index + match[0].length;
  }
  result += html.slice(lastIndex);
  html = result;

  // Step D – clean up stray [?] placeholders
  html = html.replace(/\[\?\]/g, '');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅', path.relative(projectRoot, filePath));
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

walk(projectRoot);
console.log('\n🎉 All done – separators replaced, CSS content strings fixed, contextual icons applied.');
