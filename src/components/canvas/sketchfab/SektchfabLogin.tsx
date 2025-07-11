import { FaBoxesStacked } from "react-icons/fa6";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { SiAdobecreativecloud } from "react-icons/si";
import { useAuth } from "./store/hooks/useAuth";

export default function SketchfabLogin() {
    const { checkAuth } = useAuth();

    return <>
        <div className="w-full pt-32 px-4">
            <div className="text-center">
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        const width = 600;
                        const height = 700;
                        const left = (window.screen.width - width) / 2;
                        const top = (window.screen.height - height) / 2;

                        const popup = window.open(
                            '/api/sketchfab/login',
                            'popup',
                            `width=${width},height=${height},left=${left},top=${top}`
                        );

                        if (popup) {
                            // Check if popup is closed
                            const checkClosed = setInterval(() => {
                                if (popup.closed) {
                                    clearInterval(checkClosed);
                                    checkAuth();
                                }
                            }, 1000);
                        }
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
                >
                    Login With Your Sketchfab Account
                </a>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-4 *:rounded-2xl *:bg-gray-300/40 *:p-5">
                <div className="text-center">
                    <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBoxesStacked size={30} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Search Models</h3>
                    <p className="text-sm text-gray-600">Browse over 1 million free 3D models with advanced search filters</p>
                </div>

                <div className="text-center">
                    <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PiDownloadSimpleBold size={30} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Download Instantly</h3>
                    <p className="text-sm text-gray-600">Download models in glTF, GLB, or USDZ formats ready for your projects</p>
                </div>

                <div className="text-center">
                    <div className="bg-[#69ffe6b7] text-[#005648] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SiAdobecreativecloud size={30} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Creative Commons</h3>
                    <p className="text-sm text-gray-600">All downloadable models are free to use under Creative Commons licenses</p>
                </div>
            </div>
        </div>
    </>
}