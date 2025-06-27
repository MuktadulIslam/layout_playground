'use client'

import { useEffect, useRef, useState } from "react";
import SidebarHeader from "./Header";
import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';
import SearchBarUtils from "./searchBarUtils";
import ThreeDModelCard from "./ThreeDModelCard";
import { SketchfabModel } from "./types";
import ModelViewer from "./ModelViewer";

interface SketchfabSearchSideBarProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

export default function SketchfabSearchSideBar({ show, setShow }: SketchfabSearchSideBarProps) {
    const [selectedModel, setSelectedModel] = useState<SketchfabModel | null>(null);
    const { models, SearchBar, ModelLoadingUtils } = SearchBarUtils();

    const handleDownloadModel = (model: SketchfabModel) => {
        const confirmed = window.confirm(
            `This will open the Sketchfab page for "${model.name}" where you can download the model. You may need to sign in to Sketchfab. Continue?`
        );

        if (confirmed) {
            // const sketchfabModelUrl = `https://sketchfab.com/3d-models/${model.name.replace(/\s+/g, '-').toLowerCase()}-${model.uid}#download`;
            const sketchfabModelUrl = `${model.viewerUrl}#download`;
            window.open(sketchfabModelUrl, '_blank');
        }
    }

    return (<>
        <div className={`h-screen w-3xl ${show ? '' : '-translate-x-full'} transition-all duration-300 fixed left-0 top-0 bottom-0 z-50 backdrop-blur-sm bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90  border-r border-gray-700`}>
            {/* 3D Model Viewer Modal */}
            {selectedModel != null && (
                <ModelViewer
                    model={selectedModel}
                    handleDownloadModel={handleDownloadModel}
                    closeViewer={() => {
                        setSelectedModel(null);
                    }}
                />
            )}
            <div className="w-full h-full overflow-auto">
                <SidebarHeader setShow={setShow} />
                <SearchBar />

                {models.length > 0 && (
                    <>
                        <div className="grid grid-cols-3  gap-4 p-2">
                            {models.map((model, index) => (
                                <ThreeDModelCard
                                    key={index}
                                    model={model}
                                    setSelectedModel={setSelectedModel}
                                    handleDownloadModel={handleDownloadModel}
                                />
                            ))}
                        </div>
                    </>
                )}
                <ModelLoadingUtils />
            </div>
        </div>
    </>)
}