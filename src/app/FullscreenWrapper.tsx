'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface FullscreenWrapperProps {
    children: ReactNode;
    className?: string;
}

export default function FullscreenWrapper({
    children,
    className = ''
}: FullscreenWrapperProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Toggle fullscreen function
    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                if (containerRef.current) {
                    await containerRef.current.requestFullscreen();
                }
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    };

    // F key handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'F' || event.key === 'f') {
                if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
                    const activeElement = document.activeElement;
                    const isInputFocused = activeElement && (
                        activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA' ||
                        (activeElement as HTMLElement).contentEditable === 'true'
                    );

                    if (!isInputFocused) {
                        event.preventDefault();
                        toggleFullscreen();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${className} ${isFullscreen ? 'fixed inset-0 z-[9999]' : ''}`}
        >
            {children}
        </div>
    );
}