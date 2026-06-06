const fs = require('fs');
const files = ['project.html', 'transify-case-study.html', 'trailtribe-case-study.html', 'rumble-rewards-case-study.html', 'idp-case-study.html', 'my-tool-stack.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/font-family: 'Stage Grotesk', sans-serif;/g, "font-family: 'Stage Grotesk', sans-serif; letter-spacing: 0.03em;");
    fs.writeFileSync(f, content);
  }
});
console.log('Done');
