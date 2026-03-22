# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a 3D Labyrinth maze game and supporting API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **3D Game**: React Three Fiber, @react-three/drei

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (leaderboard API)
│   └── 3d-game/            # 3D Labyrinth maze game (React + Vite + R3F)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace config
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Game: Labyrinth (artifacts/3d-game)

3D endless maze game built with React Three Fiber. Player navigates procedurally generated mazes by pushing blocks to clear paths and reaching the exit before time runs out.

### Features
- Procedural maze generation (recursive backtracking algorithm)
- **Guaranteed solvable levels**: BFS pathfinding finds safe path from entrance to exit; hazards are never placed on the solution path
- Block pushing mechanics (push blue blocks to open paths)
- Countdown timer with time bonus on level completion
- Progressive difficulty: maze size grows, timer shrinks
- Obstacles introduced by level:
  - Level 2+: Moving walls (slide between positions, instant death on contact)
  - Level 3+: Spike tiles (instant death)
  - Level 4+: Patrol enemies (walk set paths)
  - Level 5+: Locked blocks (cannot be pushed)
  - Level 6+: Chaser enemies (pursue the player)
  - Level 7+: Teleporter tiles (warp to paired tile)
- Score tracking (levels completed + time survived)
- Leaderboard with persistent top scores (PostgreSQL)
- **Pause system**: Press ESC or P to pause; auto-saves progress to localStorage
- **Save & Resume**: Pausing auto-saves game state; "Continue" button appears on menu to resume saved games
- **Leaderboard links**: Accessible from menu screen, pause overlay references available
- Game screens: Menu, Playing (with HUD), Paused, Game Over (with score submission), Leaderboard

### Game Files
- `src/game/mazeGenerator.ts` — Procedural maze generation with solvability guarantee (BFS safe path)
- `src/game/useGameState.ts` — Core game state management, enemy spawning, pause/save/resume logic
- `src/game/GameScene.tsx` — 3D scene with camera, lighting, game loop
- `src/game/MazeRenderer.tsx` — 3D rendering of maze walls, floors, obstacles
- `src/game/Player.tsx` — Player character (animated box)
- `src/game/Enemies.tsx` — Enemy creatures (patrol and chaser types)
- `src/game/HUD.tsx` — In-game heads-up display (level, timer, score, pause button)
- `src/game/MenuScreen.tsx` — Start screen with instructions, resume/leaderboard buttons
- `src/game/GameOverScreen.tsx` — Game over with score submission and leaderboard
- `src/game/PauseScreen.tsx` — Pause overlay with resume and save & exit options
- `src/game/LeaderboardScreen.tsx` — Standalone leaderboard view
- `src/game/CyberBackground.tsx` — Animated cybernetic maze grid background

### Controls
- WASD / Arrow Keys — Move through the maze
- Push into blue blocks to move them
- ESC / P — Pause game (auto-saves progress)

## API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/leaderboard` — Get top 20 leaderboard entries
- `POST /api/leaderboard` — Submit a score (playerName, score, levelsCompleted)

## Database Schema

- `leaderboard` table: id, player_name, score, levels_completed, created_at

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: health check + leaderboard CRUD
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `artifacts/3d-game` (`@workspace/3d-game`)

React + Vite + React Three Fiber game. Served at root path `/`.

- Dependencies: three, @react-three/fiber, @react-three/drei
- Dev: `pnpm --filter @workspace/3d-game run dev`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/leaderboard.ts` — Leaderboard table definition
- Production migrations handled by Replit when publishing
- Dev: `pnpm --filter @workspace/db run push`

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval codegen config.

- Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package.
