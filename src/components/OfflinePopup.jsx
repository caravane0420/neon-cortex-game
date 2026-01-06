import React from 'react';

const OfflinePopup = ({ earnings, onCollect }) => {
    if (earnings <= 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border-2 border-neon-blue shadow-[0_0_50px_rgba(0,243,255,0.2)] rounded-xl p-8 max-w-md w-full text-center relative overflow-hidden">

                {/* Background Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent" />

                <h2 className="text-3xl font-display font-bold text-white mb-2">WELCOME BACK</h2>
                <p className="text-slate-400 mb-6">Simulation continued running in background.</p>

                <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
                    <p className="text-sm text-neon-blue mb-1 font-mono uppercase tracking-widest">Offline Earnings</p>
                    <p className="text-4xl font-bold text-neon-yellow drop-shadow-[0_0_10px_rgba(250,255,0,0.5)]">
                        +{earnings.toLocaleString()}
                    </p>
                </div>

                <button
                    onClick={onCollect}
                    className="w-full py-4 bg-neon-blue text-black font-bold text-lg rounded hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all font-display tracking-wider"
                >
                    COLLECT CREDITS
                </button>
            </div>
        </div>
    );
};

export default OfflinePopup;
