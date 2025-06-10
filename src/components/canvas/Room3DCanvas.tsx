"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import Room from '@/components/rooms/room1/Room';
import RoomControls from '@/components/canvas/RoomControls'
import Sidebar from './Sidebar';
import { PlacedObject } from './types';
import PlayGround from './PlayGround';

const HtmlLoader = () => {
    return (
        <Html center>
            <div className="spinner"></div>
            <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 4px solid #fff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </Html>
    )
}

export default function Room3DCanvas() {
    // length means the length of x-axis 
    // width means the length of z-axis 
    const [roomWidth, setRoomWidth] = useState<number>(10);
    const [roomLength, setRoomLength] = useState<number>(20);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

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

    const [objects, setObjects] = useState<PlacedObject[]>([])
    const [currentObject, setCurrentObject] = useState<{ component: React.ReactNode } | null>(null)
    const [orbitEnabled, setOrbitEnabled] = useState(true)

    const handleDragStart = (component: React.ReactNode) => {
        setCurrentObject({ component })
    }

    return (
        <div className="w-screen h-screen bg-[#226764a8]">
            {sidebarVisible && <Sidebar onDragStart={handleDragStart} />}
            {controlsVisible &&
                <RoomControls
                    length={roomLength}
                    width={roomWidth}
                    onWidthChange={setRoomWidth}
                    onLengthChange={setRoomLength}
                />
            }

            <Canvas
                camera={{ position: [8, 4, 8], fov: 60 }}
                // camera={{ fov: 60 }}
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
                        position={[roomWidth / 2 - 1, 3, -roomLength / 2 + 1]}
                        intensity={0.8}
                        color="#fff8dc"
                    />

                    {/* Room structure */}
                     <PlayGround
                        key={`${roomWidth}-${roomLength}`} // This forces complete re-render
                        objects={objects}
                        setObjects={setObjects}
                        currentObject={currentObject}
                        setCurrentObject={setCurrentObject}
                        setOrbitEnabled={setOrbitEnabled}
                        roomWidth={roomWidth}
                        roomLength={roomLength}
                    >
                        <Room width={roomWidth} length={roomLength} />
                    </PlayGround>

                    {/* Environment and controls */}
                    <Environment preset="apartment" />
                    <OrbitControls
                        enabled={orbitEnabled}
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