import React from 'react';
import { TYPES } from '../engine/BeamSystem';
import { motion } from 'framer-motion';

const Cell = ({ x, y, data, onInteract, isSelected }) => {
    const getIcon = () => {
        switch (data.type) {
            case TYPES.SOURCE: return '🔦';
            case TYPES.TARGET: return '🎯';
            case TYPES.WALL: return '🧱';
            case TYPES.MIRROR_Slash: return '/';
            case TYPES.MIRROR_BackSlash: return '\\'; // Escape backslash
            default: return '';
        }
    };

    const getStyle = () => {
        let base = "w-full h-full border border-slate-800 flex items-center justify-center text-2xl relative select-none ";
        if (data.type === TYPES.EMPTY) base += "hover:bg-slate-900 cursor-pointer ";
        if (data.type === TYPES.SOURCE) base += "bg-slate-900 border-neon-blue text-neon-blue ";
        if (data.type === TYPES.TARGET) base += "bg-slate-900 border-neon-purple text-neon-purple ";
        if (data.type === TYPES.WALL) base += "bg-slate-800 text-slate-500 ";

        // Mirrors
        if (data.type === TYPES.MIRROR_Slash || data.type === TYPES.MIRROR_BackSlash) {
            base += "bg-slate-900 cursor-pointer text-white font-bold ";
            if (isSelected) base += "ring-2 ring-neon-blue ";
        }

        return base;
    };

    return (
        <div
            className={getStyle()}
            onClick={() => onInteract(x, y)}
        >
            {/* Visual Representation of Mirrors */}
            {(data.type === TYPES.MIRROR_Slash) && (
                <div className="w-[80%] h-1 bg-white rotate-[-45deg] shadow-[0_0_10px_white]"></div>
            )}
            {(data.type === TYPES.MIRROR_BackSlash) && (
                <div className="w-[80%] h-1 bg-white rotate-[45deg] shadow-[0_0_10px_white]"></div>
            )}

            {/* Source Arrow */}
            {data.type === TYPES.SOURCE && (
                <div className={`absolute w-3 h-3 bg-cyan-400 rounded-full glow-box 
             ${data.dir === 0 ? '-top-1' : data.dir === 1 ? '-right-1' : data.dir === 2 ? '-bottom-1' : '-left-1'}
         `}></div>
            )}

            {/* Target Inner */}
            {data.type === TYPES.TARGET && (
                <div className="w-4 h-4 rounded-full border-2 border-fuchsia-500 target-glow"></div>
            )}

            {/* Grid Dot for Empty */}
            {data.type === TYPES.EMPTY && (
                <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            )}
        </div>
    );
};

export default Cell;
