'use client';

import React, { useState } from 'react';
import {
  Settings,
  Type,
  Palette,
  Move,
  RotateCw,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Layers,
  MoreHorizontal,
  Crop
} from 'lucide-react';
import { TemplateElement } from '@/types/template-editor';
import { FontSelector } from './FontSelector';

export interface PropertiesPanelProps {
  selectedElements: TemplateElement[];
  onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onElementStyleUpdate: (elementId: string, style: Partial<TemplateElement['style']>) => void;
  onElementTransformUpdate: (elementId: string, transform: Partial<TemplateElement['transform']>) => void;
  onElementsRemove: (elementId: string) => void;
  onElementsDuplicate: (elementId: string) => void;
  onElementsGroup: (elementIds: string[]) => void;
  onElementsUngroup: (groupId: string) => void;
  onBringToFront: (elementId: string) => void;
  onSendToBack: (elementId: string) => void;
  onMoveUp: (elementId: string) => void;
  onMoveDown: (elementId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElements,
  onElementUpdate,
  onElementStyleUpdate,
  onElementTransformUpdate,
  onElementsRemove,
  onElementsDuplicate,
  onElementsGroup,
  onElementsUngroup,
  onBringToFront,
  onSendToBack,
  onMoveUp,
  onMoveDown,
  collapsed,
  onToggleCollapse,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState('style');
  const [isCropMode, setIsCropMode] = useState(false);

  const selectedElement = selectedElements[0];
  const isMultipleSelection = selectedElements.length > 1;

  const handleStyleChange = (property: string, value: any) => {
    if (!selectedElement) return;

    if (property === 'fill' || property === 'stroke' || property === 'opacity' || property === 'strokeWidth') {
      onElementStyleUpdate(selectedElement.id, { [property]: value });
    } else if (property === 'x' || property === 'y' || property === 'width' || property === 'height' || property === 'rotation') {
      onElementTransformUpdate(selectedElement.id, { [property]: value });
    } else {
      onElementUpdate(selectedElement.id, { [property]: value });
    }
  };

  const handleMultipleAction = (action: string) => {
    if (!selectedElements.length) return;

    const elementIds = selectedElements.map(el => el.id);

    switch (action) {
      case 'group':
        onElementsGroup(elementIds);
        break;
      case 'remove':
        elementIds.forEach(id => onElementsRemove(id));
        break;
      case 'duplicate':
        elementIds.forEach(id => onElementsDuplicate(id));
        break;
    }
  };

  const renderElementInfo = () => {
    if (!selectedElement) {
      return (
        <div className="p-4 text-center text-gray-500">
          <Settings size={24} className="mx-auto mb-2 opacity-50" />
          <p>Select an element to edit its properties</p>
        </div>
      );
    }

    return (
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm text-gray-900">
            {isMultipleSelection ? `${selectedElements.length} elements` : selectedElement.name}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleStyleChange('visible', !selectedElement.visible)}
              className="p-1 hover:bg-gray-100 rounded"
              title={selectedElement.visible ? 'Hide' : 'Show'}
            >
              {selectedElement.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => handleStyleChange('locked', !selectedElement.locked)}
              className="p-1 hover:bg-gray-100 rounded"
              title={selectedElement.locked ? 'Unlock' : 'Lock'}
            >
              {selectedElement.locked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>
        </div>

        {selectedElement.type === 'text' && (
          <div className="text-xs text-gray-500">
            Text Element
          </div>
        )}
        {selectedElement.type === 'shape' && (
          <div className="text-xs text-gray-500">
            Shape Element
          </div>
        )}
        {selectedElement.type === 'image' && (
          <div className="text-xs text-gray-500">
            Image Element
          </div>
        )}
      </div>
    );
  };

  const renderStyleSection = () => (
    <div className="p-4 space-y-4">
      <h4 className="font-medium text-sm text-gray-900 flex items-center">
        <Palette size={16} className="mr-2" />
        Style
      </h4>

      {selectedElement && (
        <>
          {/* Fill Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fill Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.style.fill || '#000000'}
                onChange={(e) => handleStyleChange('fill', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={selectedElement.style.fill || '#000000'}
                onChange={(e) => handleStyleChange('fill', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Stroke Color */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Stroke Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.style.stroke || '#000000'}
                onChange={(e) => handleStyleChange('stroke', e.target.value)}
                className="w-8 h-8 rounded border border-gray-300"
              />
              <input
                type="text"
                value={selectedElement.style.stroke || '#000000'}
                onChange={(e) => handleStyleChange('stroke', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Stroke Width
            </label>
            <input
              type="number"
              value={selectedElement.style.strokeWidth || 0}
              onChange={(e) => handleStyleChange('strokeWidth', parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              min="0"
              step="0.5"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedElement.style.opacity || 1}
              onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((selectedElement.style.opacity || 1) * 100)}%
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTransformSection = () => (
    <div className="p-4 space-y-4">
      <h4 className="font-medium text-sm text-gray-900 flex items-center">
        <Move size={16} className="mr-2" />
        Transform
      </h4>

      {selectedElement && (
        <>
          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                X Position
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.transform.x)}
                onChange={(e) => handleStyleChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Y Position
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.transform.y)}
                onChange={(e) => handleStyleChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.transform.width)}
                onChange={(e) => handleStyleChange('width', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.transform.height)}
                onChange={(e) => handleStyleChange('height', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                min="1"
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rotation
            </label>
            <input
              type="number"
              value={Math.round(selectedElement.transform.rotation)}
              onChange={(e) => handleStyleChange('rotation', parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              step="15"
            />
          </div>

          {/* Flip Controls */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Flip
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const currentScaleX = selectedElement.transform.scaleX;
                  handleStyleChange('scaleX', currentScaleX * -1);
                }}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Flip Horizontal
              </button>
              <button
                onClick={() => {
                  const currentScaleY = selectedElement.transform.scaleY;
                  handleStyleChange('scaleY', currentScaleY * -1);
                }}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Flip Vertical
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderTextSection = () => {
    if (!selectedElement || selectedElement.type !== 'text') {
      return null;
    }

    const textElement = selectedElement as any;

    return (
      <div className="p-4 space-y-4">
        <h4 className="font-medium text-sm text-gray-900 flex items-center">
          <Type size={16} className="mr-2" />
          Text
        </h4>

        {/* Text Content */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={textElement.text}
            onChange={(e) => handleStyleChange('text', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none"
            rows={3}
            placeholder="Enter text..."
          />
        </div>

        {/* Font Selector */}
        <FontSelector
          value={{
            fontFamily: textElement.fontFamily,
            fontSize: textElement.fontSize,
            fontWeight: textElement.fontWeight,
            color: textElement.fill
          }}
          onChange={(newValue) => {
            handleStyleChange('fontFamily', newValue.fontFamily);
            handleStyleChange('fontSize', newValue.fontSize);
            handleStyleChange('fontWeight', newValue.fontWeight);
            handleStyleChange('fill', newValue.color);
          }}
        />
      </div>
    );
  };

  const renderActionsSection = () => (
    <div className="p-4 space-y-2 border-t border-gray-200">
      <h4 className="font-medium text-sm text-gray-900 mb-2">Actions</h4>

      {selectedElement && (
        <>
          <button
            onClick={() => onBringToFront(selectedElement.id)}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <ArrowUp size={14} />
            <span>Bring to Front</span>
          </button>

          <button
            onClick={() => onSendToBack(selectedElement.id)}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <ArrowDown size={14} />
            <span>Send to Back</span>
          </button>

          <button
            onClick={() => onElementsDuplicate(selectedElement.id)}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => setIsCropMode(!isCropMode)}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <Crop size={14} />
            <span>Crop</span>
          </button>

          <button
            onClick={() => onElementsRemove(selectedElement.id)}
            className="w-full flex items-center space-x-2 p-2 text-xs text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div className="border-t pt-2 mt-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Layer</div>
            <div className="flex space-x-1">
              <button
                onClick={() => onBringToFront(selectedElement.id)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                title="Bring to Front"
              >
                <ArrowUp size={12} />
              </button>
              <button
                onClick={() => onMoveUp(selectedElement.id)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => onMoveDown(selectedElement.id)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                title="Move Down"
              >
                ↓
              </button>
              <button
                onClick={() => onSendToBack(selectedElement.id)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                title="Send to Back"
              >
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        </>
      )}

      {isMultipleSelection && (
        <>
          <button
            onClick={() => handleMultipleAction('group')}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <Layers size={14} />
            <span>Group</span>
          </button>

          <button
            onClick={() => handleMultipleAction('duplicate')}
            className="w-full flex items-center space-x-2 p-2 text-xs hover:bg-gray-50 rounded"
          >
            <Copy size={14} />
            <span>Duplicate All</span>
          </button>

          <button
            onClick={() => handleMultipleAction('remove')}
            className="w-full flex items-center space-x-2 p-2 text-xs text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={14} />
            <span>Delete All</span>
          </button>
        </>
      )}
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'style':
        return renderStyleSection();
      case 'transform':
        return renderTransformSection();
      case 'text':
        return renderTextSection();
      default:
        return renderStyleSection();
    }
  };

  return (
    <div className={`flex bg-white border-l border-gray-200 ${className}`}>
      {/* Section Navigation */}
      <div className={`flex flex-col border-r border-gray-200 ${collapsed ? 'w-12' : 'w-16'}`}>
        <div className="p-2 border-b border-gray-200">
          <button
            onClick={onToggleCollapse}
            className="w-full p-2 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <>
            <button
              onClick={() => setActiveSection('style')}
              className={`w-full p-3 flex flex-col items-center space-y-1 ${
                activeSection === 'style'
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Palette size={16} />
              <span className="text-xs">Style</span>
            </button>

            <button
              onClick={() => setActiveSection('transform')}
              className={`w-full p-3 flex flex-col items-center space-y-1 ${
                activeSection === 'transform'
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Move size={16} />
              <span className="text-xs">Position</span>
            </button>

            {selectedElement?.type === 'text' && (
              <button
                onClick={() => setActiveSection('text')}
                className={`w-full p-3 flex flex-col items-center space-y-1 ${
                  activeSection === 'text'
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Type size={16} />
                <span className="text-xs">Text</span>
              </button>
            )}

            <button
              className="w-full p-3 flex flex-col items-center space-y-1 text-gray-600 hover:bg-gray-50"
            >
              <MoreHorizontal size={16} />
              <span className="text-xs">More</span>
            </button>
          </>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {renderElementInfo()}
          {renderSectionContent()}
          {renderActionsSection()}
        </div>
      )}
    </div>
  );
};