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
    currentQuery: string; // Add this to pass the current search query
}

function SearchBar({ onSearch, currentQuery }: SearchBarProps) {
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
                    className="w-full px-6 py-2 text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
            </div>
        </div>
    );
}

export default function SearchBarUtils() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const hasSearched = useRef<boolean>(false);
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
            })
        };
    }, [data])

    const searchModels = async (newQuery: string) => {
        // If it's a new search query, reset the page number
        if (newQuery !== searchQuery) {
            setCurrentPageNumber(1);
            setResponse(initialResponseData)
        }

        hasSearched.current = true;
        setSearchQuery(newQuery);
        refetch();
    };

    return {
        isLoading,
        error,
        SearchBar: () => <SearchBar onSearch={searchModels} currentQuery={searchQuery} />,
        models: response.results,
        nextUrl: response.next,
        previousUrl: response.previous,
        count: response.count,
        ModelLoadingUtils: () => <ModelLoadingUtils
            hasNext={response.next != null}
            isLoading={isLoading}
            modelsLength={response.results.length}
            hasSearched={hasSearched.current}
            isError={isError}
            setCurrentPageNumber={setCurrentPageNumber}
        />
    }
}