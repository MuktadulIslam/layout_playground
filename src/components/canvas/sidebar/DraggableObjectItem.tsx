import { DraggableObjectData } from "./types";

interface DraggableObjectItemProps {
    object: DraggableObjectData;
    groupColor: string;
    onDragStart: (component: React.ReactNode) => void;
}

export default function DraggableObjectItem({ object, groupColor, onDragStart }: DraggableObjectItemProps) {
    return (
        <div
            className="group/item relative flex items-center p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg cursor-grab hover:bg-gray-700/70 transition-all duration-300 border border-gray-700/20 hover:border-gray-600/40 hover:shadow-md hover:shadow-gray-900/20 hover:scale-[1.01] active:scale-[0.98] ml-4"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', object.id)
                onDragStart(object.component)
            }}
        >
            {/* Drag indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-60 transition-opacity duration-200">
                <div className="flex flex-col gap-0.5">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
            </div>

            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 mr-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-lg group-hover/item:from-gray-600 group-hover/item:to-gray-700 transition-all duration-300 shadow-inner">
                {object.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h5 className="font-medium text-white group-hover/item:text-blue-200 transition-colors duration-200 truncate text-sm">
                    {object.name}
                </h5>
                <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200 truncate">
                    {object.description}
                </p>
            </div>

            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${groupColor.replace('from-', 'from-').replace('to-', 'to-')}/3 rounded-lg opacity-0 group-hover/item:opacity-50 transition-opacity duration-300 pointer-events-none`}></div>
        </div>
    );
}