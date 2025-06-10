// Types for room elements
export type WallType = 'front' | 'back' | 'left' | 'right';
export type WallDecorationType = 'door' | 'window' | 'decoration';

export interface Position3D {
    x: number;
    y: number;
    z: number;
}

export interface Size2D {
    width: number;
    height: number;
}

export interface Door {
    id: string;
    wall: WallType;
    
    // New positioning system - distance from left side of wall
    fromLeftSide: number; // Absolute distance from left edge of wall
    fromFloor: number; // Height from floor (default: 0)
    
    // Legacy positioning system - kept for backward compatibility
    position?: number; // Position along the wall (0 = start, 1 = end)
    
    width: number;
    height: number;
    color?: string;
    thickness?: number;
}

export interface Window {
    id: string;
    wall: WallType;
    
    // New positioning system - distance from left side of wall
    fromLeftSide: number; // Absolute distance from left edge of wall
    fromFloor: number; // Height from floor (required for windows)
    
    // Legacy positioning system - kept for backward compatibility
    position?: number; // Position along the wall (0 = start, 1 = end)
    
    width: number;
    height: number;
    color?: string;
    frameColor?: string;
    frameThickness?: number;
}

export interface WallDecoration {
    id: string;
    wall: WallType;
    
    // New positioning system - distance from left side of wall
    fromLeftSide: number; // Absolute distance from left edge of wall
    fromFloor: number; // Height from floor (required)
    
    // Legacy positioning system - kept for backward compatibility
    position?: number; // Position along the wall (0 = start, 1 = end)
    
    width: number;
    height: number;
    color?: string;
    type: 'picture' | 'mirror' | 'shelf' | 'custom';
    depth?: number;
}

export interface RoomConfig {
    dimensions: {
        width: number;
        length: number; // room depth
        height: number;
    };
    doors: Door[];
    windows: Window[];
    wallDecorations: WallDecoration[];
    colors: {
        floor: string;
        ceiling: string;
        walls: string;
        alternateFloor?: string;
    };
}

// Component prop interfaces
export interface FloorTileProps {
    position: [number, number, number];
    isAlternate: boolean;
    color: string;
    alternateColor: string;
}

export interface WallWithOpeningsProps {
    wall: WallType;
    roomWidth: number;
    roomLength: number;
    roomHeight: number;
    color: string;
    doors: Door[];
    windows: Window[];
    wallDecorations: WallDecoration[];
}

export interface TiledFloorProps {
    width: number;
    length: number;
    color: string;
    alternateColor?: string;
}