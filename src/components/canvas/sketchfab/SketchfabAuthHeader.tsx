// src/components/canvas/sketchfab/SketchfabAuthHeader.tsx
import { LogOut, User } from 'lucide-react';
import { useSketchfabAuth } from './context/SketchfabAuthContext';

interface SketchfabAuthHeaderProps {
    onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function SketchfabAuthHeader({ onNotify }: SketchfabAuthHeaderProps) {
    const { user, logout, loading } = useSketchfabAuth();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout from Sketchfab?')) {
            try {
                await logout();
                onNotify?.('Successfully logged out from Sketchfab', 'success');
            } catch (error) {
                console.error('Logout failed:', error);
                onNotify?.('Failed to logout from Sketchfab', 'error');
            }
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm">
                        {user?.name || user?.username || 'Sketchfab User'}
                    </h3>
                    <p className="text-gray-300 text-xs">Connected to Sketchfab</p>
                </div>
            </div>

            <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-600/90 text-white text-xs rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout from Sketchfab"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <LogOut size={14} />
                )}
                <span>Logout</span>
            </button>
        </div>
    );
}