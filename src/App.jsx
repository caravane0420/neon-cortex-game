import React, { useState, useEffect, useRef } from 'react';
import { calculateBeamPath, TYPES, DIR } from './engine/BeamSystem';
import { generateLevel } from './engine/LevelGenerator';
import Cell from './components/Cell';

function App() {
    const [levelData, setLevelData] = useState(null);
    const [grid, setGrid] = useState([]);
    const [inventory, setInventory] = useState({});
    const [beamPath, setBeamPath] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [won, setWon] = useState(false);

    // Initialize Level (Daily Seed)
    useEffect(() => {
        // Generate simple seed based on date
        const today = new Date().toDateString();
        // Simple hash of date string
        let seed = 0;
        for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

        const data = generateLevel(seed, 'medium');
        setLevelData(data);
        setGrid(data.grid);
        setInventory(data.inventory);
    }, []);

    // Update Beam whenever grid changes
    useEffect(() => {
        if (!levelData) return;
        const path = calculateBeamPath(grid, levelData.width, levelData.height);
        setBeamPath(path);

        // Check Win
        const lastPoint = path[path.length - 1];
        if (lastPoint && lastPoint.hit === 'target') {
            setWon(true);
        } else {
            setWon(false);
        }
    }, [grid, levelData]);

    const handleCellClick = (x, y) => {
        if (won) return;
        const cell = grid[y][x];

        // If clicking an existing mirror, rotate it? Or pick it up?
        // Let's implement: Click to Rotate, Right Click (or Long Press) to Pick Up
        // Simply: Click Rotate, if empty, select to place?

        // Logic:
        // 1. If Empty: check if simple empty.
        // 2. If Mirror: Remove it back to inventory.

        if (cell.type === TYPES.MIRROR_Slash || cell.type === TYPES.MIRROR_BackSlash) {
            // Remove
            const type = cell.type;
            const newGrid = [...grid];
            newGrid[y] = [...newGrid[y]];
            newGrid[y][x] = { type: TYPES.EMPTY };
            setGrid(newGrid);

            setInventory(prev => ({
                ...prev,
                [type]: prev[type] + 1
            }));
        } else if (cell.type === TYPES.EMPTY) {
            // Place selected mirror? 
            // For interface simplicity on web: 
            // We need a "Selected Tool".
            // Let's try: click empty cell -> cycles through available mirrors?
            // Or drag and drop?
            // Simple Cycle: Slash -> Backslash -> Empty (if available)

            // Let's iterate available:
            let toPlace = null;
            if (inventory[TYPES.MIRROR_Slash] > 0) toPlace = TYPES.MIRROR_Slash;
            else if (inventory[TYPES.MIRROR_BackSlash] > 0) toPlace = TYPES.MIRROR_BackSlash;

            if (toPlace) {
                const newGrid = [...grid];
                newGrid[y] = [...newGrid[y]];
                newGrid[y][x] = { type: toPlace };
                setGrid(newGrid);

                setInventory(prev => ({
                    ...prev,
                    [toPlace]: prev[toPlace] - 1
                }));
            }
        }
    };

    const handleReset = () => {
        if (!levelData) return;
        setGrid(levelData.grid); // This might need deep copy if we mutated original
        setInventory(levelData.inventory); // Same
        // Actually generateLevel creates fresh objects
        const data = generateLevel(123, 'medium'); // Re-gen (need seed state)
        // Quick fix: Reload page
        window.location.reload();
    };

    const shareResult = () => {
        const text = `REFRACT Daily\n⚡ Laser Aligned!\nPlayed at neon-entropy.com`;
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (!levelData) return <div className="text-white">Loading System...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono relative">
            <div className="title mb-6 text-center">
                <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 glow-text">
                    REFRACT
                </h1>
                <p className="text-cyan-800 text-xs tracking-[0.5em] mt-2">OPTICAL ALIGNMENT PROTOCOL</p>
            </div>

            {/* Game Board */}
            <div className="relative p-1 bg-slate-900 rounded-lg border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                {/* SVG Overlay for Beams */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{ padding: '4px' }}>
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <polyline
                        points={beamPath.map(p => `${p.x * 50 + 25},${p.y * 50 + 25}`).join(' ')} // 50px cell size
                        fill="none"
                        stroke="#00f3ff"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ filter: 'url(#glow)' }}
                    />
                </svg>

                {/* Grid Layer */}
                <div
                    className="grid gap-0 border border-slate-800 bg-black"
                    style={{
                        gridTemplateColumns: `repeat(${levelData.width}, 50px)`,
                        gridTemplateRows: `repeat(${levelData.height}, 50px)`
                    }}
                >
                    {grid.map((row, y) => (
                        row.map((cell, x) => (
                            <Cell
                                key={`${x}-${y}`}
                                x={x} y={y}
                                data={cell}
                                onInteract={handleCellClick}
                            />
                        ))
                    ))}
                </div>
            </div>

            {/* Controls / Inventory */}
            <div className="mt-8 flex gap-8 items-center">
                <div className="flex flex-col items-center">
                    <div className="text-sm text-slate-500 mb-1">INVENTORY</div>
                    <div className="flex gap-4">
                        <div className={`p-3 border rounded ${inventory[TYPES.MIRROR_Slash] > 0 ? 'border-white bg-slate-800' : 'border-slate-800 text-slate-600'}`}>
                            / x {inventory[TYPES.MIRROR_Slash] || 0}
                        </div>
                        <div className={`p-3 border rounded ${inventory[TYPES.MIRROR_BackSlash] > 0 ? 'border-white bg-slate-800' : 'border-slate-800 text-slate-600'}`}>
                            \ x {inventory[TYPES.MIRROR_BackSlash] || 0}
                        </div>
                    </div>
                </div>

                <button onClick={handleReset} className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 rounded">
                    RESET
                </button>
            </div>

            {/* Win Modal */}
            {won && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded border border-cyan-500 shadow-[0_0_50px_rgba(0,243,255,0.3)] text-center animate-bounce-short">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-4 glow-text">SYSTEM ALIGNED</h2>
                        <p className="text-slate-300 mb-6">Efficiency: 100%</p>
                        <button
                            onClick={shareResult}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-6 rounded uppercase tracking-wider"
                        >
                            SHARE DATA
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
