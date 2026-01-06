// Simple Procedural Audio System
// No external assets required.

let audioCtx = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (freq, type, duration, vol = 0.1) => {
    if (!audioCtx) initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

export const AudioSystem = {
    // UI Click (High, short blip)
    playClick: () => {
        playTone(1200, 'sine', 0.1, 0.05);
    },

    // Mirror Place/Rotate (Mechanical clack)
    playRotate: () => {
        playTone(300, 'square', 0.1, 0.05);
        setTimeout(() => playTone(600, 'triangle', 0.05, 0.02), 50);
    },

    // Laser hit target (Success chime)
    playTargetHit: () => {
        playTone(880, 'sine', 0.3, 0.1); // A5
        setTimeout(() => playTone(1108.73, 'sine', 0.4, 0.1), 100); // C#6
        setTimeout(() => playTone(1318.51, 'sine', 0.8, 0.1), 200); // E6
    },

    // Level Complete (Fanfare)
    playWin: () => {
        const now = audioCtx ? audioCtx.currentTime : 0;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'triangle', 0.5, 0.1), i * 150);
        });
    },

    // Error / Invalid move
    playError: () => {
        playTone(150, 'sawtooth', 0.3, 0.1);
    }
};
