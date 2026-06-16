const fs = require('fs');
const path = 'globe-gallery.html';
let content = fs.readFileSync(path, 'utf8');

// 3. Update touchstart
const regexTouchStart = /document\.addEventListener\('touchstart',\s*e\s*=>\s*\{[\s\S]*?startDrag\(e\.touches\[0\]\.clientX,\s*e\.touches\[0\]\.clientY\);\s*},\s*\{\s*passive:\s*true\s*\}\);/;

const newTouchStart = `document.addEventListener('touchstart', e => {
  if (lightbox.classList.contains('active') || e.touches.length !== 1) return;
  startTouchX = e.touches[0].clientX;
  startTouchY = e.touches[0].clientY;
  isScrolling = false;
  startDrag(startTouchX, startTouchY);
}, { passive: true });`;

content = content.replace(regexTouchStart, newTouchStart);

// 4. Update touchmove
const regexTouchMove = /document\.addEventListener\('touchmove',\s*e\s*=>\s*\{[\s\S]*?if\s*\(wasDragging\)\s*e\.preventDefault\(\);\s*},\s*\{\s*passive:\s*false\s*\}\);/;

const newTouchMove = `document.addEventListener('touchmove', e => {
  if (lightbox.classList.contains('active') || e.touches.length !== 1) return;
  if (isScrolling) return;

  const dx = e.touches[0].clientX - startTouchX;
  const dy = e.touches[0].clientY - startTouchY;
  
  if (!wasDragging && Math.abs(dx) + Math.abs(dy) > 5) {
    if (Math.abs(dy) > Math.abs(dx)) {
      isScrolling = true;
      return;
    }
  }

  moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  if (wasDragging) e.preventDefault();
}, { passive: false });`;

content = content.replace(regexTouchMove, newTouchMove);

fs.writeFileSync(path, content);
console.log('globe-gallery.html scrolling logic strictly updated.');
