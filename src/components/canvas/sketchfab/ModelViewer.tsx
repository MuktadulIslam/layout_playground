import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';
import { SketchfabModel } from './types';
import { useEffect, useRef } from 'react';

interface ModelViewerProps {
    model: SketchfabModel;
    handleDownloadModel: (model: SketchfabModel) => void;
    closeViewer: () => void;
}

export default function ModelViewer({ model, handleDownloadModel, closeViewer }: ModelViewerProps) {
    const popupRef = useRef<HTMLDivElement>(null);

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
                <div ref={popupRef} className="w-full aspect-square scale-0 transition-transform duration-500 bg-gradient-to-br from-blue-600/60 via-purple-600/60 to-blue-900/60 rounded-2xl flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-2 border-b border-white">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white truncate">
                                {model.name || 'Untitled Model'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleDownloadModel(model)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                title="Download Model"
                            >
                                <Download size={18} />
                                Download
                            </button>
                            <button
                                onClick={closeViewer}
                                className="bg-gradient-to-br from-red-600/60 via-red-400/60 to-stone-400/80 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

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