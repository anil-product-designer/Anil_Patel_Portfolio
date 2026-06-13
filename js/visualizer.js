document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('visualizer');

    // Configuration
    const config = {
        pillWidth: 24,     // Width of each pill in px
        gap: 8,            // Gap between columns
        rows: 8,           // Max pills per column (Reduced from 12)
        minHeight: 2,      // Min pills always visible
        maxHeight: 8,      // Max height (rows) (Reduced from 12)
        updateInterval: 100 // Speed of animation in ms
    };

    // Color Palette
    const colors = [
        '#f1f0ff', '#7c3aed', '#a855f7', '#34d399',
        '#fbbf24', '#f87171', '#818cf8', '#4c1d95'
    ];

    let gridCols = 0;

    // Generate Grid based on width
    function initGrid() {
        if (!container) return;
        container.innerHTML = ''; // Clear existing
        const containerWidth = container.clientWidth || window.innerWidth;
        const colWidth = config.pillWidth + config.gap;

        // Calculate number of columns to fill width
        gridCols = Math.floor(containerWidth / colWidth);

        for (let i = 0; i < gridCols; i++) {
            const column = document.createElement('div');
            column.className = 'viz-column';
            column.style.width = `${config.pillWidth}px`;
            column.style.gap = '6px'; // Vertical gap

            // Create pills for this column
            for (let j = 0; j < config.rows; j++) {
                const pill = document.createElement('div');
                pill.className = 'viz-pill';
                const color = colors[Math.floor(Math.random() * colors.length)];
                pill.style.backgroundColor = color;
                column.appendChild(pill);
            }

            container.appendChild(column);
        }
    }

    // Animation Logic
    function animate() {
        const columns = document.querySelectorAll('.viz-column');
        if (columns.length === 0) return requestAnimationFrame(animate);

        columns.forEach((col, index) => {
            // Smoother wave using sine + time
            const time = Date.now() / 250;
            // Create a "traveling" wave effect across columns
            const wave = Math.sin(time + (index * 0.2));
            const noise = Math.random() * 0.3;

            const intensity = (wave + 1) / 2 + noise;
            let activeCount = Math.floor(intensity * (config.maxHeight - config.minHeight)) + config.minHeight;
            activeCount = Math.max(config.minHeight, Math.min(config.maxHeight, activeCount));

            const pills = col.querySelectorAll('.viz-pill');

            pills.forEach((pill, pillIndex) => {
                // Determine visibility (bottom up)
                const visibleIndexThreshold = config.rows - activeCount;

                if (pillIndex >= visibleIndexThreshold) {
                    pill.style.opacity = '0.8'; // Slightly transparent for background
                    pill.style.transform = 'scale(1)';
                } else {
                    pill.style.opacity = '0.05'; // Very faint inactive
                    pill.style.transform = 'scale(0.8)';
                }
            });
        });

        requestAnimationFrame(animate);
    }

    // Initialize
    initGrid();
    animate();

    // Re-init on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initGrid, 200);
    });
});
