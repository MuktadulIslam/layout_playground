'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '@/components/canvas/ScaledModelWrapper'

export default function TableModel() {
    const { scene } = useGLTF('./table.glb')
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    )
}