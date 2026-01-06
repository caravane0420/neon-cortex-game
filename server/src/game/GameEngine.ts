import { Server, Socket } from 'socket.io';
import { Player } from './Player';

export class GameEngine {
    io: Server;
    players: Map<string, Player>;
    lastUpdate: number;
    orbs: { x: number, y: number, id: string, color: string }[];
    activeDuels: Map<string, { p1: string, p2: string, word: string, startTime: number }>;

    constructor(io: Server) {
        this.io = io;
        this.players = new Map();
        this.orbs = [];
        this.activeDuels = new Map();
        this.lastUpdate = Date.now();
        this.spawnOrbs(50);
    }

    start() {
        setInterval(() => this.update(), 1000 / 60); // 60 Hz
    }

    spawnOrbs(count: number) {
        for (let i = 0; i < count; i++) {
            this.orbs.push({
                id: Math.random().toString(36).substr(2, 9),
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                color: '#FFFFFF' // White data orbs
            });
        }
    }

    addPlayer(socket: Socket) {
        // Random spawn
        const x = Math.random() * 2000;
        const y = Math.random() * 2000;
        // Random neon color
        const colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF0000'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const player = new Player(socket.id, x, y, color);
        this.players.set(socket.id, player);

        socket.emit('init', {
            id: socket.id,
            players: Array.from(this.players.values()),
            orbs: this.orbs
        });
    }

    removePlayer(socketId: string) {
        this.players.delete(socketId);
        this.io.emit('playerDisc', socketId);
    }

    handleInput(socketId: string, data: { x: number, y: number }) {
        const player = this.players.get(socketId);
        if (player) {
            player.targetX = data.x;
            player.targetY = data.y;
        }
    }

    startDuel(p1Id: string, p2Id: string) {
        const p1 = this.players.get(p1Id);
        const p2 = this.players.get(p2Id);
        if (!p1 || !p2) return;

        p1.inDuel = true;
        p2.inDuel = true;
        p1.duelOpponent = p2Id;
        p2.duelOpponent = p1Id;

        const words = ["NEON", "CORTEX", "SYNAPSE", "CYBER", "MATRIX", "PROTOCOL", "SYSTEM", "DATA", "NODE", "FLUX"];
        const word = words[Math.floor(Math.random() * words.length)];
        const duelId = `${p1Id}-${p2Id}`;

        this.activeDuels.set(duelId, { p1: p1Id, p2: p2Id, word, startTime: Date.now() });

        this.io.to(p1Id).emit('duel-start', { opponent: p2Id, word });
        this.io.to(p2Id).emit('duel-start', { opponent: p1Id, word });
    }

    handleDuelInput(socketId: string, inputWord: string) {
        const player = this.players.get(socketId);
        if (!player || !player.inDuel || !player.duelOpponent) return;

        // Find duel
        let duelId = `${socketId}-${player.duelOpponent}`;
        if (!this.activeDuels.has(duelId)) {
            duelId = `${player.duelOpponent}-${socketId}`;
        }

        const duel = this.activeDuels.get(duelId);
        if (!duel) return;

        if (inputWord.toUpperCase() === duel.word) {
            // WINNER
            this.endDuel(socketId, player.duelOpponent);
        }
    }

    endDuel(winnerId: string, loserId: string) {
        const winner = this.players.get(winnerId);
        const loser = this.players.get(loserId);

        // Cleanup duel state
        let duelId = `${winnerId}-${loserId}`;
        if (!this.activeDuels.has(duelId)) duelId = `${loserId}-${winnerId}`;
        this.activeDuels.delete(duelId);

        if (winner && loser) {
            winner.inDuel = false;
            winner.duelOpponent = null;
            loser.inDuel = false;
            loser.duelOpponent = null;

            // Mass transfer
            const steal = loser.mass * 0.3; // Steal 30%
            winner.mass += steal;
            loser.mass -= steal;
            if (loser.mass < 10) loser.mass = 10;

            // Recalculate radius
            winner.radius = 20 + Math.sqrt(winner.mass) * 2;
            loser.radius = 20 + Math.sqrt(loser.mass) * 2;

            // Knockback
            const dx = loser.x - winner.x;
            const dy = loser.y - winner.y;
            const angle = Math.atan2(dy, dx);
            const kick = 100;
            loser.x += Math.cos(angle) * kick;
            loser.y += Math.sin(angle) * kick;

            this.io.to(winnerId).emit('duel-end', { result: 'win', mass: winner.mass });
            this.io.to(loserId).emit('duel-end', { result: 'lose', mass: loser.mass });
        }
    }

    update() {
        const now = Date.now();
        // const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        // Update physics
        this.players.forEach(player => player.update());

        // Check Collisions
        this.checkCollisions();

        // Broadcast state
        this.io.emit('state', {
            players: Array.from(this.players.values()),
            orbs: this.orbs
        });
    }

    checkCollisions() {
        // Player vs Orb
        this.players.forEach(player => {
            if (player.inDuel) return; // No eating while in duel
            for (let i = this.orbs.length - 1; i >= 0; i--) {
                const orb = this.orbs[i];
                const dx = player.x - orb.x;
                const dy = player.y - orb.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < player.radius + 5) {
                    player.mass += 1;
                    player.radius = 20 + Math.sqrt(player.mass) * 2;
                    this.orbs.splice(i, 1);
                    this.spawnOrbs(1);
                }
            }
        });

        // Player vs Player (Duel Trigger)
        const playerArray = Array.from(this.players.values());
        for (let i = 0; i < playerArray.length; i++) {
            for (let j = i + 1; j < playerArray.length; j++) {
                const p1 = playerArray[i];
                const p2 = playerArray[j];

                if (p1.inDuel || p2.inDuel) continue; // Already busy

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < p1.radius + p2.radius) {
                    this.startDuel(p1.id, p2.id);
                }
            }
        }
    }
}
