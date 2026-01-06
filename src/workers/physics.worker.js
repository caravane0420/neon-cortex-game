/* eslint-disable no-restricted-globals */

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
