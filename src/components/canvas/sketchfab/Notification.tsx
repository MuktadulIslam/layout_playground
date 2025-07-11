import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export default function Notification({
    message,
    type,
    duration = 3000,
    onClose
}: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setIsVisible(true);

        // Auto-close after duration
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'info':
            default:
                return <AlertCircle size={20} className="text-blue-500" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 border-green-700 text-green-100';
            case 'error':
                return 'bg-red-500 border-red-700 text-red-100';
            case 'info':
            default:
                return 'bg-blue-500 border-blue-700 text-blue-100';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ${isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0'
                }`}
        >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md ${getColorClasses()}`}>
                {getIcon()}
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-300 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

// Notification Manager Component
interface NotificationData {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface NotificationManagerProps {
    notifications: NotificationData[];
    removeNotification: (id: string) => void;
}

export function NotificationManager({
    notifications,
    removeNotification
}: NotificationManagerProps) {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
}