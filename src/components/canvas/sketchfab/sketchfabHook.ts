import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SketchfabResponse } from '@/components/canvas/sketchfab/types'

const modelsOffsetLimit = 18;

const axiosInstance = axios.create({
    baseURL: 'https://api.sketchfab.com/v3',
    timeout: 30 * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useGetSketchfabModels = (searchQuery: string, pageNumber: number) => {
    return useQuery({
        queryKey: [`sketchfab-3d-models-${searchQuery}`, pageNumber],
        queryFn: async (): Promise<SketchfabResponse> => {
            const { data } = await axiosInstance.get(`/search?count=${modelsOffsetLimit}&cursor=${(pageNumber - 1) * modelsOffsetLimit}&downloadable=true&q=${encodeURIComponent(searchQuery)}&sort_by=-likeCount&type=models`);
            return data;
        },
        enabled: !!searchQuery && searchQuery.trim().length > 0, // Only run when searchQuery exists and is not empty

    });
};