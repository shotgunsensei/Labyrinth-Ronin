import { useState, useCallback, useRef } from 'react';
import { generateMaze, type MazeData, type CellType, type MovingWallData } from './mazeGenerator';

export interface EnemyData {
  id: number;
  x: number;
  z: number;
  type: 'patrol' | 'chaser';
  patrolPath?: { x: number; z: number }[];
  patrolIndex?: number;
  speed: number;
}

export interface GameState {
  phase: 'menu' | 'playing' | 'gameover';
  level: number;
  score: number;
  timeLeft: number;
  playerPos: { x: number; z: number };
  maze: MazeData | null;
  enemies: EnemyData[];
  totalTimeSurvived: number;
}

function spawnEnemies(maze: MazeData, level: number): EnemyData[] {
  if (level < 4) return [];
  const enemies: EnemyData[] = [];
  const floors: { x: number; z: number }[] = [];
  for (let z = 0; z < maze.height; z++) {
    for (let x = 0; x < maze.width; x++) {
      if (maze.grid[z][x].type === 'floor' && (x > 3 || z > 3)) {
        floors.push({ x, z });
      }
    }
  }

  const patrolCount = Math.min(Math.floor((level - 3) * 0.8), 4);
  const chaserCount = level >= 6 ? Math.min(Math.floor((level - 5) * 0.5), 3) : 0;

  const shuffled = floors.sort(() => Math.random() - 0.5);
  let idx = 0;
  let id = 0;

  for (let i = 0; i < patrolCount && idx < shuffled.length; i++) {
    const start = shuffled[idx++];
    const path = buildPatrolPath(maze, start, 4);
    if (path.length >= 2) {
      enemies.push({
        id: id++,
        x: start.x,
        z: start.z,
        type: 'patrol',
        patrolPath: path,
        patrolIndex: 0,
        speed: 1.5 + level * 0.1,
      });
    }
  }

  for (let i = 0; i < chaserCount && idx < shuffled.length; i++) {
    const start = shuffled[idx++];
    enemies.push({
      id: id++,
      x: start.x,
      z: start.z,
      type: 'chaser',
      speed: 1.2 + level * 0.08,
    });
  }

  return enemies;
}

