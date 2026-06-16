const fs = require('fs');
const path = 'globe-gallery.html';
let content = fs.readFileSync(path, 'utf8');

// Instead of just calling animate() at the end, set up an IntersectionObserver
content = content.replace(
  'animate();',
  `let isVisible = true;
let animFrameId;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!isVisible) {
        isVisible = true;
        animate();
      }
    } else {
      isVisible = false;
    }
  });
});
observer.observe(wrapper);

// Update animate to respect isVisible
// We need to modify the requestAnimationFrame inside animate as well`
);

// We also need to change the inside of animate()
// Currently it's requestAnimationFrame(animate);
// Let's replace it.
content = content.replace(
  'requestAnimationFrame(animate);',
  `if (isVisible) {
    animFrameId = requestAnimationFrame(animate);
  }`
);

fs.writeFileSync(path, content);
console.log('globe-gallery.html updated with IntersectionObserver.');
