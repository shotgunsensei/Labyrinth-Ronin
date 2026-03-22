import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EnemyData } from './useGameState';

interface EnemiesProps {
  enemies: EnemyData[];
}

function EnemyMesh({ enemy }: { enemy: EnemyData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(enemy.x, 0.4, enemy.z));

  targetPos.current.set(enemy.x, 0.4, enemy.z);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, Math.min(delta * 8, 1));
      meshRef.current.rotation.y -= delta * 3;
    }
  });

  const color = enemy.type === 'patrol' ? '#e17055' : '#d63031';
  const emissiveColor = enemy.type === 'patrol' ? '#e17055' : '#d63031';

  return (
    <group>
      <mesh ref={meshRef} position={[enemy.x, 0.4, enemy.z]}>
        <dodecahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight
        position={[enemy.x, 1, enemy.z]}
        color={color}
        intensity={0.5}
        distance={3}
      />
    </group>
  );
}

export function Enemies({ enemies }: EnemiesProps) {
  return (
    <group>
      {enemies.map(enemy => (
        <EnemyMesh key={enemy.id} enemy={enemy} />
      ))}
    </group>
  );
}
