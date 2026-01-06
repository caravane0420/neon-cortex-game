import React from 'react';

const AdContainer = ({ slot = 'sidebar', format = 'square', className = '' }) => {
    return (
        <div className={`relative overflow-hidden border border-slate-700 bg-slate-900/80 group ${className}`}>
            {/* Neon Frame Effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-neon-pink/50 transition-colors pointer-events-none" />

            {/* Holographic Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,243,255,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scanline_4s_linear_infinite] pointer-events-none" />

            {/* Content Placeholder */}
            <div className="flex flex-col items-center justify-center p-4 h-full text-center">
                <span className="font-display text-[10px] tracking-[0.2em] text-slate-500 mb-2 border-b border-slate-800 pb-1">
                    HOLOGRAPHIC SENSOR
                </span>
                <div className="text-neon-pink text-xs font-mono animate-pulse">
                    [ ADVERTISEMENT SPACE ]
                </div>
                <p className="text-[10px] text-slate-600 mt-2">
                    {slot.toUpperCase()} // {format.toUpperCase()}
                </p>
            </div>

            {/* Glitch Overlay (Pure CSS visual) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default AdContainer;
