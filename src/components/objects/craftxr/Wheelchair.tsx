'use client'
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../../canvas/ScaledModelWrapper'

export default function Wheelchair() {
    const { scene } = useGLTF('./xr_3dmodels/wheelchair.glb')
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return <ScaledModelWrapper>
        <primitive object={clonedScene} />
    </ScaledModelWrapper>
}