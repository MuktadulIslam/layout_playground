import { RoomConfig } from "./types"

export function getRoomConfig(width: number, length: number): RoomConfig {
    return {
        dimensions: {
            length: length || 15,
            width: width || 10,
            height: 5
        },
        colors: {
            floor: "#f5f5f5",
            alternateFloor: "#e8e8e8",
            ceiling: "#ffffff",
            walls: "#e8e8e8"
        },
        // Updated examples using new positioning system
        doors: [
            {
                id: 'main-door',
                wall: 'front' as const,
                fromLeftSide: 6, // 6 units from left side of wall
                fromFloor: 0, // At floor level
                width: 2,
                height: 4,
                color: '#8B4513'
            },
            {
                id: 'back-door',
                wall: 'back' as const,
                fromLeftSide: 2, // 2 units from left side
                fromFloor: 0.5, // Slightly elevated (like a back door with a step)
                width: 1.8,
                height: 3.5,
                color: '#654321'
            }
        ],
        windows: [
            {
                id: 'window-1',
                wall: 'left' as const,
                fromLeftSide: 2, // 2 units from left side of wall
                fromFloor: 2, // 2 units from floor
                width: 3,
                height: 2,
                color: '#87CEEB'
            },
            {
                id: 'window-2',
                wall: 'right' as const,
                fromLeftSide: 4, // 4 units from left side
                fromFloor: 2.5, // 2.5 units from floor
                width: 2.5,
                height: 1.5,
                color: '#87CEEB'
            },
            {
                id: 'front-window',
                wall: 'front' as const,
                fromLeftSide: 1, // 1 unit from left side
                fromFloor: 1.5, // 1.5 units from floor
                width: 2,
                height: 2.5,
                color: '#B0E0E6'
            }
        ],
        wallDecorations: [
            {
                id: 'picture-1',
                wall: 'back' as const,
                fromLeftSide: 4, // 4 units from left side
                fromFloor: 3, // 3 units from floor
                width: 1.5,
                height: 1,
                color: '#FFD700',
                type: 'picture' as const
            },
            {
                id: 'mirror-1',
                wall: 'left' as const,
                fromLeftSide: 6, // 6 units from left side
                fromFloor: 2.5, // 2.5 units from floor
                width: 1,
                height: 1.5,
                color: '#C0C0C0',
                type: 'mirror' as const
            }
        ]
    };
}