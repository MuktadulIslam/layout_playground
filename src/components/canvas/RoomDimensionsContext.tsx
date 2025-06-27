import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the room dimensions interface
// length means the length of x-axis 
// width means the length of z-axis 
// height means the length of y-axis
interface RoomDimensions {
    length: number;
    width: number;
    height: number;
}

// Define the context value interface
interface RoomContextValue {
    dimensions: RoomDimensions;
    setHeight: (height: number) => void;
    setLength: (length: number) => void;
    setWidth: (width: number) => void;
    setDimensions: (dimensions: RoomDimensions) => void;
    resetDimensions: () => void;
}

// Default room dimensions
const defaultDimensions: RoomDimensions = {
    height: 5,
    length: 25,
    width: 20,
};

// Create the context
const RoomContext = createContext<RoomContextValue | undefined>(undefined);

// Custom hook to use the room context
export const useRoomContext = (): RoomContextValue => {
    const context = useContext(RoomContext);

    if (context === undefined) {
        throw new Error('useRoomContext must be used within a RoomProvider');
    }

    return context;
};

// Provider props interface
interface RoomProviderProps {
    children: ReactNode;
    initialDimensions?: Partial<RoomDimensions>;
}

// Room Context Provider component
export const RoomProvider: React.FC<RoomProviderProps> = ({
    children,
    initialDimensions = {}
}) => {
    const [dimensions, setDimensionsState] = useState<RoomDimensions>({
        ...defaultDimensions,
        ...initialDimensions,
    });

    // Individual setters
    const setHeight = (height: number) => {
        setDimensionsState(prev => ({ ...prev, height }));
    };

    const setLength = (length: number) => {
        setDimensionsState(prev => ({ ...prev, length }));
    };

    const setWidth = (width: number) => {
        setDimensionsState(prev => ({ ...prev, width }));
    };

    // Set all dimensions at once
    const setDimensions = (newDimensions: RoomDimensions) => {
        setDimensionsState(newDimensions);
    };

    // Reset to default values
    const resetDimensions = () => {
        setDimensionsState(defaultDimensions);
    };

    const contextValue: RoomContextValue = {
        dimensions,
        setHeight,
        setLength,
        setWidth,
        setDimensions,
        resetDimensions,
    };

    return (
        <RoomContext.Provider value={contextValue}>
            {children}
        </RoomContext.Provider>
    );
};

// Export types for external use
export type { RoomDimensions, RoomContextValue };