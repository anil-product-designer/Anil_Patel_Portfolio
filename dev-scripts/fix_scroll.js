const fs = require('fs');
const path = 'globe-gallery.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Change touch-action: none to pan-y
content = content.replace('touch-action: none;', 'touch-action: pan-y;');

// 2. Add isScrolling variable and startTouch coordinates
content = content.replace(
  `let isDragging = false, lastMX = 0, lastMY = 0, dragVX = 0, dragVY = 0, dragDist = 0;`,
  `let isDragging = false, lastMX = 0, lastMY = 0, dragVX = 0, dragVY = 0, dragDist = 0;
let startTouchX = 0, startTouchY = 0, isScrolling = false;`
);

// 3. Update touchstart
const oldTouchStart = `document.addEventListener('touchstart', e => {
  if (lightbox.classList.contains('active') || e.touches.length !== 1) return;
  startDrag(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });`;

const newTouchStart = `document.addEventListener('touchstart', e => {
  if (lightbox.classList.contains('active') || e.touches.length !== 1) return;
  startTouchX = e.touches[0].clientX;
  startTouchY = e.touches[0].clientY;
  isScrolling = false;
  startDrag(startTouchX, startTouchY);
}, { passive: true });`;

content = content.replace(oldTouchStart, newTouchStart);

// 4. Update touchmove
const oldTouchMove = `document.addEventListener('touchmove', e => {
  if (lightbox.classList.contains('active') || e.touches.length !== 1) return;
  moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  if (wasDragging) e.preventDefault();
}, { passive: false });`;

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

content = content.replace(oldTouchMove, newTouchMove);

fs.writeFileSync(path, content);
console.log('globe-gallery.html scrolling logic updated.');
