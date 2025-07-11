// src/components/canvas/sketchfab/context/SketchfabDownloadContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface DownloadContextType {
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    getDownloadOptions: (modelUid: string) => Promise<any>;
    downloadGLB: (downloadUrl: string, modelName?: string) => void;
    downloadFBX: (downloadUrl: string, modelName?: string) => void;
    downloadGLTF: (downloadUrl: string, modelName?: string) => void;
    downloadUSDZ: (downloadUrl: string, modelName?: string) => void;
    clearError: () => void;
    resetDownload: () => void;
    formatFileSize: (bytes: number) => string;
}

const SketchfabDownloadContext = createContext<DownloadContextType | undefined>(undefined);

interface SketchfabDownloadProviderProps {
    children: ReactNode;
}

export function SketchfabDownloadProvider({ children }: SketchfabDownloadProviderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDownloadOptions = useCallback(async (modelUid: string) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const response = await axios.post('/api/sketchfab/download', {
                modelUid: modelUid
            });
            return response.data;
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Download options fetch failed'
                : 'Download options fetch failed';

            setIsError(true);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const downloadFile = useCallback((url: string, filename: string, format: string) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setIsError(true);
            setError('Download failed');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const downloadGLB = useCallback((downloadUrl: string, modelName: string = 'model') => {
        downloadFile(downloadUrl, modelName, 'glb');
    }, [downloadFile]);

    const downloadFBX = useCallback((downloadUrl: string, modelName: string = 'model') => {
        downloadFile(downloadUrl, modelName, 'zip');
    }, [downloadFile]);

    const downloadGLTF = useCallback((downloadUrl: string, modelName: string = 'model') => {
        downloadFile(downloadUrl, modelName, 'zip');
    }, [downloadFile]);

    const downloadUSDZ = useCallback((downloadUrl: string, modelName: string = 'model') => {
        downloadFile(downloadUrl, modelName, 'usdz');
    }, [downloadFile]);

    const clearError = useCallback(() => {
        setError(null);
        setIsError(false);
    }, []);

    const resetDownload = useCallback(() => {
        setIsLoading(false);
        setIsError(false);
        setError(null);
    }, []);

    const formatFileSize = useCallback((bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const contextValue: DownloadContextType = {
        isLoading,
        isError,
        error,
        getDownloadOptions,
        downloadGLB,
        downloadFBX,
        downloadGLTF,
        downloadUSDZ,
        clearError,
        resetDownload,
        formatFileSize
    };

    return (
        <SketchfabDownloadContext.Provider value={contextValue}>
            {children}
        </SketchfabDownloadContext.Provider>
    );
}

export function useSketchfabDownload() {
    const context = useContext(SketchfabDownloadContext);
    if (context === undefined) {
        throw new Error('useSketchfabDownload must be used within a SketchfabDownloadProvider');
    }
    return context;
}