import { Search, ExternalLink, Download, Heart, Eye, X, Play } from 'lucide-react';

interface ModelLoadingUtilsProps {
    hasNext: boolean,
    isLoading: boolean,
    modelsLength: number,
    hasSearched: boolean,
    isError: boolean,
    setCurrentPageNumber: React.Dispatch<React.SetStateAction<number>>
}
export default function ModelLoadingUtils({ hasNext, isLoading, modelsLength, isError, hasSearched, setCurrentPageNumber }: ModelLoadingUtilsProps) {
    return (<>
        {/* Loading */}
        {isLoading && modelsLength == 0 && (
            <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400"></div>
                <p className="text-gray-300 mt-4">Searching for models...</p>
            </div>
        )}
        {/* Results */}
        {hasSearched && !isLoading && modelsLength === 0 && !isError && (
            <div className="text-center py-12">
                <p className="text-gray-400 text-xl">No free downloadable models found.</p>
                <p className="text-gray-500 mt-2">Try a different search term or check if there are downloadable models available</p>
            </div>
        )}
        {/* Show More Button */}
        {hasNext && !isLoading && (
            <div className="text-center my-5">
                <button
                    onClick={() => setCurrentPageNumber((pageNo) => { return pageNo + 1 })}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                    <Download size={20} />
                    Show More Models
                </button>
            </div>
        )}
        {/* Loading More State */}
        {isLoading && modelsLength != 0 && (
            <div className="text-center my-5">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-blue-400"></div>
                <p className="text-gray-300 mt-2 text-sm">Loading more models...</p>
            </div>
        )}
        {/* End of Results */}
        {!hasNext && modelsLength > 0 && !isLoading && (
            <div className="text-center mt-12">
                <p className="text-gray-400">
                    All models loaded ({modelsLength} total)
                </p>
            </div>
        )}
    </>)
}