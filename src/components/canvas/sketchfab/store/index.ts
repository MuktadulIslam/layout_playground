import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import downloadReducer from './slices/downloadSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        download: downloadReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;