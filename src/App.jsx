import React, { useState, useEffect, useCallback } from 'react';
import { calculateBeamPath, TYPES, DIR } from './engine/BeamSystem';
import { generateLevel } from './engine/LevelGenerator';
import Cell from './components/Cell';
import ParticleSystem from './components/ParticleSystem';
import { AudioSystem } from './engine/AudioSystem';

function App() {
    const [levelData, setLevelData] = useState(null);
    const [grid, setGrid] = useState([]);
    const [inventory, setInventory] = useState({});
    const [beamPath, setBeamPath] = useState([]);
    const [won, setWon] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);

    // Initialize Game
    useEffect(() => {
        // Date-based Seed
        const today = new Date().toDateString();
        let seed = 0;
        for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

        // Generate Level
        const data = generateLevel(seed, 'medium'); // Fixed directly to medium for demo
        setLevelData(data);
        setGrid(data.grid);
        setInventory(data.inventory);
    }, []);

    // Update Beam Logic
    useEffect(() => {
        if (!levelData) return;
        const path = calculateBeamPath(grid, levelData.width, levelData.height);
        setBeamPath(path);

        const lastPoint = path[path.length - 1];
        if (lastPoint && lastPoint.hit === 'target') {
            if (!won) {
                setWon(true);
                AudioSystem.playWin();
            }
        } else {
            setWon(false);
        }
    }, [grid, levelData]);

    // Interaction Handler
    const handleCellClick = useCallback((x, y) => {
        if (won) return;
        // Init Audio context on first interaction if needed
        AudioSystem.playClick();

        const cell = grid[y][x];

        if (cell.type === TYPES.MIRROR_Slash || cell.type === TYPES.MIRROR_BackSlash) {
            // Retrieve Mirror
            AudioSystem.playRotate();
            const type = cell.type;
            const newGrid = grid.map(row => [...row]);
            newGrid[y][x] = { type: TYPES.EMPTY };
            setGrid(newGrid);

            setInventory(prev => ({
                ...prev,
                [type]: prev[type] + 1
            }));
        } else if (cell.type === TYPES.EMPTY) {
            // Place Mirror
            let toPlace = null;
            if (inventory[TYPES.MIRROR_Slash] > 0) toPlace = TYPES.MIRROR_Slash;
            else if (inventory[TYPES.MIRROR_BackSlash] > 0) toPlace = TYPES.MIRROR_BackSlash;

            if (toPlace) {
                AudioSystem.playRotate();
                const newGrid = grid.map(row => [...row]);
                newGrid[y][x] = { type: toPlace };
                setGrid(newGrid);

                setInventory(prev => ({
                    ...prev,
                    [toPlace]: prev[toPlace] - 1
                }));
            } else {
                AudioSystem.playError();
            }
        }
    }, [grid, inventory, won]);

    const handleReset = () => {
        AudioSystem.playClick();
        if (confirm('진행 상황을 초기화하시겠습니까?')) {
            window.location.reload();
        }
    };

    const shareResult = () => {
        AudioSystem.playClick();
        const text = `REFRACT (리프랙트) 일일 챌린지\n⚡ 광학 정렬 완료!\n플레이: neon-entropy.com`;
        navigator.clipboard.writeText(text);
        alert("클립보드에 복사되었습니다!");
    };

    if (!levelData) return <div className="text-white flex items-center justify-center h-screen">SYSTEM BOOTING...</div>;

    // Calculate Impact Point for Particles
    const impactPoint = beamPath[beamPath.length - 1];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono relative overflow-hidden selection:bg-cyan-500 selection:text-black">

            {/* CRT / Scanline Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
            <div className="pointer-events-none fixed inset-0 z-50 bg-black opacity-10 animate-pulse-slow" />

            {/* Header */}
            <div className="title mb-8 text-center z-10">
                <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-600 glow-text animate-pulse-slow">
                    REFRACT
                </h1>
                <p className="text-cyan-500 text-sm tracking-[0.5em] mt-2 opacity-80">일일 광학 정렬 프로토콜</p>
            </div>

            {/* Game Container */}
            <div className="relative p-1 bg-slate-900 rounded-xl border border-slate-700 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10 transition-all duration-500">

                {/* SVG Overlay for Beams */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" style={{ padding: '4px' }}>
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <polyline
                        points={beamPath.map(p => `${p.x * 50 + 25},${p.y * 50 + 25}`).join(' ')}
                        fill="none"
                        stroke="#00f3ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'url(#glow)', opacity: 0.9 }}
                    />
                </svg>

                {/* Particles */}
                {impactPoint && (
                    <ParticleSystem x={impactPoint.x} y={impactPoint.y} active={true} />
                )}

                {/* Grid Layer */}
                <div
                    className="grid gap-0 bg-black/80 backdrop-blur rounded-lg overflow-hidden"
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

            {/* HUD / Inventory */}
            <div className="mt-10 flex flex-col items-center gap-6 z-10 w-full max-w-md">

                {/* Inventory Box */}
                <div className="flex gap-6 items-center justify-center bg-slate-900/80 p-6 rounded-lg border border-slate-700 w-full shadow-lg backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 text-[10px] text-slate-500 p-1 font-bold">MODULE STORAGE</div>

                    {/* Slot 1 */}
                    <div className="flex flex-col items-center gap-2 group cursor-default">
                        <div className={`w-16 h-16 border-2 flex items-center justify-center text-3xl rounded transition-all duration-300 ${inventory[TYPES.MIRROR_Slash] > 0 ? 'border-cyan-500 bg-cyan-900/20 text-white shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'border-slate-800 text-slate-700'}`}>
                            /
                        </div>
                        <span className="text-xs text-slate-400">우측 반사경 x{inventory[TYPES.MIRROR_Slash]}</span>
                    </div>

                    {/* Slot 2 */}
                    <div className="flex flex-col items-center gap-2 group cursor-default">
                        <div className={`w-16 h-16 border-2 flex items-center justify-center text-3xl rounded transition-all duration-300 ${inventory[TYPES.MIRROR_BackSlash] > 0 ? 'border-cyan-500 bg-cyan-900/20 text-white shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'border-slate-800 text-slate-700'}`}>
                            \
                        </div>
                        <span className="text-xs text-slate-400">좌측 반사경 x{inventory[TYPES.MIRROR_BackSlash]}</span>
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="text-xs text-red-500/50 hover:text-red-400 hover:bg-red-900/20 px-4 py-2 rounded transition-colors"
                >
                    [ 시스템 재설정 ]
                </button>
            </div>

            {/* Tutorial Modal */}
            {showTutorial && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={() => setShowTutorial(false)}>
                    <div className="bg-slate-900 p-8 rounded-xl border border-cyan-500/30 max-w-sm w-full shadow-[0_0_50px_rgba(0,243,255,0.2)]" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4 tracking-wider">플레이 가이드</h2>
                        <ul className="text-sm text-slate-300 space-y-3 mb-6 list-none">
                            <li className="flex items-center gap-3">
                                <span className="text-xl">🔦</span>
                                <span><strong>광원(Source)</strong>에서 빔이 발사됩니다.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-xl">🎯</span>
                                <span>광선을 <strong>목표(Target)</strong>까지 연결하세요.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="border border-white p-1 rounded">/</span>
                                <span>빈 칸을 클릭하여 <strong>거울</strong>을 배치합니다.</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => { AudioSystem.playClick(); setShowTutorial(false); }}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 rounded uppercase tracking-wider shadow-lg transition-transform active:scale-95"
                        >
                            접속 승인
                        </button>
                    </div>
                </div>
            )}

            {/* Win Modal */}
            {won && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-pulse-slow">
                    <div className="bg-slate-900 p-8 rounded-xl border-2 border-cyan-400 shadow-[0_0_100px_rgba(0,243,255,0.5)] text-center max-w-sm w-full transform transition-all hover:scale-105">
                        <h2 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white mb-2 glow-text">
                            SYSTEM ALIGNED
                        </h2>
                        <div className="text-cyan-500 text-xs tracking-widest mb-8">광학 정렬 성공 // 효율 100%</div>

                        <button
                            onClick={shareResult}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <span>💾</span> 결과 데이터 전송
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 text-[10px] text-slate-700 font-mono">
                REFRACT v2.0 // CARAVAGGIO SYSTEMS
            </div>
        </div>
    );
}

export default App;
