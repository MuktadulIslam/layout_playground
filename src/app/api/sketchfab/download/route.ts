import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { getAccessTokenFromRequest } from '@/components/canvas/sketchfab/utils/authToken';
import { downloadAPIConfig as config } from '@/components/canvas/sketchfab/config';

interface RequestBody {
    modelUid: string;
}

interface SketchfabErrorResponse {
    detail?: string;
    error?: string;
    message?: string;
}

export async function POST(request: NextRequest) {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let requestBody: RequestBody;

    try {
        requestBody = await request.json();
    } catch (parseError) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { modelUid } = requestBody;

    if (!modelUid) {
        return NextResponse.json({ error: 'Model UID required' }, { status: 400 });
    }

    try {
        // Request download URLs from Sketchfab
        const response = await axios.get(
            `${config.apiBaseUrl}/models/${modelUid}/download`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Download request error:', error);

        // Type guard for AxiosError
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<SketchfabErrorResponse>;
            const errorMessage = axiosError.response?.data?.detail ||
                axiosError.response?.data?.error ||
                axiosError.response?.data?.message ||
                'Download request failed';

            return NextResponse.json(
                { error: errorMessage },
                { status: axiosError.response?.status || 500 }
            );
        }

        // Handle non-Axios errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}