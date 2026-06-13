const fs = require('fs');
const path = require('path');

const mobileFixStyles = `
  <!-- Universal Mobile Sizing & Alignment Fix -->
  <style>
    @media (max-width: 768px) {
      /* Prevent horizontal scrolling globally */
      body, html {
        overflow-x: hidden !important;
        width: 100% !important;
      }

      /* Reduce massive side paddings on containers */
      section, .hero, footer, main, .section-wrapper, [class*="-section"], [class*="-container"], [class*="-wrapper"] {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      /* Force common grids to single column */
      [class*="-grid"]:not(.project-nav-grid) {
        grid-template-columns: 1fr !important;
      }

      /* Reset excessive horizontal margins */
      .box, .meta-card, .tool-card, [class*="-card"], [class*="-box"] {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Ensure images don't break layout */
      img, video {
        max-width: 100% !important;
        height: auto !important;
      }

      /* Exceptions for specific alignments */
      .contact-strip {
        flex-direction: column !important;
        text-align: center !important;
        align-items: center !important;
      }
    }
  </style>
</head>`;

const dir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any previous injection if I ran this before
    content = content.replace(/<!-- Universal Mobile Sizing[\s\S]*?<\/style>\s*<\/head>/, '</head>');

    // Inject the fix right before </head>
    content = content.replace('</head>', mobileFixStyles);

    fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
    console.log("Injected mobile fix into " + file);
});
