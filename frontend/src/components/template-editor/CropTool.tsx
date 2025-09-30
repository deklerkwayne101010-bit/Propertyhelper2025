'use client';

import React, { useState, useCallback } from 'react';
import { Crop, Check, X } from 'lucide-react';
import { TemplateElement, Point, Size } from '@/types/template-editor';

export interface CropToolProps {
  element: TemplateElement;
  isVisible: boolean;
  onCrop: (elementId: string, cropArea: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
  onComplete: () => void;
}

export const CropTool: React.FC<CropToolProps> = ({
  element,
  isVisible,
  onCrop,
  onCancel,
  onComplete
}) => {
  const [cropArea, setCropArea] = useState({
    x: element.transform.x + 10,
    y: element.transform.y + 10,
    width: element.transform.width - 20,
    height: element.transform.height - 20
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<'nw' | 'ne' | 'sw' | 'se' | 'move' | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: 'nw' | 'ne' | 'sw' | 'se' | 'move') => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragHandle) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * element.transform.width + element.transform.x;
    const y = ((e.clientY - rect.top) / rect.height) * element.transform.height + element.transform.y;

    setCropArea(prev => {
      let newArea = { ...prev };

      switch (dragHandle) {
        case 'nw':
          newArea.x = Math.min(x, prev.x + prev.width - 10);
          newArea.y = Math.min(y, prev.y + prev.height - 10);
          newArea.width = (prev.x + prev.width) - newArea.x;
          newArea.height = (prev.y + prev.height) - newArea.y;
          break;
        case 'ne':
          newArea.y = Math.min(y, prev.y + prev.height - 10);
          newArea.width = Math.max(10, x - prev.x);
          newArea.height = (prev.y + prev.height) - newArea.y;
          break;
        case 'sw':
          newArea.x = Math.min(x, prev.x + prev.width - 10);
          newArea.width = (prev.x + prev.width) - newArea.x;
          newArea.height = Math.max(10, y - prev.y);
          break;
        case 'se':
          newArea.width = Math.max(10, x - prev.x);
          newArea.height = Math.max(10, y - prev.y);
          break;
        case 'move':
          const deltaX = x - (prev.x + prev.width / 2);
          const deltaY = y - (prev.y + prev.height / 2);
          newArea.x = Math.max(element.transform.x, Math.min(element.transform.x + element.transform.width - prev.width, prev.x + deltaX));
          newArea.y = Math.max(element.transform.y, Math.min(element.transform.y + element.transform.height - prev.height, prev.y + deltaY));
          break;
      }

      return newArea;
    });
  }, [isDragging, dragHandle, element.transform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  const handleApplyCrop = useCallback(() => {
    // Convert crop area to relative coordinates
    const relativeCrop = {
      x: cropArea.x - element.transform.x,
      y: cropArea.y - element.transform.y,
      width: cropArea.width,
      height: cropArea.height
    };
    onCrop(element.id, relativeCrop);
    onComplete();
  }, [cropArea, element, onCrop, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 cursor-crosshair"
      style={{
        left: cropArea.x,
        top: cropArea.y,
        width: cropArea.width,
        height: cropArea.height
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Crop Area Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Corner Handles */}
      <div
        className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-nw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
      />
      <div
        className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-ne-resize"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
      />
      <div
        className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-sw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
      />
      <div
        className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />

      {/* Move Handle */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded cursor-move"
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      />

      {/* Crop Controls */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          onClick={handleApplyCrop}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center space-x-1"
        >
          <Check size={12} />
          <span>Apply</span>
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center space-x-1"
        >
          <X size={12} />
          <span>Cancel</span>
        </button>
      </div>

      {/* Crop Info */}
      <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
        {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
      </div>
    </div>
  );
};