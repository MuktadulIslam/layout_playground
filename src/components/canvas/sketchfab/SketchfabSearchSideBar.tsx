// src/components/canvas/sketchfab/SketchfabSearchSideBar.tsx
'use client'

import { useState, useCallback, useMemo } from "react";
import SidebarHeader from "./Header";
import SearchBarUtils from "./searchBarUtils";
import ThreeDModelCard from "./ThreeDModelCard";
import { SketchfabModel } from "./types";
import ModelViewer from "./ModelViewer";
import SketchfabLogin from "./SektchfabLogin";
import { SketchfabProvider } from "./context/SketchfabProvider";
import { useSketchfabAuth } from "./context/SketchfabAuthContext";
import { useSketchfabDownload } from "./context/SketchfabDownloadContext";
import { NotificationManager } from "./Notification";

interface SketchfabSearchSideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onAddModelToSidebar?: (modelData: {
        id: string;
        name: string;
        url: string;
        fileType: 'glb';
        model: SketchfabModel;
    }) => void;
    existingModelUids?: string[];
}

export default function SketchfabSearchSideBar({ show, setShow, onAddModelToSidebar, existingModelUids = [] }: SketchfabSearchSideBarProps) {
    return (
        <SketchfabProvider>
            <SketchfabSearch show={show} setShow={setShow} onAddModelToSidebar={onAddModelToSidebar} existingModelUids={existingModelUids} />
        </SketchfabProvider>
    );
}

interface NotificationData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

function SketchfabSearch({ show, setShow, onAddModelToSidebar, existingModelUids = [] }: SketchfabSearchSideBarProps) {
    const [selectedModel, setSelectedModel] = useState<SketchfabModel | null>(null);
    const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
    const [addingToSidebarId, setAddingToSidebarId] = useState<string | null>(null);
    const [addToSidebarProgress, setAddToSidebarProgress] = useState<number>(0);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const { models, SearchBar, ModelLoadingUtils } = SearchBarUtils();
    const { authenticated, loading } = useSketchfabAuth();
    const { downloadGLB, getDownloadOptions } = useSketchfabDownload();

    const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const handleDownloadModel = useCallback(async (model: SketchfabModel) => {
        try {
            setDownloadingModelId(model.uid);
            const urls = await getDownloadOptions(model.uid);
            downloadGLB(urls.glb.url, model.name);
        } catch (error) {
            console.error('Download failed:', error);
            addNotification('Download failed', 'error');
        } finally {
            setDownloadingModelId(null);
        }
    }, [getDownloadOptions, downloadGLB, addNotification]);

    const handleAddToSidebar = useCallback(async (model: SketchfabModel) => {
        // Check if model is already in sidebar
        if (existingModelUids.includes(model.uid)) {
            addNotification(`"${model.name}" is already in the sidebar!`, 'info', 3000);
            return;
        }

        if (!onAddModelToSidebar) {
            addNotification('Add to sidebar callback not available', 'error');
            return;
        }

        try {
            setAddingToSidebarId(model.uid);
            setAddToSidebarProgress(0);

            setAddToSidebarProgress(20);
            const downloadOptions = await getDownloadOptions(model.uid);

            if (!downloadOptions?.glb?.url) {
                throw new Error('GLB format not available for this model');
            }

            setAddToSidebarProgress(40);
            const response = await fetch(downloadOptions.glb.url);

            if (!response.ok) {
                throw new Error('Failed to download GLB file');
            }

            setAddToSidebarProgress(60);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            setAddToSidebarProgress(80);
            const modelData = {
                id: `sketchfab-${model.uid}-${Date.now()}`,
                name: model.name || 'Sketchfab Model',
                url: objectUrl,
                fileType: 'glb' as const,
                model: model
            };

            setAddToSidebarProgress(100);
            onAddModelToSidebar(modelData);

            addNotification(`✨ "${model.name}" added to sidebar!`, 'success', 4000);

            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error('Failed to add model to sidebar:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            addNotification(`Failed to add model: ${errorMessage}`, 'error', 5000);
        } finally {
            setAddingToSidebarId(null);
            setAddToSidebarProgress(0);
        }
    }, [existingModelUids, onAddModelToSidebar, getDownloadOptions, addNotification]);

    // Memoize the models grid to prevent unnecessary re-renders
    const modelsGrid = useMemo(() => {
        if (models.length === 0) return null;

        return (
            <div className="grid grid-cols-3 gap-4 p-2">
                {models.map((model, index) => (
                    <ThreeDModelCard
                        key={`${model.uid}-${index}`}
                        model={model}
                        setSelectedModel={setSelectedModel}
                        handleDownloadModel={handleDownloadModel}
                        handleAddToSidebar={handleAddToSidebar}
                        downloadingModelId={downloadingModelId}
                        addingToSidebarId={addingToSidebarId}
                        addToSidebarProgress={addToSidebarProgress}
                        isAlreadyInSidebar={existingModelUids.includes(model.uid)}
                    />
                ))}
            </div>
        );
    }, [models, handleDownloadModel, handleAddToSidebar, downloadingModelId, addingToSidebarId, addToSidebarProgress, existingModelUids]);

    const handleCloseViewer = useCallback(() => {
        setSelectedModel(null);
    }, []);

    return (
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 absolute left-0 top-0 bottom-0 z-50 backdrop-blur-sm bg-gradient-to-br from-white/40 to-sky-200/20 border-r-2 border-gray-400`}>
            <NotificationManager
                notifications={notifications}
                removeNotification={removeNotification}
            />

            {selectedModel != null && (
                <ModelViewer
                    model={selectedModel}
                    handleDownloadModel={handleDownloadModel}
                    handleAddToSidebar={handleAddToSidebar}
                    closeViewer={handleCloseViewer}
                    addingToSidebarId={addingToSidebarId}
                    addToSidebarProgress={addToSidebarProgress}
                    isAlreadyInSidebar={existingModelUids.includes(selectedModel.uid)}
                />
            )}

            <div className="w-full h-full overflow-auto">
                <SidebarHeader setShow={setShow} />
                {loading ? (
                    <div className="h-full w-full flex flex-col justify-center items-center text-gray-800">
                        <div className="mb-4">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400"></div>
                        </div>
                        <div className="text-xl font-semibold">Loading...</div>
                        <div className="text-sm text-gray-600 mt-2">Connecting to Sketchfab</div>
                        <div className="flex gap-1 mt-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                ) : !authenticated ? (
                    <SketchfabLogin />
                ) : (
                    <>
                        <SearchBar />
                        {modelsGrid}
                        <ModelLoadingUtils />
                    </>
                )}
            </div>
        </div>
    );
}