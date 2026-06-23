/**
 * Architectural Background Animation
 * A subtle, performant background featuring a drifting grid, 
 * slowly rotating geometric outlines, and a pulsing radial glow.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('architectural-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let dpr = window.devicePixelRatio || 1;

    // Brand color provided by user
    const COLOR_HEX = '#5A46C7';

    // Parse hex to rgb for opacity handling
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 90, g: 70, b: 199 };
    };
    const rgb = hexToRgb(COLOR_HEX);
    const colorStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

    // Grid configuration
    const GRID_SIZE = 80;
    const GRID_OPACITY = 0.05; // 5%
    const GRID_SPEED_X = 0.2;
    const GRID_SPEED_Y = 0.2;

    // Shapes configuration
    const SHAPES_OPACITY = 0.10; // 10%
    const shapes = [
        { type: 'rect', size: 400, xOffset: 0.2, yOffset: 0.3, rotationSpeed: (Math.PI * 2) / (50 * 60) }, // 50 seconds per rotation at 60fps
        { type: 'circle', size: 300, xOffset: 0.8, yOffset: 0.7, rotationSpeed: -(Math.PI * 2) / (60 * 60) }, // 60s
        { type: 'rect', size: 250, xOffset: 0.7, yOffset: 0.2, rotationSpeed: (Math.PI * 2) / (45 * 60) }  // 45s
    ];

    // Glow configuration
    const GLOW_OPACITY = 0.08;
    const GLOW_CYCLE_TIME = 4000; // 4 seconds

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize);
    resize();

    let gridOffsetX = 0;
    let gridOffsetY = 0;
    let time = 0;

    function drawGrid() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${colorStr}, ${GRID_OPACITY})`;
        ctx.lineWidth = 1;

        const startX = gridOffsetX % GRID_SIZE - GRID_SIZE;
        const startY = gridOffsetY % GRID_SIZE - GRID_SIZE;

        for (let x = startX; x < width + GRID_SIZE; x += GRID_SIZE) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        for (let y = startY; y < height + GRID_SIZE; y += GRID_SIZE) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();
    }

    function drawShapes() {
        ctx.strokeStyle = `rgba(${colorStr}, ${SHAPES_OPACITY})`;
        ctx.lineWidth = 1.5;

        shapes.forEach((shape, index) => {
            const cx = width * shape.xOffset;
            const cy = height * shape.yOffset;
            const rotation = time * shape.rotationSpeed;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);

            ctx.beginPath();
            if (shape.type === 'rect') {
                const s = shape.size;
                ctx.rect(-s / 2, -s / 2, s, s);
            } else if (shape.type === 'circle') {
                ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            }
            ctx.stroke();

            ctx.restore();
        });
    }

    function drawGlow(now) {
        // Pulse gently scaling from 1 to 1.05 over 4 seconds and back
        // Math.sin(time / (CYCLE_TIME / 2) * PI) gives a smooth -1 to 1 wave
        const cycle = Math.sin((now / (GLOW_CYCLE_TIME / 2)) * Math.PI);
        const scale = 1 + (cycle + 1) * 0.025; // cycle + 1 maps -1..1 to 0..2, *0.025 = 0..0.05
        
        const cx = width * 0.5;
        const cy = height * 0.3; // Near headline area
        const baseRadius = Math.min(width, height) * 0.6;
        const radius = baseRadius * scale;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${colorStr}, ${GLOW_OPACITY})`);
        gradient.addColorStop(1, `rgba(${colorStr}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    let lastTime = performance.now();

    function animate(now) {
        const delta = now - lastTime;
        lastTime = now;
        
        // Use a consistent time step based on 60fps for rotation logic
        time += delta / (1000/60); 

        gridOffsetX -= GRID_SPEED_X * (delta / (1000/60));
        gridOffsetY -= GRID_SPEED_Y * (delta / (1000/60));

        ctx.clearRect(0, 0, width, height);

        // Fill background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);

        drawGlow(now);
        drawGrid();
        drawShapes();

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
