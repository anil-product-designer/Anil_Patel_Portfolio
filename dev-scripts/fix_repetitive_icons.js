const fs = require('fs');

function replaceIterative(filePath, targetClass, replacerFunc) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match the div/span that has the target class and all its SVG contents
  // Example: <div class="chaos-icon"><svg ...>...</svg></div>
  // Or: <span class="benefit-icon"><svg ...>...</svg></span>
  const regex = new RegExp(`<(div|span) class="${targetClass}">\\s*<svg[\\s\\S]*?<\\/svg>\\s*<\\/\\1>`, 'g');
  
  let matchCount = 0;
  content = content.replace(regex, (match, tag) => {
    const newInner = replacerFunc(matchCount);
    matchCount++;
    return `<${tag} class="${targetClass}">${newInner}</${tag}>`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${matchCount} ${targetClass} icons in ${filePath}`);
}

// 1. Zenisth_DS.html
// .chaos-icon
const chaosIcons = [
  '<i data-lucide="layout-template"></i>', // No Wireframes
  '<i data-lucide="blocks"></i>',          // No Component System
  '<i data-lucide="rocket"></i>',          // Startup Velocity
  '<i data-lucide="user"></i>'             // Sole Designer
];
replaceIterative('Zenisth_DS.html', 'chaos-icon', (i) => chaosIcons[i % chaosIcons.length]);

// .ai-pipe-icon
const aiPipeIcons = [
  '<i data-lucide="library"></i>',         // Design System
  '<i data-lucide="file-text"></i>',       // Documentation
  '<i data-lucide="bot"></i>',             // AI Coding
  '<i data-lucide="code"></i>',            // Frontend
  '<i data-lucide="package"></i>'          // Product
];
replaceIterative('Zenisth_DS.html', 'ai-pipe-icon', (i) => aiPipeIcons[i % aiPipeIcons.length]);


// 2. rumble-rewards-case-study.html
// .benefit-icon (4 items) -> usually checkmarks, maybe change them slightly if we know context
// Let's just use check-circle, arrow-right, star, zap
const benefitIcons = [
  '<i data-lucide="target"></i>',
  '<i data-lucide="zap"></i>',
  '<i data-lucide="award"></i>',
  '<i data-lucide="thumbs-up"></i>'
];
replaceIterative('rumble-rewards-case-study.html', 'benefit-icon', (i) => benefitIcons[i % benefitIcons.length]);

// .impact-icon (6 items)
const impactIcons = [
  '<i data-lucide="trending-up"></i>',
  '<i data-lucide="users"></i>',
  '<i data-lucide="activity"></i>',
  '<i data-lucide="bar-chart"></i>',
  '<i data-lucide="pie-chart"></i>',
  '<i data-lucide="check-circle"></i>'
];
replaceIterative('rumble-rewards-case-study.html', 'impact-icon', (i) => impactIcons[i % impactIcons.length]);

// .dem-icon (5 items) -> demographics?
const demIcons = [
  '<i data-lucide="user-check"></i>',
  '<i data-lucide="briefcase"></i>',
  '<i data-lucide="map-pin"></i>',
  '<i data-lucide="heart"></i>',
  '<i data-lucide="star"></i>'
];
replaceIterative('rumble-rewards-case-study.html', 'dem-icon', (i) => demIcons[i % demIcons.length]);


// 3. transify-case-study.html
// .psych-icon (5 items) -> psychology/persona?
const psychIcons = [
  '<i data-lucide="brain"></i>',
  '<i data-lucide="lightbulb"></i>',
  '<i data-lucide="eye"></i>',
  '<i data-lucide="message-circle"></i>',
  '<i data-lucide="compass"></i>'
];
replaceIterative('transify-case-study.html', 'psych-icon', (i) => psychIcons[i % psychIcons.length]);

