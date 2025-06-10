import React from 'react';
import { Plane } from '@react-three/drei';
import { WallDecoration } from './types';

interface DecorationComponentProps {
  decoration: WallDecoration & { fromLeftSide: number; fromFloor: number };
  wallSpec: {
    position: { x: number; y: number; z: number };
    rotation: [number, number, number];
    wallLength: number;
    wallThickness?: number;
    normal: { x: number; y: number; z: number };
  };
  wall: 'front' | 'back' | 'left' | 'right';
}

export default function DecorationComponent({ decoration, wallSpec, wall }: DecorationComponentProps) {
  // Calculate position relative to wall center
  const relativeX = decoration.fromLeftSide + (decoration.width / 2) - (wallSpec.wallLength / 2);
  const relativeY = decoration.fromFloor + (decoration.height / 2);

  // Wall thickness for realistic depth
  const offsetDistance = 0.01;

  // Calculate final position
  const finalPosition: [number, number, number] = [
    wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * offsetDistance,
    relativeY,
    wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * offsetDistance
  ];

  return (
    <Plane
      key={`decoration-plane-${decoration.id}`}
      position={finalPosition}
      rotation={wallSpec.rotation}
      args={[decoration.width, decoration.height]}
    >
      <meshStandardMaterial color={decoration.color || "#FFD700"} />
    </Plane>
  );
};