/**
 * PrestigeManager.js
 * Logic for "Neural Upload" (Prestige).
 */

export const UPGRADE_TREE = [
    {
        id: 'heat_opt_1',
        name: '열 분산 회로',
        cost: 10,
        description: '기본 발열 생성을 10% 감소시킵니다.',
        effect: { type: 'heat_reduction', value: 0.1 }
    },
    {
        id: 'grid_stab_1',
        name: '양자 그리드',
        cost: 25,
        description: '전력 효율을 20% 증가시킵니다.',
        effect: { type: 'power_efficiency', value: 0.2 }
    },
    {
        id: 'viral_ret_1',
        name: '바이럴 유지력',
        cost: 50,
        description: '광고 부스트 지속시간이 50% 증가합니다.',
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
