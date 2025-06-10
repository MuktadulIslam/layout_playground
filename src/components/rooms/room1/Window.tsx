import React from 'react';
import { Plane } from '@react-three/drei';
import { WallType, Window } from './types';

interface WindowComponentProps {
  window: Window & { fromLeftSide: number; fromFloor: number };
  wallSpec: {
    position: { x: number; y: number; z: number };
    rotation: [number, number, number];
    wallLength: number;
    wallThickness?: number;
    normal: { x: number; y: number; z: number };
  };
  wall: WallType;
}

export default function WindowComponent({ window, wallSpec, wall }: WindowComponentProps) {
  // Calculate position relative to wall center
  const relativeX = window.fromLeftSide + (window.width / 2) - (wallSpec.wallLength / 2);
  const relativeY = window.fromFloor + (window.height / 2);

  const frameThickness = window.frameThickness || 0.1;
  const frameColor = window.frameColor || "#2C3E50";
  const frameOffsetDistance = 0.03;
  const glassOffsetDistance = 0.025;

  return (
    <group key={`realistic-window-group-${window.id}`}>
      {/* Main window glass with realistic material */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * glassOffsetDistance,
          relativeY,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * glassOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[window.width - frameThickness * 0.5, window.height - frameThickness * 0.5]}
      >
        <meshPhysicalMaterial
          color={window.color || "#E8F4FD"}
          transparent
          opacity={0.15}
          transmission={0.95}
          thickness={0.01}
          roughness={0.05}
          metalness={0}
          reflectivity={0.9}
          ior={1.5}
        />
      </Plane>

      {/* Window frame - thicker outer frame */}
      {/* Top frame */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * frameOffsetDistance,
          relativeY + window.height / 2 + frameThickness / 2,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * frameOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[window.width + frameThickness * 2, frameThickness]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Bottom frame */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * frameOffsetDistance,
          relativeY - window.height / 2 - frameThickness / 2,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * frameOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[window.width + frameThickness * 2, frameThickness]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Left frame */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX - window.width / 2 - frameThickness / 2) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * frameOffsetDistance,
          relativeY,
          wallSpec.position.z + (relativeX - window.width / 2 - frameThickness / 2) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * frameOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[frameThickness, window.height]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Right frame */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX + window.width / 2 + frameThickness / 2) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * frameOffsetDistance,
          relativeY,
          wallSpec.position.z + (relativeX + window.width / 2 + frameThickness / 2) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * frameOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[frameThickness, window.height]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Window mullions (cross dividers) for realistic look */}
      {/* Vertical mullion (center divider) */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (frameOffsetDistance + 0.001),
          relativeY,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (frameOffsetDistance + 0.001)
        ]}
        rotation={wallSpec.rotation}
        args={[frameThickness * 0.4, window.height]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Horizontal mullion (center divider) */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (frameOffsetDistance + 0.001),
          relativeY,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (frameOffsetDistance + 0.001)
        ]}
        rotation={wallSpec.rotation}
        args={[window.width, frameThickness * 0.4]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>
    </group>
  );
};