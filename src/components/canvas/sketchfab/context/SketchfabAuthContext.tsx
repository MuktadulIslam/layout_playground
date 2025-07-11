// src/components/canvas/sketchfab/context/SketchfabAuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface UserInfo {
    name: string;
    username: string;
    email: string;
    profileUrl: string;
}

interface AuthContextType {
    user: UserInfo | null;
    loading: boolean;
    authenticated: boolean;
    error: string | null;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const SketchfabAuthContext = createContext<AuthContextType | undefined>(undefined);

interface SketchfabAuthProviderProps {
    children: ReactNode;
}

export function SketchfabAuthProvider({ children }: SketchfabAuthProviderProps) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasInitialized = useRef(false);
    const authCheckInProgress = useRef(false);

    const checkAuth = useCallback(async () => {
        // Prevent multiple simultaneous auth checks
        if (authCheckInProgress.current) {
            return;
        }

        authCheckInProgress.current = true;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/sketchfab/me');
            console.log("Auth response data: ", response.data);

            const userData: UserInfo = {
                name: response.data.displayName || response.data.username,
                username: response.data.username,
                email: response.data.email || '',
                profileUrl: response.data.profileUrl || ''
            };

            setUser(userData);
            setAuthenticated(true);
            setError(null);
        } catch (err) {
            console.log('Authentication failed - no access token');
            setUser(null);
            setAuthenticated(false);
            setError('Authentication required');
        } finally {
            setLoading(false);
            authCheckInProgress.current = false;
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.post('/api/sketchfab/logout');
            setUser(null);
            setAuthenticated(false);
            setError(null);
        } catch (err) {
            setError('Logout failed');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Only check auth once when the provider mounts
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            checkAuth();
        }
    }, [checkAuth]);

    const contextValue: AuthContextType = {
        user,
        loading,
        authenticated,
        error,
        checkAuth,
        logout,
        clearError
    };

    return (
        <SketchfabAuthContext.Provider value={contextValue}>
            {children}
        </SketchfabAuthContext.Provider>
    );
}

export function useSketchfabAuth() {
    const context = useContext(SketchfabAuthContext);
    if (context === undefined) {
        throw new Error('useSketchfabAuth must be used within a SketchfabAuthProvider');
    }
    return context;
}