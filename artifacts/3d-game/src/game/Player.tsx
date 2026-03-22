import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  position: { x: number; z: number };
}

export function Player({ position }: PlayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(position.x, 0.4, position.z));

  targetPos.current.set(position.x, 0.4, position.z);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, Math.min(delta * 12, 1));
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, 0.4, position.z]}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#00cec9" emissive="#00cec9" emissiveIntensity={0.3} />
    </mesh>
  );
}
