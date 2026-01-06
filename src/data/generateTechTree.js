import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for 48h playtime
// Assuming exponential growth factor of 1.4 per major node
// Total Nodes: 500
const CONFIG = {
    TOTAL_NODES: 500,
    TIERS: 7,
    BASE_COST: 1000, // Credits
    COST_MULTIPLIER: 1.15 // Gentle curve for 500 steps, but tiers jump significantly
};

const CATEGORIES = ['EFFICIENCY', 'UNLOCK', 'QUALITY', 'OVERCLOCK'];

const techTree = [];

for (let i = 0; i < CONFIG.TOTAL_NODES; i++) {
    const tier = Math.floor((i / CONFIG.TOTAL_NODES) * CONFIG.TIERS) + 1;

    // Cost Logic: 
    // Base * (Multiplier ^ i)
    // T1 end (i=70): 1000 * 1.15^70 ~= 17 million? Too high.
    // Let's use tiered scaling with local Reset.

    // Better Logic:
    // Cost = Base * (Tier^4) * (1.05 ^ (i % nodes_per_tier))
    const nodesPerTier = Math.floor(CONFIG.TOTAL_NODES / CONFIG.TIERS);
    const tierProgress = i % nodesPerTier;

    let cost = CONFIG.BASE_COST * Math.pow(10, tier - 1) * Math.pow(1.02, tierProgress);
    cost = Math.floor(cost);

    const node = {
        id: `tech_${i}`,
        name: `Tech Node ${i}`,
        tier: tier,
        cost: cost,
        category: CATEGORIES[i % CATEGORIES.length],
        description: `Improves system parameters for Tier ${tier}.`,
        requirements: i > 0 ? [`tech_${i - 1}`] : [],
        effects: {}
    };

    // Specific Effects based on index
    if (i % 20 === 0) {
        node.name = `Tier ${tier} Breakthrough`;
        node.effects = { type: 'unlock_tier', value: tier };
        node.cost *= 5; // Boss node
    } else {
        node.effects = {
            type: 'passive_boost',
            stat: ['heat_reduction', 'production_speed', 'cost_reduction'][i % 3],
            value: 0.01 * tier // 1% * Tier
        };
    }

    techTree.push(node);
}

const outputPath = path.join(__dirname, 'techTree.json');
fs.writeFileSync(outputPath, JSON.stringify(techTree, null, 2));

console.log(`Generated ${techTree.length} tech nodes at ${outputPath}`);
console.log(`Final Node Cost: ${techTree[techTree.length - 1].cost.toExponential(2)}`);
