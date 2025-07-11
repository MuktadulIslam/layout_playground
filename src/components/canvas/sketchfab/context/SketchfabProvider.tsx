// src/components/canvas/sketchfab/context/SketchfabProvider.tsx
'use client';

import React, { ReactNode } from 'react';
import { SketchfabAuthProvider } from './SketchfabAuthContext';
import { SketchfabDownloadProvider } from './SketchfabDownloadContext';

interface SketchfabProviderProps {
    children: ReactNode;
}

export function SketchfabProvider({ children }: SketchfabProviderProps) {
    return (
        <SketchfabAuthProvider>
            <SketchfabDownloadProvider>
                {children}
            </SketchfabDownloadProvider>
        </SketchfabAuthProvider>
    );
}