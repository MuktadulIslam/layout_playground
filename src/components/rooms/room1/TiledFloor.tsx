import React from 'react';
import { Plane } from '@react-three/drei';
import { TiledFloorProps, FloorTileProps } from './types';

// Floor tile component
function FloorTile({ position, isAlternate, color, alternateColor }: FloorTileProps) {
  return (
    <Plane
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      args={[1, 1]}
    >
      <meshStandardMaterial
        color={isAlternate ? alternateColor : color}
      />
    </Plane>
  );
}

// Tiled floor component
export default function TiledFloor({ width, length, color, alternateColor }: TiledFloorProps) {
  const tiles: React.JSX.Element[] = [];
  const safeAlternateColor = alternateColor ?? "#cccccc";

  for (let x = 0; x < length; x++) {
    for (let z = 0; z < width; z++) {
      const posX = x - length / 2 + 0.5;
      const posZ = z - width / 2 + 0.5;
      const isAlternate = (x + z) % 2 === 1;

      tiles.push(
        <FloorTile
          key={`tile-${x}-${z}`}
          position={[posX, 0.01, posZ]}
          isAlternate={isAlternate}
          color={color}
          alternateColor={safeAlternateColor}
        />
      );
    }
  }

  return <group position={[0,0,0]}>{tiles}</group>;
};