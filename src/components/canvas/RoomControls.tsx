import React from 'react';

interface RoomControlsProps {
    length: number;
    width: number;
    onLengthChange: (length: number) => void;
    onWidthChange: (width: number) => void;
}

// Room controls component
export default function RoomControls({
    length,
    width,
    onLengthChange,
    onWidthChange,
}: RoomControlsProps) {
    const MAX_LENGTH = 40;
    const MIN_LENGTH = 6;
    const MAX_WIDTH = 40;
    const MIN_WIDTH = 6;

    const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= MIN_WIDTH && value <= MAX_WIDTH) {
            onWidthChange(value);
        }
    };

    const handleLengthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= MIN_LENGTH && value <= MAX_LENGTH) {
            onLengthChange(value);
        }
    };

    return (
        <div className="z-50 absolute top-5 right-5 text-white font-sans text-sm bg-gray-900/90 bg-opacity-80 p-5 rounded-lg w-[270px]">
            <h3 className="m-0 mb-4 text-white text-lg font-bold">Room Controls</h3>

            <div className="mb-4">
                <label className="block mb-1">
                    Length: {length} tiles
                </label>
                <div className="flex gap-2.5 items-center">
                    <input
                        type="range"
                        min={MIN_LENGTH}
                        max={MAX_LENGTH}
                        step="1"
                        value={length}
                        onChange={(e) => onLengthChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 rounded bg-gray-300 outline-none appearance-none slider"
                    />
                    <input
                        type="number"
                        min={MIN_LENGTH}
                        max={MAX_LENGTH}
                        value={length}
                        onChange={handleLengthInputChange}
                        className="w-12 p-1 rounded border border-gray-600 bg-gray-800 text-white text-xs"
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="block mb-1">
                    Width: {width} tiles
                </label>
                <div className="flex gap-2.5 items-center">
                    <input
                        type="range"
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        step="1"
                        value={width}
                        onChange={(e) => onWidthChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 rounded bg-gray-300 outline-none appearance-none slider"
                    />
                    <input
                        type="number"
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        value={width}
                        onChange={handleWidthInputChange}
                        className="w-12 p-1 rounded border border-gray-600 bg-gray-800 text-white text-xs"
                    />
                </div>
            </div>

            <div className="border-t border-gray-600 pt-4">
                <div className="text-xs opacity-80 mb-2.5">
                    <strong>Total tiles: {length * width}</strong>
                </div>
                <div className="text-xs opacity-80">
                    <div>⚙️ Scroll to zoom</div>
                    <div>🔧 Ctrl+Shift+Z to toggle controls</div>
                    <div>🔧 Ctrl+Shift+F to freeze the OrbitControls</div>
                </div>
            </div>
        </div>
    );
};