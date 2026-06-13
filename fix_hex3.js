const fs = require('fs');
const path = require('path');

const hexMap = {
    // Emojis mapped from double encoded utf-8
    'c3b0c5b8c2a7c2a9': 'f09fa7a9', // 🧩 -> 🧩
    'c3b0c5b8c2a7c2a0': 'f09fa7a0', // 🧠 -> 🧠
    'c3b0c5b8e28093c2b1': 'f09f96b1', // 🖱 -> 🖱
    'c3b0c5b8c5bde280a8': 'f09f8ea8', // ðŸŽ¨ -> 🎨
    'c3b0c5b8e2809cc28b': 'f09f938b', // ðŸ“‹ -> 📋
    'c3b0c5b8c2a4e28093': 'f09fa496', // 🤖 -> 🤖
    'c3b0c5b8c5a1e282ac': 'f09f9a80', // 🚀 -> 🚀
    'c3b0c5b8c2a7c2b2': 'f09fa7b2', // 🧲 -> 🧲
    'c3b0c5b8c2aae2809f': 'f09faabf', // ðŸªŸ -> 🪟
    'c3b0c5b8c2a4c29d': 'f09fa49d', // ðŸ¤  -> 🤝
    'c3b0c5b8e2809dc28d': 'f09f948d', // ðŸ”  -> 🔍
    'c3b0c5b8c2a5c2be': 'f09fa5be', // 🥾 -> 🥾
    'c3b0c5b8e28094c2bac3afc2b8c28f': 'f09f97baefb88f', // ðŸ—ºï¸  -> 🗺️
    'c3b0c5b8e28098c2a5': 'f09f91a5', // 👥 -> 👥
    'c3b0c5b8e28099c2b0': 'f09f92b0', // 💰 -> 💰
    'c3b0c5b8e2809cc2b8': 'f09f93b8', // 📸 -> 📸
    'c3b0c5b8e28099c2ac': 'f09f92ac', // 💬 -> 💬
    'c3b0c5b8e280bac292': 'f09f9ba2', // ðŸ›’ -> 🛒
    'c3b0c5b8c2a0c2a0': 'f09f8fa0', // ðŸ   -> 🏠
    'c3b0c5b8e2809cc5be': 'f09f939e', // 📞 -> 📞
    'c3b0c5b8e2809cc5a0': 'f09f938a', // 📊 -> 📊
    'c3b0c5b8e2809cc285': 'f09f9385', // ðŸ“… -> 📅
    'c3b0c5b8e28099c2b3': 'f09f92b3', // 💳 -> 💳
    'c3b0c5b8c295c3afc2b8c28f': 'f09f9595efb88f', // ðŸ •ï¸  -> 🛎️
    'c3b0c5b8e2809cc288': 'f09f9388', // ðŸ“ˆ -> 📈
    'c3b0c5b8c2b7c3afc2b8c28f': 'f09f8fb7efb88f', // ðŸ ·ï¸  -> 🏷️
    'c3b0c5b8c592c290': 'f09f8c90', // ðŸŒ  -> 🌐
    'c3b0c5b8e2809cc284': 'f09f9384', // ðŸ“„ -> 📄
    'c3b0c5b8e2809cc2b5': 'f09f93b5', // 📵 -> 📵
    'c3b0c5b8c5bde28093': 'f09f8e81', // ðŸŽ  -> 🎁
    'c3b0c5b8c5bde280af': 'f09f8eaf', // ðŸŽ¯ -> 🎯
    'c3b0c5b8e2809dc292': 'f09f9492', // ðŸ”’ -> 🔒
    'c3b0c5b8e2809cc2b2': 'f09f93b2', // 📲 -> 📲
    'c3b0c5b8e2809dc284': 'f09f9484', // ðŸ”„ -> 🔄

    // â mappings
    'c3a2c2acc593': 'e2ac9c', // ⬜ -> ⬛
    'c3a2e28094c5bde280b9': 'e2978e', // â—Ž -> ◎
    'c3a2c5a1c2a0': 'e29aa0', // ⚠ -> ⚠
    'c3a2e2809ec2b9': 'e284b9', // ℹ -> ℹ
    'c3a2e28094c28b': 'e2978b', // â—‹ -> ○
    'c3a2c5a1e28093c3afc2b8c28f': 'e29a96efb88f', // âš–ï¸  -> ⚖️
    'c3a2c593e280a6': 'e29c85', // ✅ -> ✅
    'c3a2c2b1c2b1c3afc2b8c28f': 'e2b1b1efb88f', // â ±ï¸  -> ⏱️
    'c3a2e2809ac2b9': 'e282b9', // ₹ -> ₹
    'c3a2c593c592': 'e29d8c', // â Œ -> ❌
    'c3a2e280b0c2b3': 'e28fb3', // â ³ -> ⏳
    'c3a2e284a2c2bf': 'e299bf', // ♿ -> ♿

    // Fix for ← Back having stray character
    'e28690c290': 'e28690' // ←\x90 -> ←
};

const replacements = Object.keys(hexMap).map(k => ({
    bad: Buffer.from(k, 'hex'),
    good: Buffer.from(hexMap[k], 'hex')
}));

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let buf = fs.readFileSync(filePath);
    let changed = false;
    
    // Hex replacements
    for (let i = 0; i < replacements.length; i++) {
        const r = replacements[i];
        let idx;
        while ((idx = buf.indexOf(r.bad)) !== -1) {
            const before = buf.subarray(0, idx);
            const after = buf.subarray(idx + r.bad.length);
            buf = Buffer.concat([before, r.good, after]);
            changed = true;
        }
    }

    // Convert to string for CSS/HTML layout replacements
    let content = buf.toString('utf8');

    // Fix .hero-meta CSS in Zenisth_DS.html
    if (file === 'Zenisth_DS.html' && content.includes('.hero-meta {')) {
        const oldCss = `.hero-meta {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));`;
        const newCss = `.hero-meta {
    display: flex;
    flex-wrap: wrap;`;
        if (content.includes(oldCss)) {
            content = content.replace(oldCss, newCss);
            changed = true;
        }
    }
    
    // Fix .hero-meta grid columns for mobile in other case studies
    // A lot of them have `grid-template-columns: repeat(4, 1fr)` or 5, but miss the flex-wrap for mobile
    // I will globally enforce flex-wrap on hero-meta for mobile if they are using grid and overflowing.
    // Instead of complex CSS parsing, let's inject a global <style> right before </head> to force .hero-meta wrapping on mobile
    if (file.endsWith('.html') && !file.includes('index.html')) {
        const styleInjection = `
  <style>
    @media (max-width: 900px) {
      .hero-meta {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 16px !important;
      }
      .hero-meta-item, .meta-card {
        flex: 1 1 calc(50% - 16px) !important;
        min-width: 140px !important;
        padding: 0 !important;
        border: none !important;
      }
    }
  </style>
</head>`;
        if (!content.includes('flex-wrap: wrap !important;')) {
            content = content.replace('</head>', styleInjection);
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
        console.log(`Fixed ${file}`);
    }
});
