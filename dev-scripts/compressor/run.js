const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.resolve(__dirname, '../../assets');
const rootDir = path.resolve(__dirname, '../../');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Find all HTML, CSS, JS files to update
const textFiles = [];
walkDir(rootDir, filePath => {
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dev-scripts')) return;
  const ext = path.extname(filePath).toLowerCase();
  if (['.html', '.css', '.js'].includes(ext)) {
    textFiles.push(filePath);
  }
});

let replacements = [];

async function compressImages() {
  const imageFiles = [];
  walkDir(assetsDir, filePath => {
    const ext = path.extname(filePath).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 200 * 1024) { // only > 200KB
        imageFiles.push(filePath);
      }
    }
  });

  console.log(`Found ${imageFiles.length} large images to compress.`);

  for (const imgPath of imageFiles) {
    const ext = path.extname(imgPath);
    const webpPath = imgPath.substring(0, imgPath.lastIndexOf(ext)) + '.webp';
    
    try {
      await sharp(imgPath)
        .resize({ width: 1920, withoutEnlargement: true }) // Max width
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      console.log(`Compressed: ${path.basename(imgPath)} -> ${path.basename(webpPath)}`);
      fs.unlinkSync(imgPath); // Delete original
      
      // We need to build replacement strings
      // Since paths in HTML could be relative (e.g. assets/images/8.png or ../assets/images/8.png)
      // We just replace the basename. But wait, what if two files have the same name?
      // Better to replace the filename exactly.
      const oldName = path.basename(imgPath);
      const newName = path.basename(webpPath);
      replacements.push({ oldName, newName });
    } catch (e) {
      console.error(`Failed on ${imgPath}:`, e);
    }
  }

  // Replace in text files
  if (replacements.length > 0) {
    textFiles.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      replacements.forEach(({oldName, newName}) => {
        // Simple string replace, making sure we match the file
        // We use regex to match oldName preceded by a slash or quote
        const regex = new RegExp(oldName.replace(/[-[\]{}()*+?.,\\\\^$|#\s]/g, '\\$&'), 'g');
        if (regex.test(content)) {
          content = content.replace(regex, newName);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated references in ${path.relative(rootDir, file)}`);
      }
    });
  }
}

compressImages().catch(console.error);
