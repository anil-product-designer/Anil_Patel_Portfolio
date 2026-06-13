const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const betterLightModeCaseStudy = `.light-mode {
    --bg: #F8F8FB;
    --bg-2: #FFFFFF;
    --bg-3: #F1F0FF;
    --bg-4: #E8E6FF;
    --surface: #FFFFFF;
    --surface-2: #F8F8FB;
    --border: rgba(90,70,199,0.15);
    --border-2: rgba(90,70,199,0.25);
    --text: #1A1A24;
    --text-2: #4A4660;
    --text-3: #7A7596;
    --brand-dim: rgba(90,70,199,0.08);
  }`;

const betterLightModeMain = `.light-mode {
  --bg: #F8F8FB;
  --bg2: #FFFFFF;
  --bg3: #F1F0FF;
  --violet: #7c3aed;
  --violet-bright: #6d28d9;
  --violet-dim: #c4b5fd;
  --violet-glow: rgba(124, 58, 237, 0.08);
  --text: #1A1A24;
  --text-muted: #4A4660;
  --text-dim: #7A7596;
  --line: rgba(124, 58, 237, 0.15);
  --header-bg: rgba(248, 248, 251, 0.95);
}`;

// Update CSS file
const mainCssPath = path.join(dir, 'css', 'styles.css');
if (fs.existsSync(mainCssPath)) {
    let cssContent = fs.readFileSync(mainCssPath, 'utf8');
    const oldLightModeMatch = cssContent.match(/\.light-mode\s*\{[^}]+\}/);
    if (oldLightModeMatch) {
        cssContent = cssContent.replace(oldLightModeMatch[0], betterLightModeMain);
        fs.writeFileSync(mainCssPath, Buffer.from(cssContent, 'utf8'));
        console.log('Updated css/styles.css');
    }
}

// Update HTML files
htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Update .light-mode CSS block if exists
    const caseStudyLightModeRegex = /\.light-mode\s*\{[\s\S]*?--brand-dim:[^}]+\}/;
    if (caseStudyLightModeRegex.test(content)) {
        content = content.replace(caseStudyLightModeRegex, betterLightModeCaseStudy);
        changed = true;
    }

    // 2. Ensure theme.js is loaded
    if (!content.includes('theme.js')) {
        content = content.replace('</body>', '  <script src="js/theme.js"></script>\n</body>');
        changed = true;
    }

    // 3. Ensure theme toggle button exists in nav
    // We look for </nav> or similar to inject if it doesn't have theme-toggle
    if (content.includes('<nav') && !content.includes('theme-toggle')) {
        // Find the end of the nav right before </nav> or </div> depending on structure
        // Let's just find the first nav-right or nav-meta or nav links container
        const toggleHtml = `\n      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Theme" style="background:none; border:none; cursor:pointer; font-size:16px; margin-left: 16px;">
        <span class="sun-icon">☀️</span>
        <span class="moon-icon">🌙</span>
      </button>`;
      
        if (content.includes('nav-meta"')) {
            content = content.replace(/(<div[^>]*class="[^"]*nav-meta[^"]*"[^>]*>[\s\S]*?)(<\/div>)/, `$1${toggleHtml}\n    $2`);
            changed = true;
        } else if (content.includes('nav-links"')) {
            content = content.replace(/(<div[^>]*class="[^"]*nav-links[^"]*"[^>]*>[\s\S]*?)(<\/div>)/, `$1${toggleHtml}\n    $2`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
        console.log(`Fixed ${file}`);
    }
});
