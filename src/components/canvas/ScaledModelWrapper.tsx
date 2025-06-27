import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useRoomContext } from './RoomDimensionsContext';

interface ScaledModelWrapperProps {
    children: React.ReactNode;
}

export default function ScaledModelWrapper({
    children,
}: ScaledModelWrapperProps) {
    const groupRef = useRef<THREE.Group>(null);
    const previousScale = useRef<THREE.Vector3>(null);
    const { dimensions: roomDimensions } = useRoomContext();

    const processScaling = useCallback(() => {
        if (!groupRef.current || !roomDimensions) return 1;
        try {
            // Calculate the bounding box
            const box = new THREE.Box3().setFromObject(groupRef.current);
            if (box.isEmpty()) return 1;

            const size = new THREE.Vector3();
            box.getSize(size);

            const maxScaleDownFactor = Math.max(size.x / roomDimensions.length, size.z / roomDimensions.width, size.y / roomDimensions.height);
            return 1 / maxScaleDownFactor;
        } catch (error) {
            console.warn('❌ Error in scaling:', error);
            return 1;
        }
    }, [roomDimensions]);

    // Reset when children change
    useEffect(() => {
        if (groupRef.current && groupRef.current.scale != previousScale.current) {
            const scaleDownFactor = processScaling() * 0.4;   // Adjust the scale down factor as needed
            groupRef.current.scale.set(scaleDownFactor, scaleDownFactor, scaleDownFactor);
            previousScale.current = groupRef.current.scale;
        }
    }, [roomDimensions, processScaling]);

    return (
        <>
            <group ref={groupRef}>
                {children}
            </group>
        </>
    );
}