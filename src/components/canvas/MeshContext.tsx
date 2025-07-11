import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SelectableObject, PlacedObject } from './types';

interface MeshContextType {
  // Objects management
  objects: PlacedObject[];
  setObjects: React.Dispatch<React.SetStateAction<PlacedObject[]>>;
  addObject: (object: PlacedObject) => void;
  removeObject: (objectId: string) => void;

  // Selected object management
  selectedObject: SelectableObject;
  selectedObjectId: string | null;
  setObject: (object: SelectableObject, objectId: string) => void;
  clearObject: () => void;

  // Position fixing callback (set by the selected DraggableObject)
  fixedRingRadius: (() => void) | null;
  setFixedRingRadiusCallback: (callback: (() => void) | null) => void;

  // Object controls visibility
  isObjectControlsVisible: boolean;
}

const MeshContext = createContext<MeshContextType | undefined>(undefined);

export const useMeshContext = () => {
  const context = useContext(MeshContext);
  if (context === undefined) {
    throw new Error('useMeshContext must be used within a MeshProvider');
  }
  return context;
};

interface MeshProviderProps {
  children: ReactNode;
}

export function MeshProvider({ children }: MeshProviderProps) {
  // Objects state
  const [objects, setObjects] = useState<PlacedObject[]>([]);

  // Selected object state
  const [selectedObject, setSelectedObject] = useState<SelectableObject>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Position fixing callback
  const [fixedRingRadius, setFixedRingRadiusCallback] = useState<(() => void) | null>(null);

  // Object controls visibility
  const [isObjectControlsVisible, setObjectControlsVisible] = useState<boolean>(false);

  // Helper functions
  const addObject = (object: PlacedObject) => {
    setObjects(prev => [...prev, object]);
  };

  const removeObject = (objectId: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== objectId));

    // If the deleted object is currently selected, clear selection
    if (selectedObjectId === objectId) {
      clearObject();
    }
  };

  const setObject = (object: SelectableObject, objectId: string) => {
    setSelectedObject(object);
    setSelectedObjectId(objectId);
    setObjectControlsVisible(true);
  };

  const clearObject = () => {
    setSelectedObject(null);
    setSelectedObjectId(null);
    setObjectControlsVisible(false);
    setFixedRingRadiusCallback(null);
  };

  const value: MeshContextType = {
    objects,
    setObjects,
    addObject,
    removeObject,
    selectedObject,
    selectedObjectId,
    setObject,
    clearObject,
    fixedRingRadius,
    setFixedRingRadiusCallback,
    isObjectControlsVisible,
  };

  return (
    <MeshContext.Provider value={value}>
      {children}
    </MeshContext.Provider>
  );
}