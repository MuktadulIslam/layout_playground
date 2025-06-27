'use client'
import { useGLTF, useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../ScaledModelWrapper'

interface Dynamic3DModelProps {
    url: string;
    fileType: 'glb' | 'fbx';
}

export default function Dynamic3DModel({ url, fileType }: Dynamic3DModelProps) {
    const gltf = useGLTF(url);
    const fbx = useFBX(url);

    const clonedScene = useMemo(() => {
        if (fileType === 'glb' && gltf) {
            return gltf.scene.clone();
        } else if (fileType === 'fbx' && fbx) {
            return fbx.clone();
        }
        return null;
    }, [gltf, fbx, fileType]);

    if (!clonedScene) return null;

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}