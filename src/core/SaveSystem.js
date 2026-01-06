import { savePrestigeData, loadPrestigeData } from '../utils/db'; // Reuse existing DB wrapper if possible, or expand here.

// Schema Validator
const validateState = (state) => {
    if (!state) return false;
    if (typeof state.credits !== 'number' || isNaN(state.credits)) return false;
    if (!state.inventory || typeof state.inventory !== 'object') return false;
    return true;
};

const DB_NAME = 'NeonEntropyDB';
const STORE_NAME = 'GameState';

// IndexedDB Helper (Expanded)
const idbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version 2

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
});

export const SaveSystem = {
    save: async (gameState) => {
        if (!validateState(gameState)) {
            console.error('SaveSystem: Invalid State', gameState);
            return false;
        }

        const saveObject = {
            id: 'current_save',
            timestamp: Date.now(),
            data: gameState
        };

        // 1. LocalStorage (Synchronous Backup)
        try {
            localStorage.setItem('neon_entropy_save', JSON.stringify(gameState));
        } catch (e) {
            console.warn('LocalStorage Save Failed (Quota?)', e);
        }

        // 2. IndexedDB (Async Primary)
        try {
            const db = await idbPromise;
            const tx = db.transaction([STORE_NAME], 'readwrite');
            await tx.objectStore(STORE_NAME).put(saveObject);
            // console.log('SaveSystem: IDB Save Success');
            return true;
        } catch (e) {
            console.error('SaveSystem: IDB Save Failed', e);
            return false;
        }
    },

    load: async () => {
        // 1. Try IndexedDB
        try {
            const db = await idbPromise;
            const tx = db.transaction([STORE_NAME], 'readonly');
            const request = tx.objectStore(STORE_NAME).get('current_save');

            const result = await new Promise((resolve) => {
                request.onsuccess = () => resolve(request.result);
            });

            if (result && validateState(result.data)) {
                console.log('SaveSystem: Loaded from IDB');
                return result.data;
            }
        } catch (e) {
            console.warn('SaveSystem: IDB Load Failed, failing over to LS', e);
        }

        // 2. Failover to LocalStorage
        try {
            const lsData = localStorage.getItem('neon_entropy_save');
            if (lsData) {
                const parsed = JSON.parse(lsData);
                if (validateState(parsed)) {
                    console.log('SaveSystem: Loaded from LocalStorage');
                    return parsed;
                }
            }
        } catch (e) {
            console.error('SaveSystem: Load Failed completely', e);
        }

        return null;
    },

    // Placeholder for Cloud Sync
    syncToCloud: async (token) => {
        console.log('Cloud Sync not implemented yet.');
        return false;
    }
};
