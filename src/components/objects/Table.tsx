import * as THREE from 'three';
import ScaledModelWrapper from '../canvas/ScaledModelWrapper';

export default function Table({ color = 'brown', isHovered = false }: { color?: string, isHovered?: boolean }) {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <ScaledModelWrapper>
      <group>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
        <mesh position={[-0.8, 0.4, -0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
        <mesh position={[0.8, 0.4, -0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
        <mesh position={[-0.8, 0.4, 0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
        <mesh position={[0.8, 0.4, 0.6]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      </group>
    </ScaledModelWrapper>
  )
}