import { NextRequest, NextResponse } from 'next/server';
import { sketchfabToken } from '@/components/canvas/sketchfab/config';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const response = NextResponse.json({
            message: 'Successfully logged out'
        }, {
            status: 200
        });

        // Clear both access and refresh tokens
        response.cookies.delete(sketchfabToken.accessToken);
        response.cookies.delete(sketchfabToken.refreshToken);

        console.log('User logged out successfully');
        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}