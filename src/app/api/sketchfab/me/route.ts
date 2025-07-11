import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { downloadAPIConfig } from '@/components/canvas/sketchfab/config';
import { getAccessTokenFromRequest } from '@/components/canvas/sketchfab/utils/authToken';

export async function GET(request: NextRequest): Promise<NextResponse> {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
        console.log('No access token found in cookies');
        return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    try {
        const response = await axios.get(`${downloadAPIConfig.apiBaseUrl}/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            timeout: 10000, // 10 second timeout
        });
        return NextResponse.json(response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error('API call error:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            data: axiosError.response?.data
        });

        if (axiosError.response?.status === 401) {
            console.log('Access token expired or invalid');
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}