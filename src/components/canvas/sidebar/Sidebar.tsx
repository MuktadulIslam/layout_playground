import { useState, useCallback } from "react"
import BoxObject from "../../objects/BoxObject"
import Car from "../../objects/Car"
import CarModel from "../../objects/Car2"
import Chair from "../../objects/Chair"
import ChildrenTableModel from "../../objects/ChildrenTableModel"
import CustomObject from "../../objects/CustomObject"
import Table from "../../objects/Table"
import TableModel from "../../objects/TableModel"
import SketchfabSearchSideBar from '../sketchfab/SketchhfabSearchSideBar';
import SidebarHeader from "./SidebarHeader"
import SidebarGroupedObjects from "./SidebarGroupedObjects"
import { DraggableObjectGroup, DraggableObjectData } from './types'
import DeskSign from "@/components/objects/craftxr/DeskSign"
import DisabilityButton from "@/components/objects/craftxr/DisabilityButton"
import FaxMachine from "@/components/objects/craftxr/FaxMachine"
import Keyboard from "@/components/objects/craftxr/Keyboard"
import Monitor from "@/components/objects/craftxr/Monitor"
import Monstera from "@/components/objects/craftxr/Monstera"
import Mouse from "@/components/objects/craftxr/Mouse"
import MudMat from "@/components/objects/craftxr/MudMat"
import OldRecepDesk from "@/components/objects/craftxr/OldRecepDesk"
import Pen from "@/components/objects/craftxr/Pen"
import Printer from "@/components/objects/craftxr/Printer"
import ReceptionDesk from "@/components/objects/craftxr/ReceptionDesk"
import Succulent from "@/components/objects/craftxr/Succulent"
import TissueBox from "@/components/objects/craftxr/TissueBox"
import WaitingBench from "@/components/objects/craftxr/WaitingBench"
import Wheelchair from "@/components/objects/craftxr/Wheelchair"
import Dynamic3DModel from "./Dynamic3DModel"

interface UploadedFile {
    id: string;
    name: string;
    url: string;
    fileType: 'glb' | 'fbx';
    uploadDate: Date;
}

