import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { checkAuth, logout as logoutAction, clearError } from '../slices/authSlice';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, loading, authenticated, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const logout = () => {
        dispatch(logoutAction());
    };

    const refetchAuth = () => {
        dispatch(checkAuth());
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    return {
        user,
        authenticated,
        loading,
        error,
        logout,
        checkAuth: refetchAuth,
        clearError: clearAuthError
    };
}
