import { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { MazeRenderer } from './MazeRenderer';
import { Player } from './Player';
import { Enemies } from './Enemies';
import type { GameState } from './useGameState';

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
}

const keyMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
];

interface GameLogicProps {
  state: GameState;
  movePlayer: (dx: number, dz: number) => void;
  updateTime: (delta: number) => void;
  updateEnemies: (delta: number, playerPos: { x: number; z: number }) => void;
  nextLevel: () => void;
}

function FollowCamera({ target }: { target: { x: number; z: number }; mazeWidth: number; mazeHeight: number }) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    targetVec.current.set(target.x, 8, target.z + 6);
    camera.position.lerp(targetVec.current, Math.min(delta * 3, 1));
    camera.lookAt(target.x, 0, target.z);
  });

  return null;
}

function GameLogic({ state, movePlayer, updateTime, updateEnemies, nextLevel }: GameLogicProps) {
  const [, getState] = useKeyboardControls<Controls>();
  const lastMoveTime = useRef(0);
  const moveInterval = 0.15;
  const isTransitioning = useRef(false);
  const lastExitKey = useRef('');

  useFrame((_, delta) => {
    if (state.phase !== 'playing') return;

    const currentExitKey = state.maze ? `${state.level}-${state.maze.exit.x}-${state.maze.exit.z}` : '';
    if (currentExitKey !== lastExitKey.current) {
      isTransitioning.current = false;
      lastExitKey.current = currentExitKey;
    }

    updateTime(delta);
    updateEnemies(delta, state.playerPos);

    lastMoveTime.current += delta;
    if (lastMoveTime.current >= moveInterval) {
      const controls = getState();
      let moved = false;
      if (controls.forward) { movePlayer(0, -1); moved = true; }
      else if (controls.back) { movePlayer(0, 1); moved = true; }
      else if (controls.left) { movePlayer(-1, 0); moved = true; }
      else if (controls.right) { movePlayer(1, 0); moved = true; }
      if (moved) lastMoveTime.current = 0;
    }

    if (state.maze && !isTransitioning.current) {
      const { exit } = state.maze;
      if (state.playerPos.x === exit.x && state.playerPos.z === exit.z) {
        isTransitioning.current = true;
        nextLevel();
      }
    }
  });

  return null;
}

interface GameSceneProps {
  state: GameState;
  movePlayer: (dx: number, dz: number) => void;
  updateTime: (delta: number) => void;
  updateEnemies: (delta: number, playerPos: { x: number; z: number }) => void;
  nextLevel: () => void;
}

export function GameScene({ state, movePlayer, updateTime, updateEnemies, nextLevel }: GameSceneProps) {
  if (!state.maze) return null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          camera={{ position: [state.maze.width / 2, 10, state.maze.height / 2 + 8], fov: 50 }}
          style={{ background: '#0a0a1a' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
          <pointLight position={[state.playerPos.x, 3, state.playerPos.z]} color="#00cec9" intensity={1} distance={6} />

          <fog attach="fog" args={['#0a0a1a', 8, 25]} />

          <MazeRenderer maze={state.maze} />
          <Player position={state.playerPos} />
          <Enemies enemies={state.enemies} />

          <FollowCamera
            target={state.playerPos}
            mazeWidth={state.maze.width}
            mazeHeight={state.maze.height}
          />

          <GameLogic
            state={state}
            movePlayer={movePlayer}
            updateTime={updateTime}
            updateEnemies={updateEnemies}
            nextLevel={nextLevel}
          />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
