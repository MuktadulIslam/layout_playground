"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import Room from '@/components/rooms/room1/Room';
import RoomControls from '@/components/canvas/RoomControls'
import Sidebar from './sidebar/Sidebar';
import { PlacedObject } from './types';
import PlayGround from './PlayGround';
import HtmlLoader from './SuspenseLoader';
import ObjectControls from './ObjectControls';
import { MeshProvider, useMeshContext } from './MeshContext';
import { RoomProvider, useRoomContext } from './RoomDimensionsContext';

function Room3DCanvasContent() {
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
    const [objects, setObjects] = useState<PlacedObject[]>([])
    const [currentObject, setCurrentObject] = useState<{ component: React.ReactNode } | null>(null)
    const [orbitEnabled, setOrbitEnabled] = useState(true)
    const [freezeOrbit, setFreezeOrbit] = useState(false)

    // Use mesh context
    const { selectedObject, clearObject } = useMeshContext();
    const { dimensions: roomDimensions, setLength: setRoomLength, setWidth: setRoomWidth } = useRoomContext();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+Shift+S combination
            if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                event.preventDefault(); // Prevent default browser save dialog
                setSidebarVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+Shift+S combination
            if (event.ctrlKey && event.shiftKey && event.key === 'F') {
                event.preventDefault(); // Prevent default browser save dialog
                setFreezeOrbit(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+Shift+Z combination
            if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
                event.preventDefault(); // Prevent default browser save dialog
                setControlsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const handleDragStart = (component: React.ReactNode, dragData: string) => {
        setCurrentObject({ component })
    }

    const handleDeleteMesh = () => {
        console.log('Mesh deleted');
    };

    return (
        <div className="w-screen h-screen bg-[#226764a8]">
            {sidebarVisible && <Sidebar onDragStart={handleDragStart} />}
            {controlsVisible &&
                <RoomControls
                    length={roomDimensions.length}
                    width={roomDimensions.width}
                    onWidthChange={setRoomWidth}
                    onLengthChange={setRoomLength}
                />
            }
            {selectedObject && (
                <ObjectControls
                    object={selectedObject}
                    onClose={clearObject}
                    onDelete={handleDeleteMesh}
                />
            )}

            <Canvas
                // camera={{ position: [8, 4, 8], fov: 60 }}
                camera={{ fov: 60 }}
                shadows
            >
                {/* <axesHelper args={[5]} /> */}
                <Suspense fallback={<HtmlLoader />}>
                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={1}
                        castShadow
                    />
                    <pointLight
                        position={[roomDimensions.width / 2 - 1, 3, -roomDimensions.length / 2 + 1]}
                        intensity={0.8}
                        color="#fff8dc"
                    />

                    {/* Room structure */}
                    <PlayGround
                        key={`${roomDimensions.width}-${roomDimensions.length}`} // This forces complete re-render
                        objects={objects}
                        setObjects={setObjects}
                        currentObject={currentObject}
                        setCurrentObject={setCurrentObject}
                        setOrbitEnabled={setOrbitEnabled}
                        roomWidth={roomDimensions.width}
                        roomLength={roomDimensions.length}
                    >
                        <Room width={roomDimensions.width} length={roomDimensions.length} />
                    </PlayGround>

                    {/* Environment and controls */}
                    <Environment preset="apartment" />
                    <OrbitControls
                        enabled={orbitEnabled && !freezeOrbit}
                        minDistance={1}
                        maxDistance={50}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default function Room3DCanvas() {
    return (
        <RoomProvider initialDimensions={{ width: 20, length: 25, height: 5 }}>
            <MeshProvider>
                <Room3DCanvasContent />
            </MeshProvider>
        </RoomProvider>
    );
}