/**
 * Hero Particle Milky Way Galaxy & Interactive Vortex
 * Renders a high-density particle field mixed with blue and green.
 * Optimized for performance using fillRect instead of arc.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparent background if possible, but hero background is transparent. Let's keep default.
  // Actually, hero background has CSS gradients, so we need alpha.
  // We'll stick to standard context.

  let width, height;
  let animId;
  let mouse = { x: null, y: null, targetX: null, targetY: null, active: false, radius: 240 };
  let particles = [];
  let time = 0;

  // ----- CONFIG -----
  // Reduced from 40,000 to 15,000 for smooth 60fps while maintaining density
  const PARTICLE_COUNT = 15000;
  const INERTIA = 0.93;

  // Mixed Color Palette (Blue, Teal, Cyan, Sparks)
  let COLORS = [
    'rgba(79, 70, 229, ',   // Indigo / Deep Blue-Purple
    'rgba(16, 185, 129, ',  // Teal / Emerald Green
    'rgba(34, 211, 238, ',  // Bright Cyan
    'rgba(56, 189, 248, '   // Sky Blue
  ];
  let COLOR_SPARK = 'rgba(255, 255, 255, ';

  let isLightMode = false;

  function updateThemePalette() {
    isLightMode = (document.body && document.body.classList.contains('light-mode')) || 
                  document.documentElement.classList.contains('light-mode');

    if (isLightMode) {
      COLORS = [
        'rgba(79, 70, 229, ',   // Indigo
        'rgba(14, 165, 233, ',  // Light Blue
        'rgba(16, 185, 129, ',  // Emerald
        'rgba(245, 158, 11, '   // Amber
      ];
      COLOR_SPARK = 'rgba(15, 23, 42, '; // Dark slate spark
    } else {
      COLORS = [
        'rgba(79, 70, 229, ',   // Indigo / Deep Blue-Purple
        'rgba(16, 185, 129, ',  // Teal / Emerald Green
        'rgba(34, 211, 238, ',  // Bright Cyan
        'rgba(56, 189, 248, '   // Sky Blue
      ];
      COLOR_SPARK = 'rgba(255, 255, 255, ';
    }

    // Reassign colors to existing particles smoothly
    particles.forEach(p => {
      const isCore = p.isCore; 
      if (isCore) {
        p.colorBase = Math.random() > 0.45 ? COLOR_SPARK : (isLightMode ? 'rgba(79, 70, 229, ' : 'rgba(34, 211, 238, ');
      } else {
        p.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    });
  }

  // ----- RESIZE -----
  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    generateParticles();
  }

  // ----- GENERATE -----
  function generateParticles() {
    particles = [];
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.max(width, height) * 0.65;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Density distribution: heavily packed near the core
      const rFactor = Math.pow(Math.random(), 3.5); 
      const radius = rFactor * maxRadius + Math.random() * 4;
      
      const angle = Math.random() * Math.PI * 2;

      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      // Mix colors randomly
      let colorBase;
      const isCore = rFactor < 0.12;
      if (isCore) {
        // Core center: Mix of cyan/indigo and spark points
        colorBase = Math.random() > 0.45 ? COLOR_SPARK : (isLightMode ? 'rgba(79, 70, 229, ' : 'rgba(34, 211, 238, ');
      } else {
        // Randomly mix blue, green, cyan
        colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      // Center core particles are brighter and slightly larger
      const size = Math.random() * 0.8 + 0.5 + (1 - rFactor) * 0.8;
      const baseAlpha = (0.15 + (1 - rFactor) * 0.75) * (Math.random() * 0.4 + 0.6);

      particles.push({
        isCore: isCore,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        orbitRadius: radius,
        orbitAngle: angle,
        orbitSpeed: (0.0008 + (1 - rFactor) * 0.004) * 0.8,
        size: size,
        colorBase: colorBase,
        baseAlpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        angleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  // ----- DRAW GLOW IN THE MIDDLE -----
  function drawGlows() {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.4;

    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.35);
    if (isLightMode) {
      coreGlow.addColorStop(0, 'rgba(79, 70, 229, 0.25)'); // Indigo Core
      coreGlow.addColorStop(0.3, 'rgba(14, 165, 233, 0.1)'); // Blue tint
      coreGlow.addColorStop(0.7, 'rgba(16, 185, 129, 0.05)'); // Green fringe
    } else {
      coreGlow.addColorStop(0, 'rgba(34, 211, 238, 0.35)'); // Cyan Core
      coreGlow.addColorStop(0.3, 'rgba(16, 185, 129, 0.15)'); // Green tint
      coreGlow.addColorStop(0.7, 'rgba(79, 70, 229, 0.08)'); // Blue fringe
    }
    coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, width, height);

    // Mixed ambient glow
    const ambientGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);
    ambientGlow.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
    ambientGlow.addColorStop(0.5, 'rgba(79, 70, 229, 0.04)');
    ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ambientGlow;
    ctx.fillRect(0, 0, width, height);
  }

  // ----- ANIMATE -----
  function animate() {
    animId = requestAnimationFrame(animate);
    time += 0.01;

    ctx.clearRect(0, 0, width, height);

    drawGlows();

    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      }
    }

    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.orbitAngle += p.orbitSpeed;
      
      const targetX = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
      const targetY = cy + Math.sin(p.orbitAngle) * p.orbitRadius;

      let activeInteraction = false;

      if (mouse.active && mouse.x !== null) {
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        // Optimization: rough distance check before Math.sqrt
        if (Math.abs(dxMouse) < mouse.radius && Math.abs(dyMouse) < mouse.radius) {
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            activeInteraction = true;
            const force = (mouse.radius - distMouse) / mouse.radius;
            
            const swirlX = -dyMouse / (distMouse || 1) * 3.5 * force;
            const swirlY = dxMouse / (distMouse || 1) * 3.5 * force;

            const attractionX = -dxMouse / (distMouse || 1) * 0.8 * force;
            const attractionY = -dyMouse / (distMouse || 1) * 0.8 * force;

            p.vx += swirlX + attractionX;
            p.vy += swirlY + attractionY;
          }
        }
      }

      if (!activeInteraction) {
        const dxOrbit = targetX - p.x;
        const dyOrbit = targetY - p.y;
        
        p.vx += dxOrbit * 0.05; 
        p.vy += dyOrbit * 0.05;
      }

      p.vx *= INERTIA;
      p.vy *= INERTIA;

      p.x += p.vx;
      p.y += p.vy;

      // Twinkling spark effect
      // Optimization: Calculate twinkle less frequently or simplify
      const twinkle = Math.sin(time * 6 * p.twinkleSpeed + p.angleOffset);
      const finalAlpha = Math.max(0.04, Math.min(1, p.baseAlpha + twinkle * 0.2));

      ctx.fillStyle = p.colorBase + finalAlpha + ')';
      // Optimization: fillRect is much faster than arc for thousands of tiny particles
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  // ----- EVENTS -----
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.active = true;
  }

  function onMouseEnter() {
    mouse.active = true;
  }

  function onMouseLeave() {
    mouse.active = false;
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.x = null;
    mouse.y = null;
  }

  function init() {
    canvas.getContext('2d', { alpha: true });
    updateThemePalette();
    resize();
    window.addEventListener('resize', resize);

    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.addEventListener('mousemove', onMouseMove);
      heroSection.addEventListener('mouseenter', onMouseEnter);
      heroSection.addEventListener('mouseleave', onMouseLeave);
    }

    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateThemePalette();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    if (document.body) {
      observer.observe(document.body, { attributes: true });
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
