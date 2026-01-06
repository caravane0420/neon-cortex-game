```javascript
import { useState, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import GameCanvas from './components/GameCanvas'
import OfflinePopup from './components/OfflinePopup'
import PrestigeDashboard from './components/PrestigeDashboard'
import AdContainer from './components/AdContainer'
import { About, Guide, PrivacyPolicy, TermsOfService } from './components/Pages'
import { EconomyEngine } from './core/EconomyEngine'
import { eventManager } from './core/EventManager'
import { loadPrestigeData, savePrestigeData } from './utils/db'
import buildingsData from './data/buildings.json'
import questsData from './data/quests.json'
import { SaveSystem } from './core/SaveSystem'

function App() {
  // Routing State (Hash-based)
  const [currentPage, setCurrentPage] = useState('game'); 

  // Initialize Route from Hash
  useEffect(() => {
      const handleHashChange = () => {
          const hash = window.location.hash.slice(1); // remove #
          if (['about', 'guide', 'privacy', 'tos'].includes(hash)) {
              setCurrentPage(hash);
          } else {
              setCurrentPage('game');
          }
      };

      // Initial check
      handleHashChange();

      // Listen for changes
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
      window.location.hash = page === 'game' ? '' : page;
      setCurrentPage(page); // Optimistic update
  };

  // Game State
  const [credits, setCredits] = useState(1000)
  const [inventory, setInventory] = useState({}) 
  const [incomeRate, setIncomeRate] = useState(0)
  const [offlineEarnings, setOfflineEarnings] = useState(0)
  
  // Prestige State
  const [neuroPoints, setNeuroPoints] = useState(0)
  const [unlockedUpgrades, setUnlockedUpgrades] = useState([])
  const [showPrestige, setShowPrestige] = useState(false)

  // Strategic State
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [activeEvents, setActiveEvents] = useState([])

  // Monetization & Quests
  const [overclockActive, setOverclockActive] = useState(false)
  const [overclockTimeLeft, setOverclockTimeLeft] = useState(0)
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0)
  const [questCompleted, setQuestCompleted] = useState(false)

  // Load Game State & Prestige Data
  useEffect(() => {
    // 1. Load from Robust SaveSystem
    SaveSystem.load().then(data => {
        if (data) {
            setCredits(data.credits ?? 1000); 
            setInventory(data.inventory || {});
            setCurrentQuestIndex(data.questIndex || 0);

            // Mock income calc
            const mockedIncome = Object.values(data.inventory || {}).reduce((acc, count) => acc + count, 0); 
            setIncomeRate(mockedIncome);
            
            // Offline Progress
            const offlineReport = EconomyEngine.simulateOfflineProgress(data.lastSaveTime, mockedIncome, data.inventory);
            if (offlineReport.credits > 0) {
                setOfflineEarnings(offlineReport.credits);
            }
        }
    });

    // 2. Load Prestige Data (IndexedDB)
    loadPrestigeData().then(data => {
      setNeuroPoints(data.neuroPoints);
      setUnlockedUpgrades(data.unlockedUpgrades);
    }).catch(console.error);

    // 3. Event System Subscription
    const unsub = eventManager.subscribe(setActiveEvents);
    
    // Trigger loop for events
    const eventTimer = setInterval(() => {
        eventManager.update();
        if (Math.random() < 0.1) eventManager.triggerRandomEvent();
    }, 5000);

    return () => {
        unsub();
        clearInterval(eventTimer);
    }
  }, []);

  // Overclock Timer
  useEffect(() => {
    if (overclockTimeLeft > 0) {
      const timer = setInterval(() => {
        setOverclockTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setOverclockActive(false);
    }
  }, [overclockTimeLeft]);

  // Quest Tracker
  useEffect(() => {
    const quest = questsData[currentQuestIndex];
    if (!quest || questCompleted) return;

    let isComplete = false;
    if (quest.condition.type === 'build') {
      const count = inventory[quest.condition.target] || 0;
      if (count >= quest.condition.count) isComplete = true;
    } else if (quest.condition.type === 'total_count') {
      const total = Object.values(inventory).reduce((a, b) => a + b, 0);
      if (total >= quest.condition.count) isComplete = true;
    } else if (quest.condition.type === 'balance') {
      if (credits >= quest.condition.amount) isComplete = true;
    }

    if (isComplete) {
      setQuestCompleted(true);
    }
  }, [inventory, credits, currentQuestIndex, questCompleted]);

  // Auto-Save Loop
  useEffect(() => {
    const timer = setInterval(() => {
      const state = {
        credits,
        inventory,
        questIndex: currentQuestIndex,
        lastSaveTime: Date.now()
      };
      SaveSystem.save(state);
    }, 5000); 
    return () => clearInterval(timer);
  }, [credits, inventory, currentQuestIndex]);

  // Persist Prestige Data when changed
  useEffect(() => {
    savePrestigeData({ neuroPoints, unlockedUpgrades });
  }, [neuroPoints, unlockedUpgrades]);

  const handleBuy = (building) => {
    const currentCount = inventory[building.id] || 0;
    const basePrice = building.price || 100; 
    const cost = EconomyEngine.calculateBuildingCost(basePrice, currentCount);

    if (credits >= cost) {
      setCredits(prev => prev - cost);
      setInventory(prev => ({
        ...prev,
        [building.id]: (prev[building.id] || 0) + 1
      }));
      setIncomeRate(prev => prev + 1); // Ideally dynamic based on building stats
    }
  };

  const handleCollectOffline = () => {
    setCredits(prev => prev + offlineEarnings);
    setOfflineEarnings(0);
  };

  const handlePrestigeUpload = (earnedNP) => {
    if (earnedNP <= 0) return;

    // Reset Game State but Keep Quest Progress? Usually reset.
    // Let's reset quest for replayability or keep it per design. 
    // Resetting for this implementation.
    setCredits(1000);
    setInventory({});
    setIncomeRate(0);
    setCurrentQuestIndex(0); 
    setQuestCompleted(false);

    setNeuroPoints(prev => prev + earnedNP);
    setShowPrestige(false);
  };

  const handleBuyUpgrade = (upgrade) => {
    if (neuroPoints >= upgrade.cost && !unlockedUpgrades.includes(upgrade.id)) {
      setNeuroPoints(prev => prev - upgrade.cost);
      setUnlockedUpgrades(prev => [...prev, upgrade.id]);
    }
  };
  
  const activateOverclock = () => {
      // Mock Ad Watch
      // In real app, show ad modal, wait for callback
      const confirmed = window.confirm("Watch 30s Ad for 300% Boost?");
      if (confirmed) {
          setOverclockActive(true);
          setOverclockTimeLeft(600); // 10 minutes
      }
  };

  const claimQuest = () => {
      if (!questCompleted) return;
      const quest = questsData[currentQuestIndex];
      setCredits(prev => prev + quest.reward);
      setQuestCompleted(false);
      setCurrentQuestIndex(prev => prev + 1);
  };

  const currentQuest = questsData[currentQuestIndex];

  // --- RENDER LOGIC ---
  if (currentPage !== 'game') {
      return (
          <div className="min-h-screen bg-black text-neon-blue font-body selection:bg-neon-pink selection:text-white flex flex-col">
              <main className="flex-1 overflow-hidden p-4">
                  {currentPage === 'about' && <About onBack={() => navigateTo('game')} />}
                  {currentPage === 'guide' && <Guide onBack={() => navigateTo('game')} />}
                  {currentPage === 'privacy' && <PrivacyPolicy onBack={() => navigateTo('game')} />}
                  {currentPage === 'tos' && <TermsOfService onBack={() => navigateTo('game')} />}
              </main>
              {/* Footer */}
              <footer className="h-12 border-t border-slate-800 bg-slate-900 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-mono">
                <button onClick={() => navigateTo('game')} className="hover:text-neon-blue">GAME</button>
                <button onClick={() => navigateTo('guide')} className="hover:text-neon-blue">GUIDE</button>
                <button onClick={() => navigateTo('about')} className="hover:text-neon-blue">ABOUT</button>
                <button onClick={() => navigateTo('privacy')} className="hover:text-neon-blue">PRIVACY</button>
                <button onClick={() => navigateTo('tos')} className="hover:text-neon-blue">TERMS</button>
                <span>© 2026 CARAVAGGIO AI</span>
              </footer>
          </div>
      );
  }

  // --- GAME RENDER ---
  return (
    <div className="min-h-screen bg-black text-neon-blue font-body selection:bg-neon-pink selection:text-white flex flex-col">
      <OfflinePopup earnings={offlineEarnings} onCollect={handleCollectOffline} />
      
      {showPrestige && (
        <PrestigeDashboard 
          currentCredits={credits}
          neuroPoints={neuroPoints}
          unlockedUpgrades={unlockedUpgrades}
          onUpload={handlePrestigeUpload}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setShowPrestige(false)}
        />
      )}
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-6 justify-between z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
          NEON ENTROPY
        </h1>
        
        {/* Active Events Ticker */}
        <div className="flex-1 flex justify-center mx-4 gap-2 overflow-hidden">
            {overclockActive && (
                 <div className="px-3 py-1 bg-neon-yellow/20 border border-neon-yellow rounded text-neon-yellow text-xs font-mono animate-pulse font-bold flex items-center">
                    ⚡ OVERCLOCK ACTIVE ({Math.floor(overclockTimeLeft / 60)}:{(overclockTimeLeft % 60).toString().padStart(2, '0')})
                 </div>
            )}
            {activeEvents.map(e => (
                <div key={e.id} className="px-3 py-1 bg-slate-800 border border-t-2 border-slate-700 animate-pulse text-xs font-mono" style={{ borderTopColor: e.color }}>
                    <span style={{ color: e.color }} className="font-bold mr-2">⚠ {e.name}</span>
                    <span className="text-slate-300">ACTIVE ({((e.endTime - Date.now())/1000).toFixed(0)}s)</span>
                </div>
            ))}
        </div>

        <div className="flex gap-6 font-mono text-neon-yellow items-center">
           <button 
             onClick={() => setShowPrestige(true)}
             className="px-3 py-1 bg-neon-purple/20 border border-neon-purple rounded text-neon-purple text-xs hover:bg-neon-purple hover:text-white transition-all"
           >
             NEURAL UPLOAD
           </button>
           <div>INCOME: <span className={`text - green - 400 ${ overclockActive ? 'font-bold drop-shadow-[0_0_5px_#4ade80]' : '' } `}>
               +{(incomeRate * (overclockActive ? 3 : 1))}/s
               </span>
           </div>
           <div>CREDITS: <span className="text-white">{Math.floor(credits).toLocaleString()}</span></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Game Area (Canvas) */}
        <section className="flex-1 flex flex-col items-center justify-center bg-slate-950 relative p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/0 to-black/80 pointer-events-none" />
          
          {/* Top Banner Ad - Responsive visibility */}
          <div className="absolute top-4 w-[728px] max-w-full z-10 hidden md:block">
              <AdContainer slot="top-banner" format="horizontal" className="h-[90px] w-full" />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
             <button 
               onClick={() => setShowHeatmap(!showHeatmap)}
               className={`px - 3 py - 2 rounded text - xs font - bold border transition - all ${
  showHeatmap
    ? 'bg-red-900/50 border-red-500 text-red-200'
    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-white'
} `}
             >
               {showHeatmap ? '🔥 HEATMAP ACTIVE' : '👁 ANALYSIS MODE'}
             </button>
          </div>

          <div className="mt-16 mb-4 flex-1 w-full flex items-center justify-center p-4">
              <GameCanvas 
                showHeatmap={showHeatmap} 
                inventory={inventory} 
                buildingsData={buildingsData} 
              />
          </div>

          {/* Overclock Button */}
          <div className="absolute bottom-8 right-8 z-10">
              <button 
                disabled={overclockActive}
                onClick={activateOverclock}
                 className={`flex flex - col items - center justify - center w - 24 h - 24 rounded - full border - 4 shadow - [0_0_20px_rgba(250, 255, 0, 0.3)] transition - all
                  ${
  overclockActive
    ? 'bg-slate-800 border-slate-600 opacity-50 cursor-default'
    : 'bg-slate-900 border-neon-yellow hover:bg-neon-yellow hover:text-black hover:scale-105 cursor-pointer'
} `}
              >
                  <span className="text-2xl">⚡</span>
                  <span className="text-[10px] font-bold mt-1">OVERCLOCK</span>
              </button>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Quest Widget */}
          <div className="p-4 border-b border-slate-700 bg-slate-800/80">
            <h2 className="font-display text-sm mb-2 text-neon-blue flex justify-between">
                CURRENT OBJECTIVE
                <span className="text-slate-500 text-xs">#{currentQuestIndex + 1}</span>
            </h2>
            {currentQuest ? (
                <div className={`border rounded p - 3 transition - all ${ questCompleted ? 'border-neon-green bg-green-900/20' : 'border-slate-600 bg-slate-900' } `}>
                    <h3 className="font-bold text-white text-sm">{currentQuest.title}</h3>
                    <p className="text-xs text-slate-400 mb-2">{currentQuest.description}</p>
                    {questCompleted ? (
                        <button 
                          onClick={claimQuest}
                          className="w-full py-1 bg-neon-green text-black font-bold text-xs rounded hover:bg-white animate-pulse"
                        >
                            CLAIM REWARD (+{currentQuest.reward})
                        </button>
                    ) : (
                        <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                             <div className="bg-neon-blue h-full w-1/3 animate-[shimmer_2s_infinite]" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-xs text-slate-500 text-center py-4">All Systems Operational. No Active Directives.</div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-display text-lg mb-4 text-neon-pink">SYSTEM STATUS</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">FPS</span>
                <span className="text-green-400">60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ENTROPY</span>
                <span className="text-red-400">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NEURO-POINTS</span>
                <span className="text-neon-purple">{neuroPoints} NP</span>
              </div>
            </div>
          </div>

          {/* Ad Placement Sidebar */}
          <div className="p-4 border-b border-slate-800">
             <AdContainer slot="sidebar" format="square" className="w-full h-64" />
          </div>

          {/* Building Shop */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="font-display text-lg mb-4 text-neon-green">CONSTRUCT</h2>
            <div className="space-y-3">
              {buildingsData.map(b => {
                const count = inventory[b.id] || 0;
                const cost = EconomyEngine.calculateBuildingCost(b.price || 100, count);
                const canAfford = credits >= cost;

                return (
                  <div 
                    key={b.id}
                    onClick={() => canAfford && handleBuy(b)}
                    className={`group relative p - 3 border rounded transition - all cursor - pointer 
                      ${
  canAfford
    ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-neon-blue hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]'
    : 'border-slate-800 bg-slate-900 opacity-50 cursor-not-allowed'
} `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white group-hover:text-neon-blue">{b.name}</span>
                      <span className="text-xs bg-slate-700 px-1 rounded text-slate-300">Lvl {count}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{b.description}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                       <div className="flex gap-2 text-[10px] font-mono">
                          {b.stats.heat && <span className="text-red-400">HEAT {b.stats.heat}</span>}
                       </div>
                       <div className={`font - mono font - bold text - sm ${ canAfford ? 'text-neon-yellow' : 'text-red-500' } `}>
                          ${cost.toLocaleString()}
                       </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </aside>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-slate-800 bg-slate-900 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-mono z-20">
        <button onClick={() => navigateTo('game')} className="hover:text-neon-blue">GAME</button>
        <button onClick={() => navigateTo('guide')} className="hover:text-neon-blue">GUIDE</button>
        <button onClick={() => navigateTo('about')} className="hover:text-neon-blue">ABOUT</button>
        <button onClick={() => navigateTo('privacy')} className="hover:text-neon-blue">PRIVACY</button>
        <button onClick={() => navigateTo('tos')} className="hover:text-neon-blue">TERMS</button>
        <span>© 2026 CARAVAGGIO AI</span>
      </footer>
    </div>
  )
}

export default App
```
