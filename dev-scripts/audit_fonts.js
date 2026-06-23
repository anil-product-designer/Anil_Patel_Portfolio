const fs   = require('fs');
const path = require('path');
const dir  = 'c:/Users/Anil/OneDrive/Desktop/Trial Anti/New Try';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Extract Google Font families from link tags
  const gFonts = [];
  const gMatch = html.match(/fonts\.googleapis\.com\/css2\?([^"']+)/g) || [];
  gMatch.forEach(link => {
    const families = link.match(/family=([^&"]+)/g) || [];
    families.forEach(fam => {
      const name = decodeURIComponent(fam.replace('family=', '').split(':')[0].replace(/\+/g,' '));
      gFonts.push(name);
    });
  });

  // Extract CSS custom property font definitions (--display, --sans, --mono etc.)
  const cssVars = [];
  const varMatches = html.match(/--(display|sans|mono|body|heading)[^:]*:\s*['"']?[^;'"'\n]+/gi) || [];
  varMatches.forEach(v => cssVars.push(v.trim()));

  if (gFonts.length || cssVars.length) {
    console.log('\n' + f);
    if (gFonts.length)  console.log('  Google Fonts: ' + [...new Set(gFonts)].join(' | '));
    if (cssVars.length) console.log('  CSS vars:     ' + [...new Set(cssVars)].join('\n                '));
  }
});
