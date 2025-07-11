import { ExternalLink, Download, Heart, Eye, Play, Plus } from 'lucide-react';
import { SketchfabModel } from './types';
import Image from 'next/image';

interface ThreeDModelCardProps {
    model: SketchfabModel;
    setSelectedModel: (model: SketchfabModel) => void;
    handleDownloadModel: (model: SketchfabModel) => void;
    handleAddToSidebar: (model: SketchfabModel) => void;
    downloadingModelId?: string | null;
    addingToSidebarId?: string | null; // New prop for tracking add to sidebar loading
    addToSidebarProgress?: number; // Progress percentage (0-100)
    isAlreadyInSidebar?: boolean; // New prop to check if model is already added
}

export default function ThreeDModelCard({
    model,
    setSelectedModel,
    handleDownloadModel,
    handleAddToSidebar,
    downloadingModelId,
    addingToSidebarId,
    addToSidebarProgress = 0,
    isAlreadyInSidebar = false
}: ThreeDModelCardProps) {
    // Check if this specific model is being downloaded or added to sidebar
    const isThisModelDownloading = downloadingModelId === model.uid;
    const isThisModelAddingToSidebar = addingToSidebarId === model.uid;

    const formatNumber = (num: number | undefined): string => {
        if (num === undefined || num === null) {
            return '0';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleViewModel = (model: SketchfabModel) => {
        setSelectedModel(model);
    };

    return (
        <div
            key={model.uid}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden">
                {model.thumbnails?.images?.[0]?.url ? (
                    <Image
                        width={300}
                        height={300}
                        src={model.thumbnails.images[0].url}
                        alt={model.name || 'Untitled Model'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-base truncate">
                        {model.name || 'Untitled Model'}
                    </h3>
                    {/* Already in sidebar indicator */}
                    {isAlreadyInSidebar && (
                        <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-300 text-xs font-medium">Added to Sidebar</span>
                        </div>
                    )}
                </div>

                {/* Loading overlay for add to sidebar */}
                {isThisModelAddingToSidebar && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 relative mb-2">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="#3b82f6"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - addToSidebarProgress / 100)}`}
                                    className="transition-all duration-300"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{Math.round(addToSidebarProgress)}%</span>
                            </div>
                        </div>
                        <span className="text-white text-sm font-medium">Adding to Sidebar...</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2">
                {/* Author */}
                <div className="flex items-center gap-2 mb-1">
                    {model.user?.avatar?.images?.[0]?.url && (
                        <Image
                            width={50}
                            height={50}
                            src={model.user.avatar.images[0].url}
                            alt={model.user.displayName || 'User'}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span className="text-gray-700 text-sm font-semibold truncate">
                        {model.user?.displayName || 'Unknown User'}
                    </span>
                </div>

                {/* Description */}
                {model.description && (
                    <p className="text-gray-700 text-xs mb-1 line-clamp-2">
                        {model.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-2 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{formatNumber(model.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{formatNumber(model.likeCount)}</span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                        <Download size={14} />
                        <span>{formatNumber(model.downloadCount)}</span>
                    </div>
                </div>

                {/* Tags */}
                {model.tags && model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {model.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 pt-0.5 pb-1 bg-gray-600/20 text-[#212b3c] text-xs border border-gray-500 rounded-full"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1">
                    <button
                        onClick={() => handleViewModel(model)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-2 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-center text-xs font-medium flex items-center justify-center gap-1"
                    >
                        <Play size={12} />
                        View
                    </button>

                    <button
                        onClick={() => handleAddToSidebar(model)}
                        className={`w-8 aspect-square rounded-lg transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1 ${isAlreadyInSidebar
                                ? 'bg-green-600/50 text-green-200 cursor-not-allowed border border-green-500/50'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                            }`}
                        title={isAlreadyInSidebar ? "Already in Sidebar" : "Add to Sidebar"}
                        disabled={isThisModelAddingToSidebar || isAlreadyInSidebar}
                    >
                        {isAlreadyInSidebar ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : isThisModelAddingToSidebar ? (
                            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Plus size={12} />
                        )}
                    </button>

                    <button
                        onClick={() => handleDownloadModel(model)}
                        className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-8 aspect-square rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1"
                        title="Download Model"
                        disabled={isThisModelDownloading}
                    >
                        {isThisModelDownloading ? (
                            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Download size={12} />
                        )}
                    </button>

                    <a
                        href={model.viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white w-8 aspect-square rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-xs font-medium flex items-center justify-center gap-1"
                    >
                        <ExternalLink size={12} />
                    </a>
                </div>

                {/* Date */}
                <div className="text-gray-600 text-xs mt-2 text-center">
                    {formatDate(model.createdAt)}
                </div>
            </div>
        </div>
    );
}