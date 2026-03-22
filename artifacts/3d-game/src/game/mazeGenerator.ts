export type CellType = 'wall' | 'floor' | 'entrance' | 'exit' | 'pushable' | 'spike' | 'teleporter' | 'locked' | 'movingWall';

export interface MazeCell {
  type: CellType;
  teleportTarget?: { x: number; z: number };
}

export interface MovingWallData {
  id: number;
  positions: { x: number; z: number }[];
  currentIndex: number;
  speed: number;
  x: number;
  z: number;
}

export interface MazeData {
  grid: MazeCell[][];
  width: number;
  height: number;
  entrance: { x: number; z: number };
  exit: { x: number; z: number };
  movingWalls: MovingWallData[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMaze(level: number): MazeData {
  const baseSize = 7;
  const growthRate = 2;
  const rawSize = baseSize + Math.floor(level / 2) * growthRate;
  const size = rawSize % 2 === 0 ? rawSize + 1 : rawSize;
  const width = Math.min(size, 31);
  const height = Math.min(size, 31);

  const grid: MazeCell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ type: 'wall' as CellType }))
  );

  function carve(x: number, y: number) {
    grid[y][x].type = 'floor';
    const dirs = shuffle([
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ]);
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx].type === 'wall') {
        grid[y + dy / 2][x + dx / 2].type = 'floor';
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);

  const entrance = { x: 1, z: 1 };
  const exit = { x: width - 2, z: height - 2 };
  grid[entrance.z][entrance.x].type = 'entrance';
  grid[exit.z][exit.x].type = 'exit';

  addPushableBlocks(grid, width, height, level);

  let movingWalls: MovingWallData[] = [];

  if (level >= 2) {
    movingWalls = addMovingWalls(grid, width, height, level);
  }
  if (level >= 3) {
    addSpikes(grid, width, height, level);
  }
  if (level >= 5) {
    addLockedBlocks(grid, width, height, level);
  }
  if (level >= 7) {
    addTeleporters(grid, width, height, level);
  }

  return { grid, width, height, entrance, exit, movingWalls };
}

function getFloorCells(grid: MazeCell[][], width: number, height: number): { x: number; z: number }[] {
  const cells: { x: number; z: number }[] = [];
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      if (grid[z][x].type === 'floor') {
        cells.push({ x, z });
      }
    }
  }
  return cells;
}

function addPushableBlocks(grid: MazeCell[][], width: number, height: number, level: number) {
  const floors = getFloorCells(grid, width, height);
  const count = Math.min(Math.floor(level * 1.5) + 2, Math.floor(floors.length * 0.15));
  const shuffled = shuffle(floors);
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const { x, z } = shuffled[i];
    if (x > 2 && z > 2 && x < width - 3 && z < height - 3) {
      grid[z][x].type = 'pushable';
    }
  }
}

function addMovingWalls(grid: MazeCell[][], width: number, height: number, level: number): MovingWallData[] {
  const floors = getFloorCells(grid, width, height);
  const count = Math.min(Math.floor((level - 1) * 1.0) + 1, 5);
  const shuffled = shuffle(floors);
  const walls: MovingWallData[] = [];
  let id = 0;

  for (let i = 0; i < count && i < shuffled.length; i++) {
    const start = shuffled[i];
    if (start.x <= 2 || start.z <= 2 || start.x >= width - 3 || start.z >= height - 3) continue;

    const path = buildMovingWallPath(grid, start, width, height);
    if (path.length >= 2) {
      grid[start.z][start.x].type = 'movingWall';
      walls.push({
        id: id++,
        positions: path,
        currentIndex: 0,
        speed: 0.8 + level * 0.1,
        x: start.x,
        z: start.z,
      });
    }
  }

  return walls;
}

function buildMovingWallPath(
  grid: MazeCell[][],
  start: { x: number; z: number },
  width: number,
  height: number,
): { x: number; z: number }[] {
  const path = [start];
  const dirs = shuffle([
    { x: 1, z: 0 },
    { x: -1, z: 0 },
    { x: 0, z: 1 },
    { x: 0, z: -1 },
  ]);

  for (const dir of dirs) {
    let endX = start.x;
    let endZ = start.z;
    let steps = 0;
    while (steps < 3) {
      const nx = endX + dir.x;
      const nz = endZ + dir.z;
      if (nx < 1 || nx >= width - 1 || nz < 1 || nz >= height - 1) break;
      if (grid[nz][nx].type !== 'floor') break;
      endX = nx;
      endZ = nz;
      steps++;
    }
    if (steps >= 1) {
      path.push({ x: endX, z: endZ });
      break;
    }
  }

  return path;
}

function addSpikes(grid: MazeCell[][], width: number, height: number, level: number) {
  const floors = getFloorCells(grid, width, height);
  const count = Math.min(Math.floor((level - 2) * 1.2), Math.floor(floors.length * 0.08));
  const shuffled = shuffle(floors);
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const { x, z } = shuffled[i];
    grid[z][x].type = 'spike';
  }
}

function addLockedBlocks(grid: MazeCell[][], width: number, height: number, level: number) {
  const floors = getFloorCells(grid, width, height);
  const count = Math.min(Math.floor((level - 4) * 0.8), Math.floor(floors.length * 0.05));
  const shuffled = shuffle(floors);
  for (let i = 0; i < count && i < shuffled.length; i++) {
    const { x, z } = shuffled[i];
    if (x > 1 && z > 1 && x < width - 2 && z < height - 2) {
      grid[z][x].type = 'locked';
    }
  }
}

function addTeleporters(grid: MazeCell[][], width: number, height: number, level: number) {
  const floors = getFloorCells(grid, width, height);
  const pairCount = Math.min(Math.floor((level - 6) * 0.5) + 1, 3);
  const shuffled = shuffle(floors);
  let idx = 0;
  for (let p = 0; p < pairCount && idx + 1 < shuffled.length; p++) {
    const a = shuffled[idx++];
    const b = shuffled[idx++];
    grid[a.z][a.x] = { type: 'teleporter', teleportTarget: { x: b.x, z: b.z } };
    grid[b.z][b.x] = { type: 'teleporter', teleportTarget: { x: a.x, z: a.z } };
  }
}
