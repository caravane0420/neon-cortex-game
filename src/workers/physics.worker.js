

/**
 * physics.worker.js
 * Handles movement calculations for items on the belts to offload the main thread.
 */

// Physics/Logic Web Worker
let items = [];
const GRID_WIDTH = 800; // Mock dimension matching canvas for wrapping
const GRID_HEIGHT = 600;

// Viewport State (Received from Main)
let viewport = { x: 0, y: 0, w: 800, h: 600 };

self.onmessage = (e) => {
    const { type, payload } = e.data;
    if (type === 'INIT') {
        // Initialize mock items
        for (let i = 0; i < 100; i++) {
            items.push({
                id: i,
                x: Math.random() * GRID_WIDTH,
                y: Math.random() * GRID_HEIGHT,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
        loop();
    } else if (type === 'VIEWPORT_UPDATE') {
        viewport = payload;
    } else if (type === 'ADD_ITEM') {
        items.push(payload);
    }
};

function loop() {
    items.forEach(item => {
        item.x += item.vx;
        item.y += item.vy;

        // Bounce/Wrap logic
        if (item.x < 0 || item.x > GRID_WIDTH) item.vx *= -1;
        if (item.y < 0 || item.y > GRID_HEIGHT) item.vy *= -1;
    });

    // Culling based on viewport
    const visibleItems = items.filter(i =>
        i.x >= viewport.x - 20 && i.x <= viewport.x + viewport.w + 20 &&
        i.y >= viewport.y - 20 && i.y <= viewport.y + viewport.h + 20
    );

    self.postMessage({ type: 'UPDATE', items: visibleItems }); // Logic: only send what's needed for render? 
    // Actually GameCanvas renders itemsRef.current. If we only send visible, items outside will stick?
    // GameCanvas renders what it receives. If we partially send, the others disappear (good for culling).

    setTimeout(loop, 1000 / 60);
}
