import { useMemo } from 'react';
import * as THREE from 'three';
import type { MazeData } from './mazeGenerator';

interface MazeRendererProps {
  maze: MazeData;
}

export function MazeRenderer({ maze }: MazeRendererProps) {
  const { walls, floors, entranceTile, exitTile, spikes, pushables, locked, teleporters } = useMemo(() => {
    const walls: { x: number; z: number }[] = [];
    const floors: { x: number; z: number }[] = [];
    const spikes: { x: number; z: number }[] = [];
    const pushables: { x: number; z: number }[] = [];
    const locked: { x: number; z: number }[] = [];
    const teleporters: { x: number; z: number }[] = [];
    let entranceTile = { x: 0, z: 0 };
    let exitTile = { x: 0, z: 0 };

    for (let z = 0; z < maze.height; z++) {
      for (let x = 0; x < maze.width; x++) {
        const cell = maze.grid[z][x];
        switch (cell.type) {
          case 'wall':
            walls.push({ x, z });
            break;
          case 'floor':
            floors.push({ x, z });
            break;
          case 'entrance':
            entranceTile = { x, z };
            floors.push({ x, z });
            break;
          case 'exit':
            exitTile = { x, z };
            break;
          case 'spike':
            spikes.push({ x, z });
            break;
          case 'pushable':
            pushables.push({ x, z });
            floors.push({ x, z });
            break;
          case 'locked':
            locked.push({ x, z });
            break;
          case 'teleporter':
            teleporters.push({ x, z });
            floors.push({ x, z });
            break;
        }
      }
    }

    return { walls, floors, entranceTile, exitTile, spikes, pushables, locked, teleporters };
  }, [maze]);

  const wallGeometry = useMemo(() => new THREE.BoxGeometry(1, 1.5, 1), []);
  const floorGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.1, 1), []);
  const blockGeometry = useMemo(() => new THREE.BoxGeometry(0.9, 0.9, 0.9), []);

  return (
    <group>
      <mesh position={[maze.width / 2 - 0.5, -0.1, maze.height / 2 - 0.5]}>
        <boxGeometry args={[maze.width + 2, 0.1, maze.height + 2]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {walls.map((w, i) => (
        <mesh key={`wall-${i}`} position={[w.x, 0.75, w.z]} geometry={wallGeometry}>
          <meshStandardMaterial color="#2d2d44" />
        </mesh>
      ))}

      {floors.map((f, i) => (
        <mesh key={`floor-${i}`} position={[f.x, 0, f.z]} geometry={floorGeometry}>
          <meshStandardMaterial color="#16213e" />
        </mesh>
      ))}

      <mesh position={[entranceTile.x, 0.01, entranceTile.z]}>
        <boxGeometry args={[1, 0.12, 1]} />
        <meshStandardMaterial color="#00b894" emissive="#00b894" emissiveIntensity={0.3} />
      </mesh>

      <group position={[exitTile.x, 0, exitTile.z]}>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[1, 0.12, 1]} />
          <meshStandardMaterial color="#fdcb6e" emissive="#fdcb6e" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#fdcb6e" intensity={2} distance={4} />
      </group>

      {spikes.map((s, i) => (
        <group key={`spike-${i}`} position={[s.x, 0, s.z]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[1, 0.12, 1]} />
            <meshStandardMaterial color="#e17055" />
          </mesh>
          {[[-0.2, -0.2], [0.2, -0.2], [0, 0.2], [-0.2, 0.2], [0.2, 0.2]].map(([ox, oz], j) => (
            <mesh key={j} position={[ox, 0.25, oz]}>
              <coneGeometry args={[0.08, 0.4, 4]} />
              <meshStandardMaterial color="#d63031" emissive="#d63031" emissiveIntensity={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {pushables.map((p, i) => (
        <mesh key={`push-${i}`} position={[p.x, 0.45, p.z]} geometry={blockGeometry}>
          <meshStandardMaterial color="#74b9ff" />
        </mesh>
      ))}

      {locked.map((l, i) => (
        <mesh key={`locked-${i}`} position={[l.x, 0.45, l.z]} geometry={blockGeometry}>
          <meshStandardMaterial color="#636e72" />
        </mesh>
      ))}

      {teleporters.map((t, i) => (
        <group key={`tele-${i}`} position={[t.x, 0, t.z]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[1, 0.12, 1]} />
            <meshStandardMaterial color="#a29bfe" emissive="#6c5ce7" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.3, 0.05, 8, 16]} />
            <meshStandardMaterial color="#6c5ce7" emissive="#6c5ce7" emissiveIntensity={0.8} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
