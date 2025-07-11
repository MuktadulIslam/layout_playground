import { useFrame, useThree } from "@react-three/fiber"
import { PlacedObject } from "./types"
import { Suspense, useEffect, useRef } from "react"
import * as THREE from 'three'
import DraggableObject from "./DraggableObject"
import React from "react"
import HtmlLoader from "./SuspenseLoader"
import { useMeshContext } from "./MeshContext"


interface PlayGroundProps {
    currentObject: { component: React.ReactNode } | null;
    setCurrentObject: React.Dispatch<React.SetStateAction<{ component: React.ReactNode } | null>>;
    setOrbitEnabled: (enabled: boolean) => void;
    roomLength: number;
    roomWidth: number;
    children: React.ReactNode;
}

export default function PlayGround({
    currentObject,
    setCurrentObject,
    setOrbitEnabled,
    roomWidth,
    roomLength,
    children
}: PlayGroundProps) {
    const { camera, raycaster, gl } = useThree();
    const groundRef = useRef<THREE.Mesh>(null);
    const { objects, addObject, clearObject } = useMeshContext();

    // Handle drop events
    useEffect(() => {
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();

            if (currentObject) {
                const canvas = gl.domElement;
                const rect = canvas.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

                if (groundRef.current) {
                    const intersects = raycaster.intersectObject(groundRef.current);

                    if (intersects.length > 0) {
                        const point = intersects[0].point;

                        const newObject: PlacedObject = {
                            id: Date.now().toString(),
                            component: currentObject.component,
                            position: [point.x, 1, point.z]
                        };

                        addObject(newObject);
                    }
                }

                setCurrentObject(null);
            }
        };

        const preventDefaults = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        document.addEventListener('drop', handleDrop);
        document.addEventListener('dragover', preventDefaults);

        return () => {
            document.removeEventListener('drop', handleDrop);
            document.removeEventListener('dragover', preventDefaults);
        };
    }, [currentObject, setCurrentObject, camera, raycaster, gl, addObject]);

    // Handle floor click to deselect objects
    const handleFloorClick = (event: React.MouseEvent) => {
        // Stop event propagation to prevent conflicts with object selection
        event.stopPropagation();

        // Clear the selected object
        clearObject();
    };

    return (
        <>
            {/* Render dropped objects */}
            {objects.map(obj => (
                <Suspense fallback={<HtmlLoader />} key={obj.id}>
                    <DraggableObject
                        objectId={obj.id}
                        position={obj.position}
                        groundSize={{
                            width: roomLength,
                            depth: roomWidth
                        }}
                        setOrbitEnabled={setOrbitEnabled}
                    >
                        {React.cloneElement(obj.component as React.ReactElement, { key: obj.id })}
                    </DraggableObject>
                </Suspense>
            ))}
            {children}

            {/* Playground floor */}
            <mesh
                ref={groundRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                onClick={handleFloorClick}
            >
                <planeGeometry args={[roomLength, roomWidth]} />
                <meshStandardMaterial color="lightgray" opacity={0.7} transparent />
            </mesh>
        </>
    );
}