import { useState } from "react";
import DraggableObjectItem from "./DraggableObjectItem";
import { DraggableObjectGroup } from "./types";

interface SidebarGroupedObjectsProps {
    objectGroups: DraggableObjectGroup[];
    onDragStart: (component: React.ReactNode) => void;
}

export default function SidebarGroupedObjects({ objectGroups, onDragStart }: SidebarGroupedObjectsProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    return (
        <>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                        Library
                    </h3>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
                </div>

                <div className="space-y-3">
                    {objectGroups.map((group, index) => (
                        <div key={index} className="bg-gray-800/40 rounded-xl border border-gray-700/40 overflow-hidden">
                            {/* Group Header */}
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center text-lg shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                                        {group.icon}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-white group-hover:text-gray-100">
                                            {group.name}
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            {group.objects.length} item{group.objects.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className={`transform transition-transform duration-200 ${expandedGroups[group.id] ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Expandable Objects List */}
                            <div className={`transition-all duration-300 ease-in-out ${expandedGroups[group.id]
                                ? 'opacity-100'
                                : 'max-h-0 opacity-0'
                                } overflow-hidden`}>
                                <div className="px-2 pb-2 space-y-2">
                                    {group.objects.map((obj, index) => (
                                        <DraggableObjectItem
                                            key={index}
                                            object={obj}
                                            groupColor={group.color}
                                            onDragStart={onDragStart}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}