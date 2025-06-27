import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SelectableObject } from './types';

interface MeshContextType {
  selectedObject: SelectableObject;
  setObject: (object: SelectableObject) => void;
  clearObject: () => void;
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
  const [selectedObject, setSelectedObject] = useState<SelectableObject>(null);

  const setObject = (object: SelectableObject) => {
    setSelectedObject(object);
  };

  const clearObject = () => {
    setSelectedObject(null);
  };

  const value: MeshContextType = {
    selectedObject,
    setObject,
    clearObject,
  };

  return (
    <MeshContext.Provider value={value}>
      {children}
    </MeshContext.Provider>
  );
};