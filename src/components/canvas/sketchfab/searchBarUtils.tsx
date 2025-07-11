import { useGetSketchfabModels } from "@/components/canvas/sketchfab/sketchfabHook";
import { useEffect, useRef, useState } from "react";
import { SketchfabResponse } from "./types";
import ModelLoadingUtils from "./ModelsLoadingUtils";

const initialResponseData: SketchfabResponse = {
    results: [],
    next: null,
    previous: null,
    count: 0
}

interface SearchBarProps {
    onSearch: (newQuery: string) => void;
    currentQuery: string;
    isSearching: boolean; // Add isSearching prop
}

function SearchBar({ onSearch, currentQuery, isSearching }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(currentQuery);

    // Update input value when currentQuery changes
    useEffect(() => {
        setInputValue(currentQuery);
    }, [currentQuery]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    return (
        <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for free downloadable 3D models..."
                    className="w-full px-6 py-2 text-base font-semibold bg-white/50 backdrop-blur-md border border-gray-800 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    disabled={isSearching}
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchBarUtils() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const [isSearching, setIsSearching] = useState<boolean>(false); // Track search state
    const hasSearched = useRef<boolean>(false);
    const lastSearchQuery = useRef<string>(''); // Track the last search query
    const { data, isLoading, error, isError, refetch } = useGetSketchfabModels(searchQuery, currentPageNumber);
    const [response, setResponse] = useState<SketchfabResponse>(initialResponseData);

    useEffect(() => {
        if (data) {
            setResponse((response) => {
                return {
                    next: data.next,
                    previous: data.previous,
                    count: data.count,
                    results: [...response.results, ...data.results]
                }
            });

            // Stop searching state when data arrives
            setIsSearching(false);
        }
    }, [data]);

    // Handle loading state changes
    useEffect(() => {
        if (isLoading && searchQuery) {
            setIsSearching(true);
        } else if (!isLoading) {
            setIsSearching(false);
        }
    }, [isLoading, searchQuery]);

    // Handle error state
    useEffect(() => {
        if (isError) {
            setIsSearching(false);
        }
    }, [isError]);

    const searchModels = async (newQuery: string) => {
        if (!newQuery.trim()) return;

        // Start searching state immediately
        setIsSearching(true);

        // If it's a new search query, reset the page number and clear results
        if (newQuery !== searchQuery) {
            setCurrentPageNumber(1);
            setResponse(initialResponseData); // Clear results immediately
            lastSearchQuery.current = newQuery; // Track the new query
        }

        hasSearched.current = true;
        setSearchQuery(newQuery);
        refetch();
    };

    // Modified condition for showing "no results" message
    const shouldShowNoResults = hasSearched.current &&
        !isSearching &&
        !isLoading &&
        response.results.length === 0 &&
        !isError &&
        searchQuery.trim() !== '';

    return {
        isLoading,
        error,
        isSearching,
        SearchBar: () => <SearchBar
            onSearch={searchModels}
            currentQuery={searchQuery}
            isSearching={isSearching}
        />,
        models: response.results,
        nextUrl: response.next,
        previousUrl: response.previous,
        count: response.count,
        ModelLoadingUtils: () => <ModelLoadingUtils
            hasNext={response.next != null}
            isLoading={isLoading}
            modelsLength={response.results.length}
            hasSearched={shouldShowNoResults} // Use the refined condition
            isError={isError}
            setCurrentPageNumber={setCurrentPageNumber}
        />
    }
}