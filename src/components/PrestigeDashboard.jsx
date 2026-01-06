import React, { useMemo } from 'react';
import { PrestigeManager, UPGRADE_TREE } from '../core/PrestigeManager';

const PrestigeDashboard = ({ currentCredits, neuroPoints, unlockedUpgrades, onUpload, onBuyUpgrade, onClose }) => {
    const pendingNP = useMemo(() => PrestigeManager.calculatePendingNP(currentCredits), [currentCredits]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
            <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-slate-900 border border-neon-purple rounded-xl overflow-hidden shadow-[0_0_100px_rgba(188,19,254,0.3)]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">
                            신경망 업로드 저장소
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">의식을 영구적으로 업로드하여 시스템 성능을 강화하십시오.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white font-mono text-xl">
                        [X]
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">

                    {/* Left: Upload Section */}
                    <div className="w-1/3 p-6 border-r border-white/10 flex flex-col justify-center items-center text-center">
                        <div className="mb-8">
                            <p className="text-neon-blue font-mono text-sm mb-2">현재 뉴로 포인트 (NP)</p>
                            <p className="text-5xl font-bold text-white drop-shadow-[0_0_10px_#fff]">{neuroPoints}</p>
                        </div>

                        <div className="w-full bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
                            <p className="text-slate-400 text-xs mb-2">업로드 보상</p>
                            <p className="text-4xl font-bold text-neon-green mb-1">+{pendingNP}</p>
                            <p className="text-slate-500 text-[10px] uppercase">현재 자산 기반</p>
                        </div>

                        <button
                            onClick={() => onUpload(pendingNP)}
                            disabled={pendingNP === 0}
                            className={`w-full py-4 font-bold text-lg rounded transition-all font-display tracking-wider
                ${pendingNP > 0
                                    ? 'bg-neon-purple text-white hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(188,19,254,0.6)]'
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                        >
                            데이터 업로드 개시
                            {pendingNP > 0 && <span className="block text-xs font-normal mt-1 opacity-80">(세계 재구축)</span>}
                        </button>
                    </div>

                    {/* Right: Tech Tree */}
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
                        <h3 className="text-neon-yellow font-display mb-6">신경망 증강</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {UPGRADE_TREE.map(upgrade => {
                                const isUnlocked = unlockedUpgrades.includes(upgrade.id);
                                const canAfford = neuroPoints >= upgrade.cost;

                                return (
                                    <div
                                        key={upgrade.id}
                                        className={`p-4 border rounded-lg relative overflow-hidden group transition-all
                      ${isUnlocked
                                                ? 'border-neon-green bg-green-900/10'
                                                : canAfford
                                                    ? 'border-slate-600 bg-slate-800 hover:border-white cursor-pointer'
                                                    : 'border-slate-800 bg-slate-900 opacity-60'}`}
                                        onClick={() => !isUnlocked && canAfford && onBuyUpgrade(upgrade)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-bold ${isUnlocked ? 'text-neon-green' : 'text-white'}`}>{upgrade.name}</h4>
                                            <span className={`text-xs font-mono px-2 py-0.5 rounded
                         ${isUnlocked ? 'bg-neon-green text-black' : 'bg-slate-700 text-neon-purple'}`}>
                                                {isUnlocked ? '장착됨' : `${upgrade.cost} NP`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400">{upgrade.description}</p>

                                        {/* Visual BG Effect */}
                                        {isUnlocked && <div className="absolute inset-0 bg-neon-green/5 pointer-events-none" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrestigeDashboard;
