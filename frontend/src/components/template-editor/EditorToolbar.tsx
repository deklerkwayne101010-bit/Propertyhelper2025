'use client';

import React from 'react';
import {
  Undo2,
  Redo2,
  Save,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Eye,
  Settings,
  FileImage,
  FileText,
  File
} from 'lucide-react';

export interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onExport: (format: 'png' | 'jpg' | 'pdf' | 'svg') => void;
  onReset: () => void;
  onZoomChange: (zoom: number) => void;
  onGridToggle: () => void;
  onGuidesToggle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentZoom: number;
  showGrid: boolean;
  showGuides: boolean;
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onUndo,
  onRedo,
  onSave,
  onExport,
  onReset,
  onZoomChange,
  onGridToggle,
  onGuidesToggle,
  canUndo,
  canRedo,
  currentZoom,
  showGrid,
  showGuides,
  className = ''
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom * 1.2, 5);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom / 1.2, 0.1);
    onZoomChange(newZoom);
  };

  const handleZoomFit = () => {
    onZoomChange(1);
  };

  return (
    <div className={`flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 ${className}`}>
      {/* Left Section - File Operations */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onSave}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          title="Save Template (Ctrl+S)"
        >
          <Save size={16} />
          <span>Save</span>
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Zoom Out (Ctrl+-)"
        >
          <ZoomOut size={18} />
        </button>

        <button
          onClick={handleZoomFit}
          className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 min-w-[60px] text-sm"
          title="Fit to Screen (Ctrl+0)"
        >
          {Math.round(currentZoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="p-2 rounded-md hover:bg-gray-100"
          title="Zoom In (Ctrl++)"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Right Section - View Options & Export */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onGridToggle}
          className={`p-2 rounded-md ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          title="Toggle Grid"
        >
          <Grid3X3 size={18} />
        </button>

        <button
          onClick={onGuidesToggle}
          className={`p-2 rounded-md ${showGuides ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          title="Toggle Guides"
        >
          <Eye size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <div className="relative group">
          <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>

          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
            <button
              onClick={() => onExport('png')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileImage size={16} />
              <span>PNG</span>
            </button>
            <button
              onClick={() => onExport('jpg')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileImage size={16} />
              <span>JPG</span>
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <File size={16} />
              <span>PDF</span>
            </button>
            <button
              onClick={() => onExport('svg')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>SVG</span>
            </button>
          </div>
        </div>

        <button className="p-2 rounded-md hover:bg-gray-100" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};