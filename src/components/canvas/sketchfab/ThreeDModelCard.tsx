import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';
import { SketchfabModel } from './types';
import Image from 'next/image';

interface ThreeDModelCardProps {
    model: SketchfabModel;
    setSelectedModel: (model: SketchfabModel) => void;
    handleDownloadModel: (model: SketchfabModel) => void;
}

export default function ThreeDModelCard({ model, setSelectedModel, handleDownloadModel }: ThreeDModelCardProps) {
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

    return (<>
        <div
            key={model.uid}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden">
                {model.thumbnails?.images?.[0]?.url ? (
                    <Image
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
                </div>
            </div>

            {/* Content */}
            <div className="p-2">
                {/* Author */}
                <div className="flex items-center gap-2 mb-1">
                    {model.user?.avatar?.images?.[0]?.url && (
                        <Image
                            src={model.user.avatar.images[0].url}
                            alt={model.user.displayName || 'User'}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    <span className="text-gray-300 text-sm truncate">
                        {model.user?.displayName || 'Unknown User'}
                    </span>
                </div>

                {/* Description */}
                {model.description && (
                    <p className="text-gray-400 text-sm mb-1 line-clamp-2">
                        {model.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 mb-2 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{formatNumber(model.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{formatNumber(model.likeCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleViewModel(model)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-center text-sm font-medium flex items-center justify-center gap-1"
                    >
                        <Play size={14} />
                        View 3D
                    </button>
                    <button
                        onClick={() => handleDownloadModel(model)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-1"
                        title="Download Model"
                    >
                        <Download size={14} />
                    </button>
                    <a
                        href={model.viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-1"
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* Date */}
                <div className="text-gray-500 text-xs mt-2 text-center">
                    {formatDate(model.createdAt)}
                </div>
            </div>
        </div>
    </>)
}