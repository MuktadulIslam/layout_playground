import { X } from 'lucide-react';

interface SidebarHeaderProps {
    setShow: (show: boolean) => void;
}

export default function SidebarHeader({ setShow }: SidebarHeaderProps) {
    return (<>
        <div className="text-center mb-5 mt-3 relative">
            <button
                onClick={() => setShow(false)}
                className="top-[-2] right-2 absolute bg-gradient-to-br from-red-600/60 via-red-400/60 to-stone-400/80 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
            >
                <X size={20} />
            </button>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Explore & Download 3D Models
            </h1>
            <p className="text-base text-gray-300 max-w-3xl mx-auto">
                {"Discover amazing free and downloadable 3D models from Sketchfab's vast collection"}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-sm">
                💡 Tip: You may need a free Sketchfab account to download models
            </div>
        </div>
    </>)
}