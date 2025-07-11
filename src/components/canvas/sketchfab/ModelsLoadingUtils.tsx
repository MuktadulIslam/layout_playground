import { Download } from 'lucide-react';
import SketchfabSearchSkeleton from './SketchfabSearchSkeleton';

interface ModelLoadingUtilsProps {
    hasNext: boolean,
    isLoading: boolean,
    modelsLength: number,
    hasSearched: boolean, // This now represents shouldShowNoResults
    isError: boolean,
    setCurrentPageNumber: React.Dispatch<React.SetStateAction<number>>
}

export default function ModelLoadingUtils({
    hasNext,
    isLoading,
    modelsLength,
    hasSearched, // This is now shouldShowNoResults from searchBarUtils
    isError,
    setCurrentPageNumber
}: ModelLoadingUtilsProps) {
    return (
        <>
            {/* Initial Loading (when no models yet) */}
            {isLoading && modelsLength === 0 && (
                <SketchfabSearchSkeleton />
            )}

            {/* Error State */}
            {isError && (
                <div className="text-center py-12">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <p className="text-red-400 font-semibold text-xl">Search failed</p>
                    <p className="text-red-500 mt-2">There was an error searching for models. Please try again.</p>
                </div>
            )}

            {/* No Results Found - only show when explicitly determined */}
            {hasSearched && (
                <div className="p-28">
                    <div className="text-center p-8 bg-black/70 rounded-2xl">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <p className="text-red-400 font-semibold text-xl">No free downloadable models found</p>
                        <p className="text-gray-200 mt-2">Try a different search term or check if there are downloadable models available</p>
                        <p className="text-gray-400 text-sm mt-4">
                            {'💡 Try broader search terms like "chair", "car", "building", "animal" '}
                        </p>
                    </div>
                </div>
            )}

            {/* Show More Button */}
            {hasNext && !isLoading && modelsLength > 0 && (
                <div className="text-center my-5">
                    <button
                        onClick={() => setCurrentPageNumber((pageNo) => pageNo + 1)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                        <Download size={20} />
                        Show More Models
                    </button>
                    <p className="text-gray-400 text-sm mt-2">
                        Showing {modelsLength} models
                    </p>
                </div>
            )}

            {/* Loading More State (when adding to existing results) */}
            {isLoading && modelsLength > 0 && (
                <div className="text-center my-5">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-blue-400"></div>
                    <p className="text-gray-500 mt-2 text-sm">Loading more models...</p>
                </div>
            )}

            {/* End of Results */}
            {!hasNext && modelsLength > 0 && !isLoading && (
                <div className="text-center mt-12">
                    <div className="text-gray-400 text-4xl mb-2">🎉</div>
                    <p className="text-gray-400">
                        All models loaded ({modelsLength} total)
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        {"You've reached the end of the search results"}
                    </p>
                </div>
            )}
        </>
    );
}