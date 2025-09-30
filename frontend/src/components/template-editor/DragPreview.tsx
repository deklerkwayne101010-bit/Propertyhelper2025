'use client';

import React from 'react';

export interface DragPreviewProps {
  x: number;
  y: number;
  preview: string;
  type: string;
  visible: boolean;
}

export const DragPreview: React.FC<DragPreviewProps> = ({
  x,
  y,
  preview,
  type,
  visible
}) => {
  if (!visible) return null;

  const getPreviewColor = (type: string) => {
    switch (type) {
      case 'text': return '#3b82f6';
      case 'shape': return '#10b981';
      case 'svg': return '#8b5cf6';
      case 'sticker': return '#f59e0b';
      case 'chart': return '#ef4444';
      case 'frame': return '#ec4899';
      case 'grid': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-50 opacity-80"
      style={{
        left: x - 20,
        top: y - 20,
        transform: 'rotate(-5deg)',
        transition: 'none'
      }}
    >
      <div
        className="w-10 h-10 rounded-lg shadow-lg border-2 flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: getPreviewColor(type) }}
      >
        <span className="text-lg">
          {preview}
        </span>
      </div>
    </div>
  );
};