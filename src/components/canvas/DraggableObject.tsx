import { DragControls } from "@react-three/drei"
import React from "react"
import { useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { useMeshContext } from "./MeshContext"

interface DraggableObjectProps {
  objectId: string,
  position: [number, number, number],
  groundSize: { width: number, depth: number },
  setOrbitEnabled: (enabled: boolean) => void,
  children: React.ReactNode
}

export default function DraggableObject({
  objectId,
  position,
  groundSize,
  setOrbitEnabled,
  children
}: DraggableObjectProps) {

  const { setObject, setFixedRingRadiusCallback, selectedObjectId } = useMeshContext();
  const [isHovered, setIsHovered] = useState(false)
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([position[0], 0, position[2]]) // for now everything should be on ground
  const [dragLimits, setDragLimits] = useState<[[number, number], [number, number], [number, number]]>([[0, groundSize.width], [0, 0], [0, groundSize.depth]])
  const [ringRadius, setRingRadius] = useState<{ inner: number, outer: number }>({ inner: 1, outer: 1.2 })
  const parentGroupRef = useRef<THREE.Group>(null)
  const groupRef = useRef<THREE.Group>(null)

  const fixedRingRadius = () => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)

      // Calculate ring radius based on object size
      const maxHorizontalSize = Math.max(size.x, size.z);
      const baseRadius = (maxHorizontalSize / 2) * 1.2;
      const padding = 0.1;

      setRingRadius({
        inner: baseRadius,
        outer: baseRadius + padding
      });
    }
  }


  // Fixed useEffect in DraggableObject component
  useEffect(() => {
    if (parentGroupRef.current) {
      const box = new THREE.Box3().setFromObject(parentGroupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      const minEdge = box.min.clone();
      const maxEdge = box.max.clone();

      const collisionPreventionThreshold = 0.05;
      const minX = -groundSize.width / 2 - minEdge.x + collisionPreventionThreshold;
      const maxX = groundSize.width / 2 - maxEdge.x - collisionPreventionThreshold;
      const minZ = -groundSize.depth / 2 - minEdge.z + collisionPreventionThreshold;
      const maxZ = groundSize.depth / 2 - maxEdge.z - collisionPreventionThreshold;

      setDragLimits([
        [minX, maxX], // X limits
        [0, 0], // Y fixed to place object on ground
        [minZ, maxZ]  // Z limits
      ]);


      setObjectPosition((position) => {
        // for x-axis
        if (position[0] < -groundSize.width / 2) position[0] = -groundSize.width / 2;
        else if (position[0] > groundSize.width / 2) position[0] = groundSize.width / 2;
        // for z-asis
        if (position[2] < -groundSize.depth / 2) position[2] = -groundSize.depth / 2;
        else if (position[2] > groundSize.depth / 2) position[2] = groundSize.depth / 2;

        if (parentGroupRef.current) {
          // y-asis will only for main (groupRef) 3D component
          parentGroupRef.current.position.set(position[0], position[1], position[2])
        }
        if (groupRef.current) {
          groupRef.current.position.y = -minEdge.y;
        }
        return position;
      })

      fixedRingRadius();
    }
  }, [groundSize.width, groundSize.depth])

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (groupRef.current) {
      setObject(groupRef.current, objectId);
      setFixedRingRadiusCallback(() => fixedRingRadius);
    }
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (groupRef.current && selectedObjectId == objectId) {
      setObject(groupRef.current, objectId);
      setFixedRingRadiusCallback(() => fixedRingRadius);
    }
  }

  return (
    <DragControls
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={() => setOrbitEnabled(true)}
      dragLimits={dragLimits}
    >
      <group
        ref={parentGroupRef}
        position={objectPosition}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {(selectedObjectId == objectId || isHovered) && (
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[ringRadius.inner, ringRadius.outer, 8]} />
            <meshBasicMaterial color={`${selectedObjectId == objectId ? '#0000ff' : '#009900'}`} transparent opacity={0.6} />
          </mesh>
        )}
        <group
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          ref={groupRef}
        >
          {children}
        </group>
      </group>
    </DragControls>
  )
}