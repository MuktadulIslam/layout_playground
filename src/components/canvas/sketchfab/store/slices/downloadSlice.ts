import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DownloadState } from '../types/download';

export const downloadModelWithOptions = createAsyncThunk(
    'download/downloadWithOptions',
    async (modelUid: string, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/sketchfab/download', {
                modelUid: modelUid
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.error || 'Download options fetch failed');
            }
            return rejectWithValue('Download options fetch failed');
        }
    }
);

export const downloadSpecificFormat = createAsyncThunk(
    'download/downloadFormat',
    async ({ url, filename, format }: { url: string; filename: string; format: string }, { rejectWithValue }) => {
        try {
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return { filename: `${filename}.${format}`, format };
        } catch {
            return rejectWithValue('Download failed');
        }
    }
);

const initialDownloadState: DownloadState = {
    isLoading: false,
    isError: false,
    error: null,
};

const downloadSlice = createSlice({
    name: 'download',
    initialState: initialDownloadState,
    reducers: {
        clearDownloadError: (state) => {
            state.error = null;
        },
        resetDownloadState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Direct Download Model
            .addCase(downloadSpecificFormat.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(downloadSpecificFormat.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
            })
            .addCase(downloadSpecificFormat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload as string;
            })

            // Download with Options (for modal)
            .addCase(downloadModelWithOptions.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(downloadModelWithOptions.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.error = null;
            })
            .addCase(downloadModelWithOptions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload as string;
            })
    }
});

export const { clearDownloadError, resetDownloadState } = downloadSlice.actions;
export default downloadSlice.reducer;