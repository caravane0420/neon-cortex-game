import { SynergyManager } from './SynergyManager';

/**
 * EconomyEngine.js
 * Drives the game simulation loop.
 */
export class EconomyEngine {
    constructor() {
        this.tickRate = 100; // 100ms = 10 ticks/sec
        this.tickCount = 0;
        this.grid = {}; // Key: "x,y", Value: Building Object
        this.intervalId = null;
        this.isRunning = false;
    }

    /**
     * Starts the simulation loop.
     */
    startLoop() {
        if (this.isRunning) return;

        this.isRunning = true;
        console.log('Values Engine Started');

        this.intervalId = setInterval(() => {
            this.tick();
        }, this.tickRate);
    }

    /**
     * Stops the simulation loop.
     */
    stopLoop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Values Engine Stopped');
    }

    /**
   * Calculates the cost of the next building based on current count.
   * Formula: Base * (1.5 ^ count)
   */
    static calculateBuildingCost(basePrice, count) {
        return Math.floor(basePrice * Math.pow(1.5, count));
    }

    /**
     * Calculates earnings accumulated while offline.
     * @param {number} lastSaveTime - Timestamp of last save
     * @param {number} incomePerSec - Current income rate per second
     */
    static calculateOfflineEarnings(lastSaveTime, incomePerSec) {
        if (!lastSaveTime) return 0;

        const now = Date.now();
        const diffSeconds = (now - lastSaveTime) / 1000;

        // Cap offline time to 24 hours to encourage daily play
        const effectiveSeconds = Math.min(diffSeconds, 86400);

        if (effectiveSeconds < 60) return 0; // Ignore short disconnects

        return Math.floor(effectiveSeconds * incomePerSec);
    }

    /**
   * Calculates offline earnings with detailed reporting.
   * In a full implementation, this would iterate through SynergyManager
   * to check if efficiencies changed (e.g. night/day cycles, although not implemented yet).
   * For now, it uses the average income rate at save time.
   */
    static simulateOfflineProgress(lastSaveTime, lastIncomeRate) {
        if (!lastSaveTime) return { credits: 0, seconds: 0 };

        const now = Date.now();
        const diffSeconds = (now - lastSaveTime) / 1000;

        // Cap to 24 hours
        const effectiveSeconds = Math.min(diffSeconds, 84600);

        if (effectiveSeconds < 60) return { credits: 0, seconds: 0 };

        // Apply 30% penalty for "Unsupervised Operation" (Game design choice)
        // unless user has 'AI Overseer' upgrade (not checked here)
        const efficiency = 0.7;

        const earned = Math.floor(effectiveSeconds * lastIncomeRate * efficiency);

        return {
            credits: earned,
            seconds: effectiveSeconds,
            efficiency
        };
    }

    /**
     * Single simulation step.
     */
    tick() {
        this.tickCount++;

        // Iterate over all buildings in the grid
        // For performance in a real game, we might use a dirty list or chunking.
        // For now, simple iteration.
        Object.values(this.grid).forEach(building => {
            // Basic validation
            if (!building || !building.stats) return;

            const { x, y } = building;

            // Calculate Efficiency based on Synergy
            const efficiency = SynergyManager.calculateEfficiency(
                building,
                { x, y, grid: this.grid }
            );

            // Update building state (simplified)
            building.efficiency = efficiency;

            // In a real scenario, we'd produce resources here:
            // if (efficiency > 0) { ... produce ... }
        });

        if (this.tickCount % 10 === 0) {
            // Log status every second for debugging
            // console.log(`Tick ${this.tickCount} - Active Buildings: ${Object.keys(this.grid).length}`);
        }
    }

    /**
     * Adds a building to the grid for testing/gameplay.
     */
    placeBuilding(x, y, buildingTemplate) {
        const key = SynergyManager.getGridKey(x, y);
        // Deep copy template to avoid shared state issues
        const newBuilding = JSON.parse(JSON.stringify(buildingTemplate));
        newBuilding.x = x;
        newBuilding.y = y;
        newBuilding.efficiency = 1.0;

        this.grid[key] = newBuilding;
        return newBuilding;
    }
}
