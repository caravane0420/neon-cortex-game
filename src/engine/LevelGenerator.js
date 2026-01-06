import { TYPES, DIR, DX, DY } from './BeamSystem';

export function generateLevel(seed, difficulty) {
    // Simple seeded random
    let s = seed;
    const random = () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };

    const WIDTH = 8;
    const HEIGHT = 8;
    let grid = Array(HEIGHT).fill().map(() => Array(WIDTH).fill().map(() => ({ type: TYPES.EMPTY })));

    // Difficulty settings
    const mirrorCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

    // 1. Place Source Randomly on Edge
    const startX = Math.floor(random() * WIDTH);
    const startY = Math.floor(random() * HEIGHT);
    const startDir = Math.floor(random() * 4); // Random direction

    grid[startY][startX] = { type: TYPES.SOURCE, dir: startDir, fixed: true };

    // 2. Walk the path
    let cx = startX;
    let cy = startY;
    let cdir = startDir;
    let mirrorsUsed = 0;

    let attempts = 0;
    while (mirrorsUsed < mirrorCount && attempts < 100) {
        attempts++;
        // Move some distance
        let dist = Math.floor(random() * 3) + 1;

        for (let i = 0; i < dist; i++) {
            cx += DX[cdir];
            cy += DY[cdir];
            if (cx < 0 || cx >= WIDTH || cy < 0 || cy >= HEIGHT) {
                // Hit wall, clamp and turn back/finish
                cx -= DX[cdir];
                cy -= DY[cdir];
                break;
            }
        }

        if (cx < 0 || cx >= WIDTH || cy < 0 || cy >= HEIGHT) continue;
        if (grid[cy][cx].type !== TYPES.EMPTY) continue;

        // Place a mirror here to turn
        const mirrorType = random() > 0.5 ? TYPES.MIRROR_Slash : TYPES.MIRROR_BackSlash;

        // Determine new direction based on mirror
        // Simulate turn to see valid direction
        let newDir = cdir;
        if (mirrorType === TYPES.MIRROR_Slash) {
            if (cdir === 0) newDir = 1;
            else if (cdir === 1) newDir = 0;
            else if (cdir === 2) newDir = 3;
            else if (cdir === 3) newDir = 2;
        } else {
            if (cdir === 0) newDir = 3;
            else if (cdir === 3) newDir = 0;
            else if (cdir === 2) newDir = 1;
            else if (cdir === 1) newDir = 2;
        }

        // "Reserve" this spot for the player (Empty in actual level)
        grid[cy][cx] = { type: TYPES.EMPTY, reserved: true, correctMirror: mirrorType };
        cdir = newDir;
        mirrorsUsed++;
    }

    // 3. Place Target at end
    // Ensure we are not on top of source
    if (grid[cy][cx].type === TYPES.EMPTY) {
        grid[cy][cx] = { type: TYPES.TARGET, fixed: true };
    } else {
        // Find nearest empty
        // Fallback: Just place target somewhere far
        grid[HEIGHT - 1][WIDTH - 1] = { type: TYPES.TARGET, fixed: true };
    }

    // 4. Fill some random spots with Walls to make it tricky (but check path!)
    // Simplification: No walls for now, just focused on mirrors.

    // 5. Generate Inventory
    // Give player the exact mirrors needed (maybe +1 distractor in Hard)
    const inventory = {
        [TYPES.MIRROR_Slash]: 0,
        [TYPES.MIRROR_BackSlash]: 0
    };

    // Count reserved mirrors
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (grid[y][x].reserved) {
                inventory[grid[y][x].correctMirror]++;
                // Clean up hint from grid
                delete grid[y][x].reserved;
                delete grid[y][x].correctMirror;
            }
        }
    }

    return { grid, inventory, width: WIDTH, height: HEIGHT };
}
