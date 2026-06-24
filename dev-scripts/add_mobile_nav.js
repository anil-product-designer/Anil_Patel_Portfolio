const fs = require('fs');
const path = require('path');

const files = [
    'design-system-doc.html',
    'idp-case-study.html',
    'project.html',
    'rumble-rewards-case-study.html',
    'trailtribe-case-study.html',
    'transify-case-study.html',
    'Zenisth_DS.html'
];

const mobileNavCss = `
<style>
  /* --- Mobile Navigation Styles --- */
  .nav__links {
    display: flex;
    gap: 32px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav__links a {
    color: var(--text-muted, #888);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }
  .nav__links a:hover {
    color: var(--text, #fff);
  }
  .menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    padding: 8px;
    z-index: 1001;
  }
  .menu-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background-color: var(--text, #f5f5f5);
    transition: all 0.3s ease-in-out;
    border-radius: 2px;
  }
  .menu-toggle--active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .menu-toggle--active span:nth-child(2) {
    opacity: 0;
  }
  .menu-toggle--active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (max-width: 900px) {
    .menu-toggle {
      display: flex;
    }
    .nav__links {
      position: absolute;
      top: 100%; /* Below header */
      left: 0;
      width: 100%;
      background: rgba(8, 8, 8, 0.95);
      backdrop-filter: blur(24px);
      flex-direction: column;
      padding: 24px;
      gap: 16px;
      transform: translateY(-150%);
      opacity: 0;
      transition: transform 0.4s ease, opacity 0.4s ease;
      z-index: -1;
      border-bottom: 1px solid var(--line, rgba(255,255,255,0.1));
      pointer-events: none;
    }
    .nav__links--active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
`;

const toggleHtml = `
  <button class="menu-toggle" aria-label="Toggle Navigation">
    <span></span>
    <span></span>
    <span></span>
  </button>
`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
    
    // First, verify if it already has the mobile nav added
    if (content.includes('menu-toggle') && content.includes('nav__links')) {
        console.log("Skipping " + file + ", already has mobile nav.");
        // Maybe we just need to fix if it was partially added.
        // For safety, let's proceed if we don't have our style block
    }

    let originalContent = content;

    // Replace <ul class="nav-links"> with <ul class="nav__links">
    content = content.replace(/<ul class="nav-links">/g, '<ul class="nav__links">');
    // If it's just <ul> without class
    content = content.replace(/<ul>\s*(<li><a href="#)/g, '<ul class="nav__links">\n$1');

    // Add toggle button after </ul> if it's inside <nav>
    // We can do this by finding </nav> and inserting toggle before it, 
    // but only if it doesn't already have it
    if (!content.includes('menu-toggle')) {
        content = content.replace(/(<\/nav>)/i, toggleHtml + '\n$1');
    }
    
    // Inject CSS right before </head>
    if (!content.includes('Mobile Navigation Styles')) {
        content = content.replace('</head>', mobileNavCss + '\n</head>');
    }

    if (originalContent !== content) {
        fs.writeFileSync(path.join(__dirname, '..', file), content, 'utf-8');
        console.log("Updated " + file);
    } else {
        console.log("No changes made to " + file);
    }
});
