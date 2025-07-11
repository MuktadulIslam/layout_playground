import React from 'react';
import { Plane } from '@react-three/drei';
import { WallWithOpeningsProps, WallType } from './types';
import WindowComponent from './Window';
import DoorComponent from './Door';
import DecorationComponent from './Decoration';

const getWallSpecs = ({ roomLength, roomWidth, roomHeight, wall }: { roomLength: number, roomWidth: number, roomHeight: number, wall: WallType }) => {
  switch (wall) {
    case 'front':
      return {
        position: { x: 0, y: roomHeight / 2, z: roomWidth / 2 }, // swapped roomLength -> roomWidth
        rotation: [0, 0, 0] as [number, number, number],
        wallLength: roomLength, // swapped roomWidth -> roomLength
        normal: { x: 0, y: 0, z: 1 }
      };
    case 'back':
      return {
        position: { x: 0, y: roomHeight / 2, z: -roomWidth / 2 }, // swapped roomLength -> roomWidth
        rotation: [0, 0, 0] as [number, number, number],
        wallLength: roomLength, // swapped roomWidth -> roomLength
        normal: { x: 0, y: 0, z: 1 }
      };
    case 'left':
      return {
        position: { x: -roomLength / 2, y: roomHeight / 2, z: 0 }, // swapped roomWidth -> roomLength
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        wallLength: roomWidth, // swapped roomLength -> roomWidth
        normal: { x: 1, y: 0, z: 0 }
      };
    case 'right':
      return {
        position: { x: roomLength / 2, y: roomHeight / 2, z: 0 }, // swapped roomWidth -> roomLength
        rotation: [0, -Math.PI / 2, 0] as [number, number, number],
        wallLength: roomWidth, // swapped roomLength -> roomWidth
        normal: { x: -1, y: 0, z: 0 }
      };
    default:
      return {
        position: { x: 0, y: 0, z: 0 },
        rotation: [0, 0, 0] as [number, number, number],
        wallLength: 0,
        normal: { x: 0, y: 0, z: 0 }
      };
  }
};

// Function to check if opening is within wall bounds
const isWithinWallBounds = (
  opening: { fromLeftSide: number; fromFloor: number; width: number; height: number },
  wallLength: number,
  wallHeight: number
): boolean => {
  // Check horizontal bounds
  const leftEdge = opening.fromLeftSide;
  const rightEdge = opening.fromLeftSide + opening.width;

  // Check vertical bounds
  const bottomEdge = opening.fromFloor;
  const topEdge = opening.fromFloor + opening.height;

  return (
    leftEdge >= 0 &&
    rightEdge <= wallLength &&
    bottomEdge >= 0 &&
    topEdge <= wallHeight
  );
};

export default function WallWithOpenings({
  wall,
  roomWidth,
  roomLength,
  roomHeight,
  color,
  doors,
  windows,
  wallDecorations
}: WallWithOpeningsProps) {
  const wallSpec = getWallSpecs({ roomLength, roomWidth, roomHeight, wall });

  // Filter openings for this wall and convert to new positioning system
  const wallDoors = doors
    .filter(d => d.wall === wall)
    .map(door => ({
      ...door,
      position: door.position ?? 5,
      fromLeftSide: door.fromLeftSide,
      fromFloor: door.fromFloor
    }))
    .filter(door => isWithinWallBounds(door, wallSpec.wallLength, roomHeight));

  const wallWindows = windows
    .filter(w => w.wall === wall)
    .map(window => ({
      ...window,
      position: window.position ?? 0,
      fromLeftSide: window.fromLeftSide
    }))
    .filter(window => isWithinWallBounds(window, wallSpec.wallLength, roomHeight));

  const wallDecos = wallDecorations
    .filter(d => d.wall === wall)
    .map(decoration => ({
      ...decoration,
      position: decoration.position ?? 0,
      fromLeftSide: decoration.fromLeftSide
    }))
    .filter(decoration => isWithinWallBounds(decoration, wallSpec.wallLength, roomHeight));

  return (
    <group>
      {/* Full wall plane - always create the complete wall first */}
      <Plane
        key={`${wall}-full-wall`}
        position={[wallSpec.position.x, wallSpec.position.y, wallSpec.position.z]}
        rotation={wallSpec.rotation}
        args={[wallSpec.wallLength, roomHeight]}
      >
        <meshStandardMaterial color={color} />
      </Plane>

      {/* Add doors on top of the wall */}
      {wallDoors.map((door, index) => (
        <DoorComponent
          key={index}
          door={door}
          wallSpec={wallSpec}
          wall={wall}
        />
      ))}

      {/* Add windows on top of the wall */}
      {wallWindows.map((window, index) => (
        <WindowComponent
          key={index}
          window={window}
          wallSpec={wallSpec}
          wall={wall}
        />
      ))}

      {/* Add wall decorations on top of the wall */}
      {wallDecos.map((decoration, index) => (
        <DecorationComponent
          key={index}
          decoration={decoration}
          wallSpec={wallSpec}
          wall={wall}
        />
      ))}
    </group>
  );
}