function buildPatrolPath(maze: MazeData, start: { x: number; z: number }, length: number): { x: number; z: number }[] {
  const path = [start];
  let current = start;
  const visited = new Set<string>();
  visited.add(`${start.x},${start.z}`);

  for (let i = 0; i < length; i++) {
    const dirs = [
      { x: 0, z: -1 },
      { x: 0, z: 1 },
      { x: -1, z: 0 },
      { x: 1, z: 0 },
    ];
    const candidates = dirs.filter(d => {
      const nx = current.x + d.x;
      const nz = current.z + d.z;
      const key = `${nx},${nz}`;
      return (
        nx >= 0 && nx < maze.width && nz >= 0 && nz < maze.height &&
        !visited.has(key) &&
        (maze.grid[nz][nx].type === 'floor' || maze.grid[nz][nx].type === 'spike')
      );
    });
    if (candidates.length === 0) break;
    const dir = candidates[Math.floor(Math.random() * candidates.length)];
    const next = { x: current.x + dir.x, z: current.z + dir.z };
    path.push(next);
    visited.add(`${next.x},${next.z}`);
    current = next;
  }
  return path;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: 'menu',
    level: 1,
    score: 0,
    timeLeft: 60,
    playerPos: { x: 1, z: 1 },
    maze: null,
    enemies: [],
    totalTimeSurvived: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const startGame = useCallback(() => {
    const maze = generateMaze(1);
    const enemies = spawnEnemies(maze, 1);
    setState({
      phase: 'playing',
      level: 1,
      score: 0,
      timeLeft: 60,
      playerPos: { x: maze.entrance.x, z: maze.entrance.z },
      maze,
      enemies,
      totalTimeSurvived: 0,
    });
  }, []);

  const nextLevel = useCallback(() => {
    setState(prev => {
      const newLevel = prev.level + 1;
      const maze = generateMaze(newLevel);
      const enemies = spawnEnemies(maze, newLevel);
      const timeBonus = Math.max(60 - newLevel * 2, 20);
      return {
        ...prev,
        phase: 'playing',
        level: newLevel,
        score: prev.score + prev.level * 100 + Math.floor(prev.timeLeft) * 10,
        timeLeft: prev.timeLeft + timeBonus,
        playerPos: { x: maze.entrance.x, z: maze.entrance.z },
        maze,
        enemies,
      };
    });
  }, []);

  const gameOver = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'gameover',
      score: prev.score + prev.level * 50 + Math.floor(prev.totalTimeSurvived),
    }));
  }, []);

  const movePlayer = useCallback((dx: number, dz: number) => {
    setState(prev => {
      if (!prev.maze || prev.phase !== 'playing') return prev;
      const nx = prev.playerPos.x + dx;
      const nz = prev.playerPos.z + dz;

      if (nx < 0 || nx >= prev.maze.width || nz < 0 || nz >= prev.maze.height) return prev;

      const targetCell = prev.maze.grid[nz][nx];

      if (targetCell.type === 'wall' || targetCell.type === 'locked') return prev;

      const movingWallBlocking = prev.maze.movingWalls.some(
        mw => Math.round(mw.x) === nx && Math.round(mw.z) === nz
      );
      if (movingWallBlocking) return prev;

      if (targetCell.type === 'pushable') {
        const pushX = nx + dx;
        const pushZ = nz + dz;
        if (
          pushX < 0 || pushX >= prev.maze.width ||
          pushZ < 0 || pushZ >= prev.maze.height
        ) return prev;
        const behindCell = prev.maze.grid[pushZ][pushX];
        if (behindCell.type !== 'floor' && behindCell.type !== 'spike') return prev;

        const newGrid = prev.maze.grid.map(row => row.map(cell => ({ ...cell })));
        newGrid[nz][nx] = { type: 'floor' as CellType };
        newGrid[pushZ][pushX] = { type: 'pushable' as CellType };

        return {
          ...prev,
          playerPos: { x: nx, z: nz },
          maze: { ...prev.maze, grid: newGrid },
        };
      }

      if (targetCell.type === 'spike') {
        return { ...prev, phase: 'gameover' as const, score: prev.score + prev.level * 50 + Math.floor(prev.totalTimeSurvived) };
      }

      if (targetCell.type === 'teleporter' && targetCell.teleportTarget) {
        return {
          ...prev,
          playerPos: { x: targetCell.teleportTarget.x, z: targetCell.teleportTarget.z },
        };
      }

      return {
        ...prev,
        playerPos: { x: nx, z: nz },
      };
    });
  }, []);

  const updateTime = useCallback((delta: number) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const newTime = prev.timeLeft - delta;
      if (newTime <= 0) {
        return {
          ...prev,
          timeLeft: 0,
          phase: 'gameover' as const,
          score: prev.score + prev.level * 50 + Math.floor(prev.totalTimeSurvived),
        };
      }
      return { ...prev, timeLeft: newTime, totalTimeSurvived: prev.totalTimeSurvived + delta };
    });
  }, []);

  const updateMovingWalls = useCallback((delta: number, playerPos: { x: number; z: number }) => {
    setState(prev => {
      if (prev.phase !== 'playing' || !prev.maze || prev.maze.movingWalls.length === 0) return prev;

      let playerHitWall = false;

      const newMovingWalls = prev.maze.movingWalls.map(mw => {
        const target = mw.positions[mw.currentIndex];
        const edx = target.x - mw.x;
        const edz = target.z - mw.z;
        const dist = Math.sqrt(edx * edx + edz * edz);

        let newX = mw.x;
        let newZ = mw.z;
        let newIndex = mw.currentIndex;

        if (dist < 0.05) {
          newIndex = (mw.currentIndex + 1) % mw.positions.length;
          newX = target.x;
          newZ = target.z;
        } else {
          const moveAmt = Math.min(mw.speed * delta, dist);
          newX = mw.x + (edx / dist) * moveAmt;
          newZ = mw.z + (edz / dist) * moveAmt;
        }

        const dx = newX - playerPos.x;
        const dz = newZ - playerPos.z;
        if (Math.sqrt(dx * dx + dz * dz) < 0.6) {
          playerHitWall = true;
        }

        return { ...mw, x: newX, z: newZ, currentIndex: newIndex };
      });

      if (playerHitWall) {
        return {
          ...prev,
          maze: { ...prev.maze, movingWalls: newMovingWalls },
          phase: 'gameover' as const,
          score: prev.score + prev.level * 50 + Math.floor(prev.totalTimeSurvived),
        };
      }

      return { ...prev, maze: { ...prev.maze, movingWalls: newMovingWalls } };
    });
  }, []);

  const updateEnemies = useCallback((delta: number, playerPos: { x: number; z: number }) => {
    setState(prev => {
      if (prev.phase !== 'playing' || !prev.maze) return prev;

      const newEnemies = prev.enemies.map(enemy => {
        if (enemy.type === 'patrol' && enemy.patrolPath && enemy.patrolPath.length > 0) {
          const target = enemy.patrolPath[enemy.patrolIndex! % enemy.patrolPath.length];
          const edx = target.x - enemy.x;
          const edz = target.z - enemy.z;
          const dist = Math.sqrt(edx * edx + edz * edz);
          if (dist < 0.1) {
            return { ...enemy, patrolIndex: (enemy.patrolIndex! + 1) % enemy.patrolPath.length };
          }
          const moveAmount = Math.min(enemy.speed * delta, dist);
          return {
            ...enemy,
            x: enemy.x + (edx / dist) * moveAmount,
            z: enemy.z + (edz / dist) * moveAmount,
          };
        }

        if (enemy.type === 'chaser') {
          const edx = playerPos.x - enemy.x;
          const edz = playerPos.z - enemy.z;
          const dist = Math.sqrt(edx * edx + edz * edz);
          if (dist > 8) return enemy;
          if (dist < 0.1) return enemy;
          const moveAmount = Math.min(enemy.speed * delta, dist);
          const nx = enemy.x + (edx / dist) * moveAmount;
          const nz = enemy.z + (edz / dist) * moveAmount;
          const gx = Math.round(nx);
          const gz = Math.round(nz);
          if (gx >= 0 && gx < prev.maze!.width && gz >= 0 && gz < prev.maze!.height) {
            const cell = prev.maze!.grid[gz][gx];
            if (cell.type === 'wall' || cell.type === 'locked' || cell.type === 'pushable') {
              return enemy;
            }
          }
          return { ...enemy, x: nx, z: nz };
        }

        return enemy;
      });

      const playerHit = newEnemies.some(e => {
        const dx = e.x - playerPos.x;
        const dz = e.z - playerPos.z;
        return Math.sqrt(dx * dx + dz * dz) < 0.6;
      });

      if (playerHit) {
        return {
          ...prev,
          enemies: newEnemies,
          phase: 'gameover' as const,
          score: prev.score + prev.level * 50 + Math.floor(prev.totalTimeSurvived),
        };
      }

      return { ...prev, enemies: newEnemies };
    });
  }, []);

  const returnToMenu = useCallback(() => {
    setState({
      phase: 'menu',
      level: 1,
      score: 0,
      timeLeft: 60,
      playerPos: { x: 1, z: 1 },
      maze: null,
      enemies: [],
      totalTimeSurvived: 0,
    });
  }, []);

  return {
    state,
    stateRef,
    startGame,
    nextLevel,
    gameOver,
    movePlayer,
    updateTime,
    updateMovingWalls,
    updateEnemies,
    returnToMenu,
  };
}
