import { NextRequest, NextResponse } from 'next/server';
import Cookies from 'js-cookie';
import { sketchfabToken, sketchfabTokenMaxAge } from '../config'

export const setAccessToken = (accessToken: string, response: NextResponse, maxAge: number = sketchfabTokenMaxAge) => {
    response.cookies.set(sketchfabToken.accessToken, accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: maxAge || 2592000, // Use expires_in from response or default to 30 days
        sameSite: 'lax', // Changed from 'strict' to 'lax' for OAuth compatibility
        secure: process.env.NODE_ENV === 'production'
    });
};
export const setRefreshToken = (refreshToken: string, response: NextResponse, maxAge: number = sketchfabTokenMaxAge) => {
    response.cookies.set(sketchfabToken.refreshToken, refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: maxAge || 2592000, // Use expires_in from response or default to 30 days
        sameSite: 'lax', // Changed from 'strict' to 'lax' for OAuth compatibility
        secure: process.env.NODE_ENV === 'production'
    });
};

export const getAccessToken = (): string | null => {
    return Cookies.get(sketchfabToken.accessToken) ?? null;
};
export const getRefreshToken = (): string | null => {
    return Cookies.get(sketchfabToken.refreshToken) ?? null;
};

export const getAccessTokenFromRequest = (request: NextRequest): string | undefined => {
    return request.cookies.get(sketchfabToken.accessToken)?.value;
}
export const getRefreshTokenFromRequest = (request: NextRequest): string | undefined => {
    return request.cookies.get(sketchfabToken.refreshToken)?.value;
}


export const deleteAccessToken = () => {
    Cookies.remove(sketchfabToken.accessToken);
};
export const deleteRefreshToken = () => {
    Cookies.remove(sketchfabToken.refreshToken);
};
export const deleteTokens = () => {
    deleteAccessToken();
    deleteRefreshToken();
}