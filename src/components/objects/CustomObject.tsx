import * as THREE from 'three';
import ScaledModelWrapper from '../canvas/ScaledModelWrapper';

export default function CustomObject({ color = 'purple', isHovered = false }: { color?: string, isHovered?: boolean }) {
  const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

  return (
    <ScaledModelWrapper>
      <group>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      </group>
    </ScaledModelWrapper>
  )
}