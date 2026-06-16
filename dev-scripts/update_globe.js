const fs = require('fs');

const path = 'globe-gallery.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Add CSS variables and wrapper styling
content = content.replace(
  'html, body {',
  `:root {
    --pad-y: 120px;
  }
  @media (max-width: 768px) { :root { --pad-y: 80px; } }
  @media (max-width: 480px) { :root { --pad-y: 40px; } }

  html, body {`
);

content = content.replace(
  'body { cursor: grab; }',
  `body { 
    cursor: grab; 
    padding: var(--pad-y) 0;
    box-sizing: border-box;
  }
  #gallery-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }`
);

// 2. Change position: fixed to position: absolute for all elements EXCEPT lightbox and lightbox-close
// We will do this carefully by targeting specific ids and classes

content = content.replace(/#canvas-bg {\s*position: fixed;/g, '#canvas-bg {\n    position: absolute;');
content = content.replace(/#lines-svg {\s*position: fixed;/g, '#lines-svg {\n    position: absolute;');
content = content.replace(/#anchor {\s*position: fixed;/g, '#anchor {\n    position: absolute;');
content = content.replace(/\.photo-card {\s*position: fixed;/g, '.photo-card {\n    position: absolute;');
content = content.replace(/\.card-dot {\s*position: fixed;/g, '.card-dot {\n    position: absolute;');
content = content.replace(/#title {\s*position: fixed;/g, '#title {\n    position: absolute;');
content = content.replace(/#hint {\s*position: fixed;/g, '#hint {\n    position: absolute;');

// 3. Add the wrapper HTML
// We want to wrap only the gallery elements, leaving lightbox outside or inside, doesn't matter much
content = content.replace(
  '<body>',
  '<body>\n<div id="gallery-wrapper">'
);
content = content.replace(
  '<script>',
  '</div>\n<script>'
);

// 4. Update JS to use wrapper dimensions instead of window
content = content.replace(
  '<script>',
  `<script>
const wrapper = document.getElementById('gallery-wrapper');`
);

// Replace innerWidth/innerHeight globally in JS
content = content.replace(/window\.innerWidth/g, 'wrapper.clientWidth');
content = content.replace(/window\.innerHeight/g, 'wrapper.clientHeight');

fs.writeFileSync(path, content);
console.log('globe-gallery.html updated safely.');