export default function Sidebar(
    { onDragStart }:
        { onDragStart: (component: React.ReactNode, dragData: string) => void }
) {
    const [showSketchfabSearch, setShowSketchfabSearch] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleFileUpload = useCallback((file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() as 'glb' | 'fbx';
        const fileUrl = URL.createObjectURL(file);

        const uploadedFile: UploadedFile = {
            id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            url: fileUrl,
            fileType: fileExtension,
            uploadDate: new Date()
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
    }, []);

    // Convert uploaded files to draggable objects
    const uploadedObjects: DraggableObjectData[] = uploadedFiles.map(file => ({
        id: file.id,
        component: <Dynamic3DModel url={file.url} fileType={file.fileType} />,
        name: file.name,
        icon: file.fileType === 'glb' ? '📦' : '🎭',
        description: `Uploaded ${file.fileType.toUpperCase()} model`
    }));

    const objectGroups: DraggableObjectGroup[] = [
        // Add uploaded files group if there are any uploaded files
        ...(uploadedFiles.length > 0 ? [{
            id: 'uploaded',
            name: 'Uploaded Models',
            icon: '☁️',
            color: 'from-emerald-500 to-teal-500',
            objects: uploadedObjects
        }] : []),
        {
            id: 'vehicles',
            name: 'Vehicles',
            icon: '🚗',
            color: 'from-blue-500 to-cyan-500',
            objects: [
                {
                    id: 'car',
                    component: <Car />,
                    name: 'Car',
                    icon: '🚗',
                    description: 'Simple car object'
                },
                {
                    id: 'car-2',
                    component: <CarModel />,
                    name: 'GLB Car Model',
                    icon: '🏎️',
                    description: 'Detailed car model'
                }
            ]
        },
        {
            id: 'furniture',
            name: 'Furniture',
            icon: '🪑',
            color: 'from-amber-500 to-orange-500',
            objects: [
                {
                    id: 'table',
                    component: <Table />,
                    name: 'Table',
                    icon: '🪑',
                    description: 'Basic table geometry'
                },
                {
                    id: 'table model',
                    component: <TableModel />,
                    name: 'GLB Table Model',
                    icon: '🗂️',
                    description: 'Detailed table model'
                },
                {
                    id: 'children table model',
                    component: <ChildrenTableModel />,
                    name: 'GLB Children Table',
                    icon: '🧸',
                    description: 'Child-sized table model'
                },
                {
                    id: 'chair',
                    component: <Chair />,
                    name: 'Chair',
                    icon: '💺',
                    description: 'Basic chair geometry'
                }
            ]
        },
        {
            id: 'primitives',
            name: 'Primitives',
            icon: '📦',
            color: 'from-green-500 to-emerald-500',
            objects: [
                {
                    id: 'box',
                    component: <BoxObject />,
                    name: 'Box',
                    icon: '📦',
                    description: 'Basic cube geometry'
                }
            ]
        },
        {
            id: 'custom',
            name: 'Custom',
            icon: '⚡',
            color: 'from-purple-500 to-pink-500',
            objects: [
                {
                    id: 'custom',
                    component: <CustomObject />,
                    name: 'Custom Object',
                    icon: '⚡',
                    description: 'Custom 3D object'
                }
            ]
        },
        {
            id: 'xr-models',
            name: 'XR-Models',
            icon: '🏢',
            color: 'from-indigo-500 to-purple-500',
            objects: [
                {
                    id: 'desk-sign',
                    component: <DeskSign />,
                    name: 'Desk Sign',
                    icon: '🪧',
                    description: 'Desktop nameplate or information sign'
                },
                {
                    id: 'disability-button',
                    component: <DisabilityButton />,
                    name: 'Accessibility Button',
                    icon: '♿',
                    description: 'Disability access button for doors'
                },
                {
                    id: 'fax-machine',
                    component: <FaxMachine />,
                    name: 'Fax Machine',
                    icon: '📠',
                    description: 'Office fax machine'
                },
                {
                    id: 'keyboard',
                    component: <Keyboard />,
                    name: 'Keyboard',
                    icon: '⌨️',
                    description: 'Computer keyboard'
                },
                {
                    id: 'monitor',
                    component: <Monitor />,
                    name: 'Monitor',
                    icon: '🖥️',
                    description: 'Computer display monitor'
                },
                {
                    id: 'monstera',
                    component: <Monstera />,
                    name: 'Monstera Plant',
                    icon: '🌱',
                    description: 'Decorative monstera house plant'
                },
                {
                    id: 'mouse',
                    component: <Mouse />,
                    name: 'Computer Mouse',
                    icon: '🖱️',
                    description: 'Computer pointing device'
                },
                {
                    id: 'mud-mat',
                    component: <MudMat />,
                    name: 'Floor Mat',
                    icon: '🧽',
                    description: 'Entrance floor mat'
                },
                {
                    id: 'old-reception-desk',
                    component: <OldRecepDesk />,
                    name: 'Vintage Reception Desk',
                    icon: '🗃️',
                    description: 'Classic style reception desk'
                },
                {
                    id: 'pen',
                    component: <Pen />,
                    name: 'Pen',
                    icon: '🖊️',
                    description: 'Writing pen'
                },
                {
                    id: 'printer',
                    component: <Printer />,
                    name: 'Printer',
                    icon: '🖨️',
                    description: 'Office printer'
                },
                {
                    id: 'reception-desk',
                    component: <ReceptionDesk />,
                    name: 'Reception Desk',
                    icon: '🏪',
                    description: 'Modern reception desk'
                },
                {
                    id: 'succulent',
                    component: <Succulent />,
                    name: 'Succulent Plant',
                    icon: '🌵',
                    description: 'Small decorative succulent'
                },
                {
                    id: 'tissue-box',
                    component: <TissueBox />,
                    name: 'Tissue Box',
                    icon: '📄',
                    description: 'Box of tissues'
                },
                {
                    id: 'waiting-bench',
                    component: <WaitingBench />,
                    name: 'Waiting Bench',
                    icon: '🪑',
                    description: 'Seating bench for waiting areas'
                },
                {
                    id: 'wheelchair',
                    component: <Wheelchair />,
                    name: 'Wheelchair',
                    icon: '♿',
                    description: 'Mobility wheelchair'
                }
            ]
        }
    ];

    return (
        <div>
            <SketchfabSearchSideBar show={showSketchfabSearch} setShow={setShowSketchfabSearch} />

            <div className="absolute left-0 top-0 h-full w-80 bg-gray-900/90 backdrop-blur-md text-white flex flex-col z-40 shadow-2xl border-r border-gray-700/50 overflow-hidden">
                <SidebarHeader
                    setShowSketchfabSearch={setShowSketchfabSearch}
                    onFileUpload={handleFileUpload}
                />

                <SidebarGroupedObjects
                    objectGroups={objectGroups}
                    onDragStart={onDragStart}
                />

                {/* Footer */}
                <div className="p-2 border-t border-gray-700/30 bg-gradient-to-r from-gray-900 to-gray-800">
                    <div className="w-full text-center text-xs text-gray-400">🔧 Ctrl+Shift+Z to toggle controls</div>
                </div>
            </div>
        </div>
    )
}