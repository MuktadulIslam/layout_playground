import { DragControls } from "@react-three/drei"
import React from "react"
import { useEffect, useRef, useState } from "react"
import * as THREE from 'three'

interface DraggableObjectProps {
  position: [number, number, number],
  groundSize: { width: number, depth: number },
  setOrbitEnabled: (enabled: boolean) => void,
  children: React.ReactNode
}

export default function DraggableObject({
  position,
  groundSize,
  setOrbitEnabled,
  children
}: DraggableObjectProps) {

  const [isHovered, setIsHovered] = useState(false)
  const [objectSize, setObjectSize] = useState<[number, number, number]>([1, 1, 1])
  const [objectPosition, setObjectPosition] = useState<[number, number, number]>([position[0], 0, position[2]]) // for now everything should be on ground
  const [dragLimits, setDragLimits] = useState<[[number, number], [number, number], [number, number]]>([[0, groundSize.width], [0, 0], [0, groundSize.depth]])
  const groupRef = useRef<THREE.Group>(null)


  // Fixed useEffect in DraggableObject component
  useEffect(() => {
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current)
      const size = new THREE.Vector3()
      box.getSize(size)
      const minEdge = box.min.clone();
      const maxEdge = box.max.clone();

      setObjectSize([size.x, size.y, size.z])
      const [objectWidth, objectHeight, objectDepth] = [size.x, size.y, size.z];

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
        // for y-axis
        position[1] = -minEdge.y;
        // for z-asis
        if (position[2] < -groundSize.depth / 2) position[2] = -groundSize.depth / 2;
        else if (position[2] > groundSize.depth / 2) position[2] = groundSize.depth / 2;

        if (groupRef.current) {
          groupRef.current.position.set(position[0], position[1], position[2])
        }
        return position;
      })
    }
  }, [groundSize.width, groundSize.depth]) // Removed children dependency

  return (
    <DragControls
      onDragStart={() => setOrbitEnabled(false)}
      onDragEnd={() => setOrbitEnabled(true)}
      dragLimits={dragLimits}
    >
      <group
        ref={groupRef}
        position={objectPosition}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {/* Pass hover state to children */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, {
              ...((child.props as object) || {}),
              isHovered
            })
          }
          return child
        })}
      </group>
    </DragControls>
  )
}