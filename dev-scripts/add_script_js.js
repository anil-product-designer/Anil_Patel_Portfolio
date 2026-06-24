const fs = require('fs');
const files = ['design-system-doc.html', 'project.html', 'Zenisth_DS.html'];
files.forEach(f => {
  const filePath = 'c:/Users/Anil/OneDrive/Desktop/My Portfolio/' + f;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('script.js')) {
    content = content.replace('</body>', '  <script src="js/script.js"></script>\n</body>');
    fs.writeFileSync(filePath, content);
    console.log('Added script.js to ' + f);
  }
});
