import { useAppDispatch, useAppSelector } from '../redux';
import {
    downloadModelWithOptions,
    downloadSpecificFormat,
    clearDownloadError,
    resetDownloadState,
} from '../slices/downloadSlice';

export function useDownload() {
    const dispatch = useAppDispatch();
    const { isLoading, isError, error } = useAppSelector((state) => state.download);

    const getDownloadOptions = async (modelUid: string) => {
        return (await dispatch(downloadModelWithOptions(modelUid))).payload;
    };

    const downloadGLB = (downloadUrl: string, modelName: string = 'model') => {
        dispatch(downloadSpecificFormat({
            url: downloadUrl,
            filename: modelName,
            format: 'glb'
        }));
    };

    const downloadFBX = (downloadUrl: string, modelName: string = 'model') => {
        dispatch(downloadSpecificFormat({
            url: downloadUrl,
            filename: modelName,
            format: 'zip'
        }));
    };

    const downloadGLTF = (downloadUrl: string, modelName: string = 'model') => {
        dispatch(downloadSpecificFormat({
            url: downloadUrl,
            filename: modelName,
            format: 'zip'
        }));
    };

    const downloadUSDZ = (downloadUrl: string, modelName: string = 'model') => {
        dispatch(downloadSpecificFormat({
            url: downloadUrl,
            filename: modelName,
            format: 'usdz'
        }));
    };

    const clearError = () => {
        dispatch(clearDownloadError());
    };

    const resetDownload = () => {
        dispatch(resetDownloadState());
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
        isLoading,
        isError,
        error,
        getDownloadOptions,
        downloadGLB,
        downloadFBX,
        downloadGLTF,
        downloadUSDZ,
        clearError,
        resetDownload,
        formatFileSize
    };
}