const fs = require('fs');
const path = require('path');

// Mapping for generic placeholders "[?]" or stray "�" to default icons (already applied)
const DEFAULT_ICON = 'help-circle';

// Mapping for existing help-circle placeholders to more context‑aware icons
const HELP_ICON_MAP = [
  // keyword, icon name
  { keyword: /fail|error|panic|failure|crash/i, icon: 'alert-circle' },
  { keyword: /what next|next step|next action/i, icon: 'arrow-right' },
  { keyword: /document count|character count|cost breakdown|billing|price|pricing/i, icon: 'info' },
  { keyword: /tool(s)? (don|doesn)('t)? show|clear|transparent/i, icon: 'info' },
  { keyword: /history|audit|log/i, icon: 'list' },
  { keyword: /trust|confidence|safe/i, icon: 'shield' },
  // fallback – keep help-circle
  { keyword: /.*/, icon: DEFAULT_ICON }
];

function inferHelpIcon(context) {
  const lowered = context.toLowerCase();
  for (const { keyword, icon } of HELP_ICON_MAP) {
    if (keyword.test(lowered)) return icon;
  }
  return DEFAULT_ICON;
}

function replacePlaceholders(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dev-scripts'].includes(entry.name) || entry.name.startsWith('.')) continue;
      replacePlaceholders(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Replace generic [?] / � placeholders (already done before, but keep for safety)
      content = content.replace(/\[\?\]/g, '<i data-lucide="help-circle"></i>');
      content = content.replace(/�/g, '<i data-lucide="help-circle"></i>');

      // Replace existing help-circle icons with context‑aware ones
      content = content.replace(/<i data-lucide="help-circle"><\/i>/g, (match, offset) => {
        const start = Math.max(0, offset - 40);
        const end   = Math.min(content.length, offset + 40);
        const context = content.slice(start, end);
        const icon = inferHelpIcon(context);
        return `<i data-lucide="${icon}"></i>`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('✅ Updated', fullPath);
      }
    }
  }
}

const projectRoot = path.resolve(__dirname, '..');
replacePlaceholders(projectRoot);
console.log('✅ All placeholder icons processed with context‑aware replacements.');
