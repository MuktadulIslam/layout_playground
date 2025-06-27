import * as THREE from 'three';
import ScaledModelWrapper from '../canvas/ScaledModelWrapper';

export default function Chair({ color = 'blue', isHovered = false }: { color?: string, isHovered?: boolean }) {
    const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

    return (
        <ScaledModelWrapper>
            <group>
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.8, 0.1, 0.8]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[0, 0.9, -0.35]}>
                    <boxGeometry args={[0.8, 0.8, 0.1]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[-0.3, 0.25, -0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[0.3, 0.25, -0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[-0.3, 0.25, 0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[0.3, 0.25, 0.3]}>
                    <boxGeometry args={[0.05, 0.5, 0.05]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
            </group>
        </ScaledModelWrapper>
    )
}