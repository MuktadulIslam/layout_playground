'use client'
import { useGLTF, useFBX } from '@react-three/drei'
import { useMemo } from 'react'
import ScaledModelWrapper from '../ScaledModelWrapper'

interface Dynamic3DModelProps {
    url: string;
    fileType: 'glb' | 'fbx';
}

// Separate component for GLB files
function GLBModel({ url }: { url: string }) {
    const gltf = useGLTF(url);

    const clonedScene = useMemo(() => {
        return gltf.scene.clone();
    }, [gltf]);

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Separate component for FBX files
function FBXModel({ url }: { url: string }) {
    const fbx = useFBX(url);

    const clonedScene = useMemo(() => {
        return fbx.clone();
    }, [fbx]);

    return (
        <ScaledModelWrapper>
            <primitive object={clonedScene} />
        </ScaledModelWrapper>
    );
}

// Main component that conditionally renders the appropriate model component
export default function Dynamic3DModel({ url, fileType }: Dynamic3DModelProps) {
    if (fileType === 'glb') {
        return <GLBModel url={url} />;
    } else if (fileType === 'fbx') {
        return <FBXModel url={url} />;
    }

    return null;
}