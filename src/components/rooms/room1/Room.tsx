import React from 'react';
import { Plane } from '@react-three/drei';
import TiledFloor from './TiledFloor';
import WallWithOpenings from './WallWithOpenings';
import { getRoomConfig } from './roomConfig';

interface RoomProps {
  length: number;     // length of x-axis 
  width: number;      // length of z-axis 
}
export default function Room({ width, length }: RoomProps) {

  const { dimensions, colors, doors = [], windows = [], wallDecorations = [] } = getRoomConfig(width, length);
  const { width: roomWidth, length: roomLength, height: roomHeight } = dimensions;

  return (
    <group>
      {/* Tiled floor */}
      <TiledFloor
        width={roomWidth}
        length={roomLength}
        color={colors.floor}
        alternateColor={colors?.alternateFloor}
      />

      {/* Ceiling */}
      <Plane
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, roomHeight, 0]}
        args={[roomLength, roomWidth]}
      >
        <meshStandardMaterial color={colors.ceiling} />
      </Plane>

      {/* Walls with openings - now using simplified approach */}
      <WallWithOpenings
        wall="front"
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        color={colors.walls}
        doors={doors}
        windows={windows}
        wallDecorations={wallDecorations}
      />

      <WallWithOpenings
        wall="back"
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        color={colors.walls}
        doors={doors}
        windows={windows}
        wallDecorations={wallDecorations}
      />

      <WallWithOpenings
        wall="left"
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        color={colors.walls}
        doors={doors}
        windows={windows}
        wallDecorations={wallDecorations}
      />

      <WallWithOpenings
        wall="right"
        roomWidth={roomWidth}
        roomLength={roomLength}
        roomHeight={roomHeight}
        color={colors.walls}
        doors={doors}
        windows={windows}
        wallDecorations={wallDecorations}
      />
    </group>
  );
};