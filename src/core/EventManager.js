/**
 * EventManager.js
 * Handles random gameplay events that provide temporary buffs or debuffs.
 */

export const EVENTS = [
    {
        id: 'grid_overload',
        name: 'Neon Grid Overload',
        description: 'Power consumption doubled, but production speed +50%.',
        duration: 60, // seconds
        effect: { type: 'overload', powerMult: 2, speedMult: 1.5 },
        color: '#ff00ff'
    },
    {
        id: 'logistics_boom',
        name: 'Logistics Boom',
        description: 'Cargo value tripled for specific sectors.',
        duration: 45,
        effect: { type: 'value_boom', valueMult: 3 },
        color: '#faff00'
    },
    {
        id: 'thermal_leak',
        name: 'Thermal Leak',
        description: 'Heat generation increased by 30% globally.',
        duration: 30,
        effect: { type: 'heat_surge', heatMult: 1.3 },
        color: '#ff4d4d'
    }
];

export class EventManager {
    constructor() {
        this.activeEvents = [];
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => this.listeners = this.listeners.filter(l => l !== callback);
    }

    notify() {
        this.listeners.forEach(cb => cb(this.activeEvents));
    }

    triggerRandomEvent() {
        // 30% chance to trigger nothing if called frequently, 
        // but here we assume it's called on a long timer so we force one.
        const eventTemplate = EVENTS[Math.floor(Math.random() * EVENTS.length)];

        const newEvent = {
            ...eventTemplate,
            startTime: Date.now(),
            endTime: Date.now() + (eventTemplate.duration * 1000)
        };

        // Remove existing event of same type to extend/replace
        this.activeEvents = this.activeEvents.filter(e => e.id !== newEvent.id);
        this.activeEvents.push(newEvent);

        this.notify();
        return newEvent;
    }

    update() {
        const now = Date.now();
        const initialCount = this.activeEvents.length;
        this.activeEvents = this.activeEvents.filter(e => e.endTime > now);

        if (this.activeEvents.length !== initialCount) {
            this.notify();
        }
    }

    getActiveEffects() {
        return this.activeEvents.map(e => e.effect);
    }
}

// Singleton instance
export const eventManager = new EventManager();
