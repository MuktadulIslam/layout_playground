import * as THREE from 'three';

export default function BoxObject({ color = 'green', isHovered = false }: { color?: string, isHovered?: boolean }) {
    const materialColor = isHovered ? new THREE.Color(color).multiplyScalar(1.5) : color

    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={materialColor} />
        </mesh>
    )
}