/**
 * PrestigeManager.js
 * Logic for "Neural Upload" (Prestige).
 */

export const UPGRADE_TREE = [
    {
        id: 'heat_opt_1',
        name: 'Thermal Shunting',
        cost: 10,
        description: 'Reduces base heat generation by 10%.',
        effect: { type: 'heat_reduction', value: 0.1 }
    },
    {
        id: 'grid_stab_1',
        name: 'Quantum Grid',
        cost: 25,
        description: 'Increases power efficiency by 20%.',
        effect: { type: 'power_efficiency', value: 0.2 }
    },
    {
        id: 'viral_ret_1',
        name: 'Viral Retention',
        cost: 50,
        description: 'Ad bonuses remain active 50% longer (Persistent).',
        effect: { type: 'ad_duration', value: 0.5 }
    }
];

export class PrestigeManager {
    /**
     * Calculates Neuro-Points earnable upon reset.
     * Formula: Floor(Sqrt(Current Credits / 1000))
     */
    static calculatePendingNP(credits) {
        if (credits < 1000) return 0;
        return Math.floor(Math.sqrt(credits / 1000));
    }

    /**
     * Applies upgrades to building stats (called during engine tick or init).
     */
    static applyUpgradesToStats(baseStats, unlockedUpgradeIds) {
        const newStats = { ...baseStats };

        unlockedUpgradeIds.forEach(uId => {
            const upgrade = UPGRADE_TREE.find(u => u.id === uId);
            if (!upgrade) return;

            if (upgrade.effect.type === 'heat_reduction' && newStats.heat > 0) {
                newStats.heat *= (1 - upgrade.effect.value);
            }
            // Add other effect handlers here
        });

        return newStats;
    }
}
