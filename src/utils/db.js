/**
 * db.js
 * IndexedDB wrapper for persisting critical game data (Prestige, Unlocked Techs).
 */

const DB_NAME = 'neon_entropy_db';
const DB_VERSION = 1;
const STORE_NAME = 'prestige_store';

// Safe lazy initialization
const openDB = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject(new Error('IndexedDB not supported'));
            return;
        }

        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};

export const savePrestigeData = async (data) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: 'player_data', ...data });

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const loadPrestigeData = async () => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('player_data');

    return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || { neuroPoints: 0, unlockedUpgrades: [] });
        req.onerror = () => reject(req.error);
    });
};
