import { Dispatch, SetStateAction, useRef } from "react";

interface SidebarHeaderProps {
    setShowSketchfabSearch: Dispatch<SetStateAction<boolean>>;
    onFileUpload: (file: File) => void;
}

export default function SidebarHeader({ setShowSketchfabSearch, onFileUpload }: SidebarHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension === 'glb' || fileExtension === 'fbx') {
                onFileUpload(file);
            } else {
                alert('Please upload only .glb or .fbx files');
            }
        }
        // Reset input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="relative px-4 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-black border-b-2 border-gray-700/50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                    <div className="absolute top-2 left-4 w-8 h-8 bg-blue-400/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-2 right-6 w-6 h-6 bg-purple-400/30 rounded-full blur-lg"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl">🎯</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Object Library
                            </h2>
                            <p className="text-xs text-gray-400">
                                Drag & drop 3D assets
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {/* File Upload Button */}
                        <button
                            onClick={handleUploadClick}
                            className="flex-1 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 bg-green-600/60 text-green-100 hover:bg-green-500/70 hover:text-white border border-green-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-900/20"
                        >
                            <span className="text-base">📁</span>
                            <span>Upload 3D</span>
                        </button>

                        {/* Sketchfab Search Button */}
                        <button
                            onClick={() => setShowSketchfabSearch(prev => !prev)}
                            className="flex-1 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 bg-gray-700/60 text-gray-300 hover:bg-gray-600/70 hover:text-white border border-gray-600/30 hover:border-gray-500/50"
                        >
                            <span className="text-base">🔍</span>
                            <span>Sketchfab</span>
                        </button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".glb,.fbx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>
        </>
    );
}