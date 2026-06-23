const fs = require('fs');
const path = require('path');
const cssDir = 'c:/Users/Anil/OneDrive/Desktop/Trial Anti/New Try/css';

fs.readdirSync(cssDir).forEach(f => {
  if (f.endsWith('.css')) {
    const p = path.join(cssDir, f);
    let code = fs.readFileSync(p, 'utf8');
    const orig = code;

    // Replace Bricolage Grotesque, Syne, Nunito with Inter
    code = code.replace(/['"]Bricolage Grotesque['"]/g, "'Inter'");
    code = code.replace(/['"]Fraunces['"]/g, "'Stage Grotesk'");
    code = code.replace(/['"]Syne['"]/g, "'Inter'");
    code = code.replace(/['"]Nunito['"]/g, "'Inter'");

    if (code !== orig) {
      fs.writeFileSync(p, code, 'utf8');
      console.log(`✅ Updated CSS file: ${f}`);
    } else {
      console.log(`⬜ No changes: ${f}`);
    }
  }
});
