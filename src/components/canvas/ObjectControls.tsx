import React, { useState, useEffect } from 'react';
import { Mesh } from 'three';
import { SelectableObject } from './types';
import * as THREE from 'three'
import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";

interface ObjectControlsProps {
  object: SelectableObject;
  onClose: () => void;
  onDelete?: () => void;
}

export default function ObjectControls({
  object,
  onClose,
  onDelete
}: ObjectControlsProps) {
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [uniformScale, setUniformScale] = useState<number>(1);

  // Constants
  const MAX_SCALE = 4;
  const MIN_SCALE = 0.1;
  const rotationStepSize = 10

  // Initialize state from object properties
  useEffect(() => {
    if (object) {
      const objScale: [number, number, number] = [object.scale.x, object.scale.y, object.scale.z];
      setScale(objScale);
      setRotation([object.rotation.x, object.rotation.y, object.rotation.z]);

      // Check if scale is uniform and set uniform scale value
      if (objScale[0] === objScale[1] && objScale[1] === objScale[2]) {
        setUniformScale(objScale[0]);
      } else {
        setUniformScale(1); // Default when not uniform
      }
    }
  }, [object]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const updateObjectPosition = () => {
    if (!object) return;

    const box = new THREE.Box3().setFromObject(object)
    const size = new THREE.Vector3()
    box.getSize(size)
    const minEdge = box.min.clone();
    object.position.y -= minEdge.y;
  }

  const handleScaleChange = (axis: number, value: number) => {
    const clampedValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
    const newScale = [...scale] as [number, number, number];
    newScale[axis] = clampedValue;
    setScale(newScale);

    // Apply to object immediately
    if (object) {
      if (axis === 0) object.scale.x = clampedValue;
      else if (axis === 1) object.scale.y = clampedValue;
      else if (axis === 2) object.scale.z = clampedValue;
      updateObjectPosition();
    }
  };

  // Normalize rotation to keep it within -360 to 360 degrees
  const normalizeRotation = (degrees: number): number => {
    while (degrees > 360) degrees -= 360;
    while (degrees < -360) degrees += 360;
    return degrees;
  };

  const handleRotationChange = (axis: number, value: number) => {
    const normalizedDegrees = normalizeRotation(value);
    const radians = (normalizedDegrees * Math.PI) / 180;
    const newRotation = [...rotation] as [number, number, number];
    newRotation[axis] = radians;
    setRotation(newRotation);

    // Apply to object immediately
    if (object) {
      if (axis === 0) object.rotation.x = radians;
      else if (axis === 1) object.rotation.y = radians;
      else if (axis === 2) object.rotation.z = radians;
      updateObjectPosition();
    }
  };

  const handleQuickRotation = (axis: number, clockwise: boolean) => {
    const currentRotationDegrees = (rotation[axis] * 180) / Math.PI;
    const newRotationDegrees = clockwise
      ? Math.round((currentRotationDegrees + 90) / 90) * 90
      : Math.round((currentRotationDegrees - 90) / 90) * 90;

    handleRotationChange(axis, newRotationDegrees);
  };

  const handleUniformScale = (value: number) => {
    const clampedValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
    const newScale: [number, number, number] = [clampedValue, clampedValue, clampedValue];
    setScale(newScale);
    setUniformScale(clampedValue);

    // Apply to object immediately
    if (object) {
      object.scale.set(clampedValue, clampedValue, clampedValue);
      updateObjectPosition();
    }
  };

  const handleReset = () => {
    const resetScale: [number, number, number] = [1, 1, 1];
    const resetRotation: [number, number, number] = [0, 0, 0];

    setScale(resetScale);
    setRotation(resetRotation);
    setUniformScale(1);

    // Apply to object immediately
    if (object) {
      object.scale.set(1, 1, 1);
      object.rotation.set(0, 0, 0);
      updateObjectPosition();
    }
  };

  const handleDelete = () => {
    if (object && object.parent) {
      object.parent.remove(object);

      // Dispose of resources if it's a mesh or group containing meshes
      object.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    onDelete?.();
    onClose();
  };

  return (
    <div className="z-50 absolute top-[350px] right-5 text-white font-sans text-sm bg-gray-900/90 bg-opacity-90 p-5 rounded-lg w-[270px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Object Controls</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Uniform Scale */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">
          Uniform Scale: {uniformScale.toFixed(2)}
        </label>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step="0.1"
          value={uniformScale}
          onChange={(e) => handleUniformScale(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Individual Scale Controls */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Individual Scale</h4>
        <div className="grid grid-cols-3 gap-3">
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis}>
              <label className="block mb-1 text-xs">
                {axis}: {scale[index].toFixed(2)}
              </label>
              <input
                type="range"
                min={MIN_SCALE}
                max={MAX_SCALE}
                step="0.1"
                value={scale[index]}
                onChange={(e) => handleScaleChange(index, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick 90° Rotation Controls */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Quick Rotation (90°)</h4>
        <div className="grid grid-cols-3 gap-3">
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="text-center">
              <label className="block mb-2 text-xs font-medium">{axis}-Axis</label>
              <div className="flex justify-center gap-1">
                <button
                  onClick={() => handleQuickRotation(index, true)}
                  className="bg-gray-700 hover:bg-gray-600 p-1.5 rounded transition-colors flex items-center justify-center"
                  title={`Rotate ${axis} axis -90°`}
                >
                  <FaRotateLeft />
                </button>
                <button
                  onClick={() => handleQuickRotation(index, false)}
                  className="bg-gray-700 hover:bg-gray-600 p-1.5 rounded transition-colors flex items-center justify-center"
                  title={`Rotate ${axis} axis +90°`}
                >
                  <FaRotateRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fine Rotation Controls */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-1">Fine Rotation (degrees)</h4>
        <div className="grid grid-cols-1 gap-1">
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="flex gap-1 items-center">
              <label className="block mb-1 text-xs w-16">
                {axis}: {Math.round(normalizeRotation((rotation[index] * 180) / Math.PI))}°
              </label>
              <input
                type="range"
                min="-360"
                max="360"
                step={rotationStepSize}
                value={normalizeRotation((rotation[index] * 180) / Math.PI)}
                onChange={(e) => handleRotationChange(index, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          Reset
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors text-sm"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-400 flex w-full h-auto justify-center">
        <div>
          🔧 Double-click object to open controls<br />
          🔧 Alt+C to close the ObjectControls<br />
          🔄 Click rotation icons for 90° turns
        </div>
      </div>
    </div>
  );
}