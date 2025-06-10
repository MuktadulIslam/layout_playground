import React from 'react';
import { Plane } from '@react-three/drei';
import { Door } from './types';

interface DoorComponentProps {
  door: Door & { fromLeftSide: number; fromFloor: number };
  wallSpec: {
    position: { x: number; y: number; z: number };
    rotation: [number, number, number];
    wallLength: number;
    wallThickness?: number;
    normal: { x: number; y: number; z: number };
  };
  wall: 'front' | 'back' | 'left' | 'right';
}

export default function DoorComponent({ door, wallSpec, wall }: DoorComponentProps) {
  // Calculate position relative to wall center
  const relativeX = door.fromLeftSide + (door.width / 2) - (wallSpec.wallLength / 2);
  const relativeY = door.fromFloor + (door.height / 2);

  // Wall thickness for realistic depth
  const offsetDistance = 0.01;

  // Calculate final position
  const finalPosition: [number, number, number] = [
    wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * offsetDistance,
    relativeY,
    wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * offsetDistance
  ];

  const doorColor = door.color || "#8B4513";
  const frameColor = "#654321";
  const panelColor = "#A0522D";
  const handleColor = "#C0C0C0";
  const hingeColor = "#2C3E50";
  const doorOffsetDistance = 0.03;
  const frameThickness = 0.08;
  const panelInset = 0.1;

  return (
    <group key={`realistic-door-group-${door.id}`}>
      {/* Door frame using Planes */}
      {/* Top frame */}
      <Plane
        position={[
          wallSpec.position.x + relativeX * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * doorOffsetDistance,
          relativeY + door.height / 2 + frameThickness / 2,
          wallSpec.position.z + relativeX * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * doorOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[door.width + frameThickness * 2, frameThickness]}
      >
        <meshStandardMaterial
          color={frameColor}
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Left frame */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX - door.width / 2 - frameThickness / 2) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * doorOffsetDistance,
          relativeY,
          wallSpec.position.z + (relativeX - door.width / 2 - frameThickness / 2) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * doorOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[frameThickness, door.height]}
      >
        <meshStandardMaterial
          color={frameColor}
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Right frame */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX + door.width / 2 + frameThickness / 2) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * doorOffsetDistance,
          relativeY,
          wallSpec.position.z + (relativeX + door.width / 2 + frameThickness / 2) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * doorOffsetDistance
        ]}
        rotation={wallSpec.rotation}
        args={[frameThickness, door.height]}
      >
        <meshStandardMaterial
          color={frameColor}
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Main door surface */}
      <Plane
        position={finalPosition}
        rotation={wallSpec.rotation}
        args={[door.width, door.height]}
      >
        <meshStandardMaterial
          color={doorColor}
          roughness={0.6}
          metalness={0.1}
        />
      </Plane>

      {/* Door panels - Upper panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.002,
          relativeY + door.height * 0.25,
          finalPosition[2] + wallSpec.normal.z * 0.002
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, door.height * 0.35]}
      >
        <meshStandardMaterial
          color={panelColor}
          roughness={0.4}
          metalness={0.05}
        />
      </Plane>

      {/* Door panels - Lower panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.002,
          relativeY - door.height * 0.25,
          finalPosition[2] + wallSpec.normal.z * 0.002
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, door.height * 0.35]}
      >
        <meshStandardMaterial
          color={panelColor}
          roughness={0.4}
          metalness={0.05}
        />
      </Plane>

      {/* Door panel borders - Upper panel border */}
      {/* Top border of upper panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.003,
          relativeY + door.height * 0.425,
          finalPosition[2] + wallSpec.normal.z * 0.003
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, 0.02]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Bottom border of upper panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.003,
          relativeY + door.height * 0.075,
          finalPosition[2] + wallSpec.normal.z * 0.003
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, 0.02]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Top border of lower panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.003,
          relativeY - door.height * 0.075,
          finalPosition[2] + wallSpec.normal.z * 0.003
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, 0.02]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Bottom border of lower panel */}
      <Plane
        position={[
          finalPosition[0] + wallSpec.normal.x * 0.003,
          relativeY - door.height * 0.425,
          finalPosition[2] + wallSpec.normal.z * 0.003
        ]}
        rotation={wallSpec.rotation}
        args={[door.width - panelInset * 2, 0.02]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Vertical panel borders */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX - door.width / 2 + panelInset) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.003),
          relativeY,
          wallSpec.position.z + (relativeX - door.width / 2 + panelInset) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.003)
        ]}
        rotation={wallSpec.rotation}
        args={[0.02, door.height * 0.85]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      <Plane
        position={[
          wallSpec.position.x + (relativeX + door.width / 2 - panelInset) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.003),
          relativeY,
          wallSpec.position.z + (relativeX + door.width / 2 - panelInset) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.003)
        ]}
        rotation={wallSpec.rotation}
        args={[0.02, door.height * 0.85]}
      >
        <meshStandardMaterial color={frameColor} />
      </Plane>

      {/* Door handle */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX + door.width * 0.35) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.004),
          relativeY + 0.1,
          wallSpec.position.z + (relativeX + door.width * 0.35) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.004)
        ]}
        rotation={wallSpec.rotation}
        args={[0.15, 0.05]}
      >
        <meshStandardMaterial
          color={handleColor}
          roughness={0.3}
          metalness={0.8}
        />
      </Plane>

      {/* Door handle knob */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX + door.width * 0.38) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.005),
          relativeY + 0.1,
          wallSpec.position.z + (relativeX + door.width * 0.38) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.005)
        ]}
        rotation={wallSpec.rotation}
        args={[0.04, 0.04]}
      >
        <meshStandardMaterial
          color={handleColor}
          roughness={0.2}
          metalness={0.9}
        />
      </Plane>

      {/* Door hinges - Upper hinge */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX - door.width * 0.45) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.004),
          relativeY + door.height * 0.35,
          wallSpec.position.z + (relativeX - door.width * 0.45) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.004)
        ]}
        rotation={wallSpec.rotation}
        args={[0.05, 0.12]}
      >
        <meshStandardMaterial
          color={hingeColor}
          roughness={0.4}
          metalness={0.7}
        />
      </Plane>

      {/* Door hinges - Lower hinge */}
      <Plane
        position={[
          wallSpec.position.x + (relativeX - door.width * 0.45) * (wall === 'left' || wall === 'right' ? 0 : 1) + wallSpec.normal.x * (doorOffsetDistance + 0.004),
          relativeY - door.height * 0.35,
          wallSpec.position.z + (relativeX - door.width * 0.45) * (wall === 'left' || wall === 'right' ? 1 : 0) + wallSpec.normal.z * (doorOffsetDistance + 0.004)
        ]}
        rotation={wallSpec.rotation}
        args={[0.05, 0.12]}
      >
        <meshStandardMaterial
          color={hingeColor}
          roughness={0.4}
          metalness={0.7}
        />
      </Plane>

      {/* Door threshold/sill */}
      <Plane
        position={[
          finalPosition[0],
          relativeY - door.height / 2 - 0.02,
          finalPosition[2]
        ]}
        rotation={wallSpec.rotation}
        args={[door.width + 0.1, 0.04]}
      >
        <meshStandardMaterial
          color="#8B7355"
          roughness={0.9}
          metalness={0}
        />
      </Plane>
    </group>
  );
};
