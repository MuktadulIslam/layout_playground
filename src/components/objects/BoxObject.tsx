import * as THREE from 'three';
import ScaledModelWrapper from '../canvas/ScaledModelWrapper';

export default function BoxObject({ color = 'green', isHovered = false }: { color?: string, isHovered?: boolean }) {
    const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

    return (
        <ScaledModelWrapper>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={materialColor} />
            </mesh>
        </ScaledModelWrapper>
    )
}