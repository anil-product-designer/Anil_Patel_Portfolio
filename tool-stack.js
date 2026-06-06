
// ─── Tool data ──────────────────────────────────────────────────
const tools = {
  design: [
    {
      name: 'Figma',
      tag: 'Design',
      color: '#1ABCFE',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg" style="filter:invert(1)" alt="Figma">`
    },
    {
      name: 'FigJam',
      tag: 'Whiteboard',
      color: '#F24E1E',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg" style="filter:invert(1) sepia(1) saturate(5) hue-rotate(-10deg)" alt="FigJam">`
    },
    {
      name: 'Canva',
      tag: 'Graphics',
      color: '#00C4CC',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/canva.svg" style="filter:invert(1)" alt="Canva">`
    },
    {
      name: 'Framer',
      tag: 'Prototyping',
      color: '#0055FF',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/framer.svg" style="filter:invert(1)" alt="Framer">`
    },
    {
      name: 'Whimsical',
      tag: 'Diagrams',
      color: '#7C5CFC',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#7C5CFC" opacity=".15"/>
        <path d="M14 24 Q19 14 24 24 Q29 34 34 24" stroke="#7C5CFC" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="14" cy="24" r="3" fill="#7C5CFC"/>
        <circle cx="34" cy="24" r="3" fill="#7C5CFC"/>
      </svg>`
    },
    {
      name: 'Napkin',
      tag: 'Visuals',
      color: '#F59E0B',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#F59E0B" opacity=".15"/>
        <path d="M16 32 L20 18 L24 26 L28 20 L32 32" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="24" cy="14" r="4" fill="#F59E0B" opacity=".7"/>
      </svg>`
    },
    {
      name: 'Figma Make',
      tag: 'AI Design',
      color: '#A259FF',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#A259FF" opacity=".15"/>
        <circle cx="18" cy="18" r="6" fill="#1ABCFE" opacity=".8"/>
        <circle cx="30" cy="18" r="6" fill="#A259FF" opacity=".8"/>
        <circle cx="18" cy="30" r="6" fill="#F24E1E" opacity=".8"/>
        <circle cx="30" cy="30" r="6" fill="#0ACF83" opacity=".8"/>
        <path d="M22 22 L26 26" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    },
  ],
  build: [
    {
      name: 'Cursor',
      tag: 'AI Editor',
      color: '#6EE7B7',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#6EE7B7" opacity=".1"/>
        <path d="M24 10 L38 34 L24 28 L10 34 Z" fill="#6EE7B7" opacity=".9"/>
        <path d="M24 10 L38 34 L24 28 Z" fill="white" opacity=".2"/>
      </svg>`
    },
    {
      name: 'GitHub',
      tag: 'Version Control',
      color: '#ffffff',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" style="filter:invert(1)" alt="GitHub">`
    },
    {
      name: 'Vercel',
      tag: 'Deployment',
      color: '#ffffff',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vercel.svg" style="filter:invert(1)" alt="Vercel">`
    },
    {
      name: 'Netlify',
      tag: 'Deployment',
      color: '#00C7B7',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netlify.svg" style="filter:invert(1)" alt="Netlify">`
    },
    {
      name: 'Supabase',
      tag: 'Database',
      color: '#3ECF8E',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/supabase.svg" style="filter:invert(1)" alt="Supabase">`
    },
    {
      name: 'Replit',
      tag: 'Cloud IDE',
      color: '#F26207',
      icon: `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/replit.svg" style="filter:invert(1)" alt="Replit">`
    },
  ],
  ai: [
    {
      name: 'Antigravity',
      tag: 'AI Tools',
      color: '#818CF8',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#818CF8" opacity=".12"/>
        <circle cx="24" cy="24" r="10" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3"/>
        <circle cx="24" cy="12" r="3" fill="#818CF8"/>
        <path d="M24 15 L24 21" stroke="#818CF8" stroke-width="2" stroke-linecap="round"/>
        <path d="M20 22 L24 18 L28 22" stroke="#818CF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>`
    },
    {
      name: 'Emergent',
      tag: 'AI Build',
      color: '#F472B6',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#F472B6" opacity=".1"/>
        <path d="M24 10 L26 20 L36 18 L28 26 L34 36 L24 30 L14 36 L20 26 L12 18 L22 20 Z" fill="#F472B6" opacity=".8"/>
      </svg>`
    },
    {
      name: 'AI Studio',
      tag: 'Google AI',
      color: '#4285F4',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#4285F4" opacity=".1"/>
        <path d="M24 10 C17.4 10 12 15.4 12 22 C12 28.6 17.4 34 24 34 C30.6 34 36 28.6 36 22" stroke="#4285F4" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="24" cy="22" r="5" fill="#4285F4" opacity=".7"/>
        <path d="M32 16 L38 10 M36 10 L38 10 L38 16" stroke="#34A853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    },
    {
      name: 'Lovable',
      tag: 'AI Builder',
      color: '#FF6B6B',
      icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#FF6B6B" opacity=".1"/>
        <path d="M24 36 C24 36 10 28 10 19 C10 14.6 13.6 11 18 11 C20.5 11 22.8 12.2 24 14 C25.2 12.2 27.5 11 30 11 C34.4 11 38 14.6 38 19 C38 28 24 36 24 36Z" fill="#FF6B6B" opacity=".8"/>
      </svg>`
    },
  ]
};

// ─── Marquee fill ────────────────────────────────────────────────
const allNames = [
  ...tools.design.map(t => t.name),
  ...tools.build.map(t => t.name),
  ...tools.ai.map(t => t.name)
];
const doubled = [...allNames, ...allNames];
const marquee = document.getElementById('marquee');
doubled.forEach(name => {
  const item = document.createElement('div');
  item.className = 'marquee-item';
  item.innerHTML = `<span class="dot"></span>${name}`;
  marquee.appendChild(item);
});

// ─── Card builder ────────────────────────────────────────────────
function buildCards(containerId, list) {
  const grid = document.getElementById(containerId);
  list.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div class="cat-dot" style="background:${tool.color}22;border:1.5px solid ${tool.color}55"></div>
      <div class="tool-icon" style="border:1px solid ${tool.color}33">
        ${tool.icon}
      </div>
      <div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-tag">${tool.tag}</div>
      </div>
    `;
    // override card glow per-tool
    card.style.setProperty('--card-glow', `${tool.color}08`);
    grid.appendChild(card);
  });
}

buildCards('grid-design', tools.design);
buildCards('grid-build', [...tools.build, ...tools.ai]);

// ─── Scroll-triggered reveal ─────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.tool-card').forEach(card => observer.observe(card));

// ─── Cursor sparkle ──────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.92) {
    const spark = document.createElement('div');
    Object.assign(spark.style, {
      position: 'fixed',
      left: e.clientX + 'px',
      top: e.clientY + 'px',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: Math.random() > .5 ? '#6ee7b7' : '#818cf8',
      pointerEvents: 'none',
      zIndex: 9999,
      transform: 'translate(-50%,-50%)',
      transition: 'opacity .8s, transform .8s',
      opacity: '1'
    });
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.opacity = '0';
      spark.style.transform = `translate(${(Math.random() - .5) * 40}px, ${-30 - Math.random() * 20}px)`;
    });
    setTimeout(() => spark.remove(), 900);
  }
});
