'use client'
import { useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../../canvas/ScaledModelWrapper'

export default function WaitingBench() {
    const fbx = useFBX('./xr_3dmodels/waiting_bench.fbx')
    const clonedScene = useMemo(() => fbx.clone(), [fbx])

    return <ScaledModelWrapper>
        <primitive object={clonedScene} />
    </ScaledModelWrapper>
}