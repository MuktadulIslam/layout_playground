import { Download, X, Plus } from 'lucide-react';
import { SketchfabModel } from './types';
import { useEffect, useRef } from 'react';

interface ModelViewerProps {
    model: SketchfabModel;
    handleDownloadModel: (model: SketchfabModel) => void;
    handleAddToSidebar?: (model: SketchfabModel) => void;
    closeViewer: () => void;
    addingToSidebarId?: string | null;
    addToSidebarProgress?: number;
    isAlreadyInSidebar?: boolean;
}

export default function ModelViewer({
    model,
    handleDownloadModel,
    handleAddToSidebar,
    closeViewer,
    addingToSidebarId,
    addToSidebarProgress = 0,
    isAlreadyInSidebar = false
}: ModelViewerProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const isThisModelAddingToSidebar = addingToSidebarId === model.uid;

    useEffect(() => {
        if (popupRef.current) {
            // Start with scale-0, then animate to scale-100
            setTimeout(() => {
                popupRef.current?.classList.remove('scale-0');
                popupRef.current?.classList.add('scale-100');
            }, 10); // Small delay to ensure initial render
        }
    }, []);

    return (
        <>
            <div className="absolute top-0 border-0 w-full h-full ease-out inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
                <div ref={popupRef} className="w-full aspect-square scale-0 transition-transform duration-500 bg-gradient-to-br from-white/60 to-blue-500/30 rounded-2xl flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-2 border-b border-white">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white truncate">
                                {model.name || 'Untitled Model'}
                            </h2>
                            {/* Status indicator */}
                            {isAlreadyInSidebar && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-green-300 text-sm font-medium">Already in Sidebar</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 *:h-10 *:flex *:items-center *:justify-center">
                            {/* Add to Sidebar Button */}
                            {handleAddToSidebar && (
                                <button
                                    onClick={() => handleAddToSidebar(model)}
                                    className={`w-32 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium ${isAlreadyInSidebar
                                        ? 'bg-green-600/50 text-green-200 cursor-not-allowed border border-green-500/50'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
                                        }`}
                                    title={isAlreadyInSidebar ? "Already in Sidebar" : "Add to Sidebar"}
                                    disabled={isThisModelAddingToSidebar || isAlreadyInSidebar || isThisModelAddingToSidebar}
                                >
                                    {isAlreadyInSidebar ? (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Added</span>
                                        </>
                                    ) : isThisModelAddingToSidebar ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            <span>Sidebar</span>
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Download Button */}
                            <button
                                onClick={() => handleDownloadModel(model)}
                                className="aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-lg gap-2 transition-colors duration-200 font-medium hover:shadow-lg"
                                title="Download Model"
                            >
                                <Download size={18} />
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={closeViewer}
                                className="aspect-square bg-gradient-to-br from-red-600 via-red-400 to-red-400/50 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator overlay for add to sidebar */}
                    {isThisModelAddingToSidebar && (
                        <div className="absolute top-16 left-6 right-6 z-10">
                            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8">
                                        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                                            <circle
                                                cx="16"
                                                cy="16"
                                                r="14"
                                                stroke="rgba(255,255,255,0.2)"
                                                strokeWidth="2"
                                                fill="none"
                                            />
                                            <circle
                                                cx="16"
                                                cy="16"
                                                r="14"
                                                stroke="#10b981"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 14}`}
                                                strokeDashoffset={`${2 * Math.PI * 14 * (1 - addToSidebarProgress / 100)}`}
                                                className="transition-all duration-300"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{Math.round(addToSidebarProgress)}%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-medium">Adding to Sidebar...</p>
                                        <p className="text-gray-300 text-xs">
                                            {addToSidebarProgress < 20 && "Getting download options..."}
                                            {addToSidebarProgress >= 20 && addToSidebarProgress < 40 && "Downloading GLB file..."}
                                            {addToSidebarProgress >= 40 && addToSidebarProgress < 60 && "Processing file..."}
                                            {addToSidebarProgress >= 60 && addToSidebarProgress < 80 && "Preparing model data..."}
                                            {addToSidebarProgress >= 80 && "Finalizing..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${addToSidebarProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3D Viewer */}
                    <div className="flex-1 relative">
                        <iframe
                            src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&dnt=1`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
                            title={model.name || 'Untitled Model'}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}