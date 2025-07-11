import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserInfo, AuthState } from '../types/auth';

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/sketchfab/me');
            console.log("response data: ", response.data);

            const userData: UserInfo = {
                name: response.data.displayName || response.data.username,
                username: response.data.username,
                email: response.data.email || '',
                profileUrl: response.data.profileUrl || ''
            };

            return userData;
        } catch {
            return rejectWithValue('Authentication failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post('/api/sketchfab/logout');
            return null;
        } catch {
            return rejectWithValue('Logout failed');
        }
    }
);

const initialState: AuthState = {
    user: null,
    loading: true,
    authenticated: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuth: (state) => {
            state.user = null;
            state.authenticated = false;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action: PayloadAction<UserInfo>) => {
                state.loading = false;
                state.user = action.payload;
                state.authenticated = true;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.authenticated = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.authenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;