// Directions: 0: Up, 1: Right, 2: Down, 3: Left
export const DIR = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];

export const TYPES = {
    EMPTY: 0,
    WALL: 1,
    SOURCE: 2,
    TARGET: 3,
    MIRROR_Slash: 4, // '/'
    MIRROR_BackSlash: 5, // '\'
};

// Calculate the full path of the beam
export function calculateBeamPath(grid, width, height) {
    let path = [];
    let startNode = null;

    // 1. Find Source
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y][x].type === TYPES.SOURCE) {
                startNode = { x, y, dir: grid[y][x].dir };
                break;
            }
        }
    }

    if (!startNode) return [];

    // 2. Trace Beam
    let beam = { ...startNode };
    // Push center of starting cell
    path.push({ x: beam.x, y: beam.y });

    let steps = 0;
    const MAX_STEPS = 100; // Prevent infinite loops

    while (steps < MAX_STEPS) {
        // Current Position (Center of cell)
        // Move to next cell boundary/center
        let nextX = beam.x + DX[beam.dir];
        let nextY = beam.y + DY[beam.dir];

        // Check Bounds
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
            // Hit edge of world
            path.push({ x: nextX, y: nextY, hit: 'bounds' }); // Visual endpoint
            break;
        }

        const cell = grid[nextY][nextX];

        // Check Collisions
        if (cell.type === TYPES.WALL) {
            path.push({ x: nextX, y: nextY, hit: 'wall' });
            break;
        } else if (cell.type === TYPES.TARGET) {
            path.push({ x: nextX, y: nextY, hit: 'target', lit: true });
            // Can pass through target? For now, let's say it stops or passes. Let's Stop.
            break;
        } else if (cell.type === TYPES.MIRROR_Slash) {
            // '/' reflection
            // Up(0) -> Right(1)
            // Right(1) -> Up(0)
            // Down(2) -> Left(3)
            // Left(3) -> Down(2)
            path.push({ x: nextX, y: nextY });
            if (beam.dir === 0) beam.dir = 1;
            else if (beam.dir === 1) beam.dir = 0;
            else if (beam.dir === 2) beam.dir = 3;
            else if (beam.dir === 3) beam.dir = 2;

            beam.x = nextX;
            beam.y = nextY;
        } else if (cell.type === TYPES.MIRROR_BackSlash) {
            // '\' reflection
            // Up(0) -> Left(3)
            // Left(3) -> Up(0)
            // Down(2) -> Right(1)
            // Right(1) -> Down(2)
            path.push({ x: nextX, y: nextY });
            if (beam.dir === 0) beam.dir = 3;
            else if (beam.dir === 3) beam.dir = 0;
            else if (beam.dir === 2) beam.dir = 1;
            else if (beam.dir === 1) beam.dir = 2;

            beam.x = nextX;
            beam.y = nextY;
        } else {
            // Empty or Source(weird), just move through
            beam.x = nextX;
            beam.y = nextY;
            // We only add points at turns to keep SVG simple, but for grid drawing we can just push end.
        }
        steps++;
    }

    // Optimize path for rendering: only keep start, turns, and end
    // Actually, keeping all cells is fine for 8x8.
    return path;
}
