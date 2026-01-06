
import React, { useRef, useEffect } from 'react';

/**
 * GameCanvas
 * Renders the main game grid, entities, and analysis overlays (Heatmap).
 */
const GameCanvas = ({ showHeatmap, inventory, buildingsData }) => {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);

  // Use refs for animation loop data to avoid re-renders
  const itemsRef = useRef([]);
  const particlesRef = useRef([]);

  // Grid config
  const TILE_SIZE = 40;
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 15;

  // Generate a visual map of placed buildings from inventory for demo
  // In a real app, this would be passed as a prop `gridState` with specific x,y coords.
  // For this step, we'll randomize placements based on inventory count to show visualization.
  const buildingsEnvRef = useRef([]);

  useEffect(() => {
    // Only regenerate mock building positions if inventory changes significantly or init
    if (Object.keys(inventory).length > 0 && buildingsEnvRef.current.length === 0) {
      const newEnv = [];
      Object.entries(inventory).forEach(([id, count]) => {
        const template = buildingsData.find(b => b.id === id);
        for (let i = 0; i < count; i++) {
          newEnv.push({
            x: Math.floor(Math.random() * GRID_WIDTH) * TILE_SIZE,
            y: Math.floor(Math.random() * GRID_HEIGHT) * TILE_SIZE,
            color: template?.id.includes('heat') ? '#ff4d4d' : '#00f3ff', // Mock color
            heat: template?.stats?.heat || 0,
            template
          });
        }
      });
      buildingsEnvRef.current = newEnv;
    }
  }, [inventory, buildingsData]);

  useEffect(() => {
    // Initialize Worker
    workerRef.current = new Worker(new URL('../workers/physics.worker.js', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'UPDATE') {
        itemsRef.current = e.data.items;
      }
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      // 1. Clear & Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Grid
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += TILE_SIZE) {
        ctx.strokeStyle = (x % (TILE_SIZE * 5) === 0) ? '#00f3ff' : 'rgba(0, 243, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += TILE_SIZE) {
        ctx.strokeStyle = (y % (TILE_SIZE * 5) === 0) ? '#ff00ff' : 'rgba(255, 0, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 3. Draw Buildings
      buildingsEnvRef.current.forEach(b => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(b.x + 2, b.y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x + 2, b.y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

        // Building Icon/Text
        ctx.fillStyle = b.color;
        ctx.font = '10px monospace';
        ctx.fillText('건물', b.x + 8, b.y + 24);
      });

      // 4. Heatmap Overlay
      if (showHeatmap) {
        buildingsEnvRef.current.forEach(b => {
          if (b.heat > 0) {
            // Radial Gradient for heat
            const g = ctx.createRadialGradient(
              b.x + TILE_SIZE / 2, b.y + TILE_SIZE / 2, 0,
              b.x + TILE_SIZE / 2, b.y + TILE_SIZE / 2, TILE_SIZE * 2
            );
            g.addColorStop(0, `rgba(255, 50, 50, 0.6)`);
            g.addColorStop(1, 'rgba(255, 50, 50, 0)');

            ctx.fillStyle = g;
            ctx.fillRect(b.x - TILE_SIZE, b.y - TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);
          }
        });

        // Base Grid Tint
        ctx.fillStyle = 'rgba(0, 20, 40, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 5. Draw Items
      ctx.fillStyle = '#faff00';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#faff00';

      itemsRef.current.forEach(item => {
        const x = item.x % canvas.width;
        const y = item.y % canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Chance to spawn particle trail
        if (Math.random() < 0.1) {
          particlesRef.current.push({
            x, y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1.0,
            color: '#faff00'
          });
        }
      });
      ctx.shadowBlur = 0;

      // 6. Draw Particles
      particlesRef.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        if (p.life > 0) {
          ctx.fillStyle = `rgba(250, 255, 0, ${p.life})`;
          ctx.fillRect(p.x, p.y, 2, 2);
        } else {
          particlesRef.current.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [showHeatmap]);

  return (
    <div className="relative border-4 border-slate-800 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.3)]">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="bg-slate-900 cursor-crosshair"
      />
      {/* UI Overlay for Canvas (e.g. Coordinates) can go here */}
    </div>
  );
};

export default React.memo(GameCanvas);

