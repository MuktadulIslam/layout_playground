import BoxObject from "../objects/BoxObject"
import Car from "../objects/Car"
import Chair from "../objects/Chair"
import CustomObject from "../objects/CustomObject"
import Table from "../objects/Table"

export default function Sidebar(
    { onDragStart }:
        { onDragStart: (component: React.ReactNode) => void }
) {
    return (
        <div className="absolute left-0 top-0 h-full w-64 bg-gray-900/80 backdrop-blur-sm text-white p-4 flex flex-col z-50 rounded-r-lg shadow-xl border-r border-gray-700">
            <h2 className="text-xl font-bold mb-1 text-center">3D Objects</h2>
            <p className="text-xs mb-5">🔧 Ctrl+Shift+S to toggle controls</p>

            <h3 className="text-sm uppercase tracking-wider mb-3 opacity-70">Objects</h3>
            <div className="flex flex-col gap-3">
                <div
                    className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'box')
                        onDragStart(<BoxObject />)
                    }}
                >
                    <div className="w-5 h-5 mr-3 bg-white/80 rounded-sm"></div>
                    <span>Box</span>
                </div>

                <div
                    className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'car')
                        onDragStart(<Car />)
                    }}
                >
                    <div className="w-6 h-4 mr-3 bg-white/80 rounded-sm"></div>
                    <span>Car</span>
                </div>

                <div
                    className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'table')
                        onDragStart(<Table />)
                    }}
                >
                    <div className="w-5 h-3 mr-3 bg-white/80 rounded-sm"></div>
                    <span>Table</span>
                </div>

                <div
                    className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'chair')
                        onDragStart(<Chair />)
                    }}
                >
                    <div className="w-4 h-5 mr-3 bg-white/80 rounded-sm"></div>
                    <span>Chair</span>
                </div>

                <div
                    className="flex items-center p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors"
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', 'custom')
                        onDragStart(<CustomObject />)
                    }}
                >
                    <div className="w-4 h-4 mr-3 bg-white/80 rounded-full"></div>
                    <span>Custom</span>
                </div>
            </div>

            <div className="mt-auto text-xs opacity-50 text-center">
                Drag objects onto the plane
            </div>
        </div>
    )
}