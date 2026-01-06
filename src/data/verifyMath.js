/**
 * Verification Simulation
 * Simulates optimal play (reinvesting 100% income) to estimate time to complete T7.
 */
import buildingsData from './buildings.json';
// Mocking tech tree stats heavily as we just want generic flow
// import techTree from './techTree.json';

// Simulation Params
const TARGET_CREDITS = 5.0e12; // T7 Processor Price
const TICK_RATE = 10; // Ticks per sec

let state = {
    credits: 1000,
    incomeRate: 0,
    inventory: {},
    timeElapsed: 0 // Seconds
};

// Simplified buildings for sim (just assuming highest tier available is bought)
// We assume player always buys the most efficient building they can afford
// or saves for the next tier if close.

console.log('--- STARTING SIMULATION ---');

const efficientBuildings = buildingsData.filter(b => b.stats.income).sort((a, b) => a.price - b.price);

while (state.credits < TARGET_CREDITS && state.timeElapsed < 2000000) { // Cap at ~550 hours to prevent inf loop
    // 1. Earn Income
    state.credits += state.incomeRate;
    state.timeElapsed++;

    // 2. Buy Logic (Every 10 seconds to simulate human reaction)
    if (state.timeElapsed % 10 === 0) {
        // Find best affordable building
        let bestBuy = null;
        for (let b of efficientBuildings) {
            // Price dynamic: Base * 1.5^count
            const count = state.inventory[b.id] || 0;
            const price = b.price * Math.pow(1.5, count);

            if (state.credits >= price) {
                // Heuristic: Don't buy if ROI is terrible (> 1 hour)?
                // For sim, just buy if affordable and better than nothing
                if (!bestBuy || price > bestBuy.price) { // Buy most expensive affordable (usually best)
                    bestBuy = { template: b, price: price };
                }
            }
        }

        if (bestBuy) {
            state.credits -= bestBuy.price;
            state.inventory[bestBuy.template.id] = (state.inventory[bestBuy.template.id] || 0) + 1;
            state.incomeRate += bestBuy.template.stats.income;
        }
    }

    // Logging
    if (state.timeElapsed % 3600 === 0) { // Every hour
        console.log(`Hour ${state.timeElapsed / 3600}: Credits ${state.credits.toExponential(2)}, Income ${state.incomeRate.toFixed(1)}/s`);
    }
}

const hours = state.timeElapsed / 3600;
console.log(`--- SIMULATION COMPLETE ---`);
console.log(`Time to T7: ${hours.toFixed(2)} hours`);
console.log(`Final Income: ${state.incomeRate.toFixed(1)}/s`);
