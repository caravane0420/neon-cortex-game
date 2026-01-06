export class Player {
    id: string;
    x: number;
    y: number;
    radius: number;
    color: string;
    speed: number;
    mass: number;
    targetX: number;
    targetY: number;
    inDuel: boolean;
    duelOpponent: string | null;

    constructor(id: string, x: number, y: number, color: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.mass = 20;
        this.radius = 20;
        this.color = color;
        this.inDuel = false;
        this.duelOpponent = null;
        this.speed = 5;
        this.targetX = x;
        this.targetY = y;
    }

    update() {
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const moveStep = Math.min(distance, this.speed);
            this.x += (dx / distance) * moveStep;
            this.y += (dy / distance) * moveStep;
        }
    }
}
