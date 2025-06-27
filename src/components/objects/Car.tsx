import * as THREE from 'three';
import ScaledModelWrapper from '../canvas/ScaledModelWrapper';

export default function Car({ color = 'red', isHovered = false }: { color?: string, isHovered?: boolean }) {
    const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

    return (
        <ScaledModelWrapper>
            <group>
                <mesh position={[0, 0.3, 0]}>
                    <boxGeometry args={[2, 0.6, 1]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[1.2, 0.4, 0.8]} />
                    <meshStandardMaterial color={materialColor} />
                </mesh>
                <mesh position={[-0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.7, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.7, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </ScaledModelWrapper>
    )
}