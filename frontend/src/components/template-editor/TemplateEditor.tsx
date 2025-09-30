'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorSidebar } from './EditorSidebar';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { useCanvasState } from '@/hooks/use-canvas-state';
import { SidebarTab, TemplateElement, Point } from '@/types/template-editor';
import { initializeCommonFonts } from '@/lib/google-fonts';

export interface TemplateEditorProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  initialElements?: TemplateElement[];
  className?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  activeTab,
  onTabChange,
  initialElements = [],
  className = ''
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);

  const canvasStateHook = useCanvasState(initialElements);

  // Initialize Google Fonts on component mount
  useEffect(() => {
    const initializeFonts = async () => {
      try {
        await initializeCommonFonts();
      } catch (error) {
        console.error('Failed to initialize Google Fonts:', error);
      }
    };

    initializeFonts();
  }, []);

  const handleElementSelect = useCallback((elementId: string, multiSelect = false) => {
    canvasStateHook.selectElement(elementId, multiSelect);
    setSelectedElementIds([elementId]);
  }, [canvasStateHook]);

  const handleElementsAdd = useCallback((elements: TemplateElement[]) => {
    elements.forEach(element => {
      canvasStateHook.addElement(element);
    });
  }, [canvasStateHook]);

  const handleCanvasClick = useCallback(() => {
    canvasStateHook.clearSelection();
    setSelectedElementIds([]);
  }, [canvasStateHook]);

  const handleAssetDrop = useCallback((asset: any, position: Point) => {
    // Convert asset to template element and add to canvas
    const element = convertAssetToElement(asset);
    if (element) {
      // Adjust position to account for zoom and pan
      const adjustedPosition = {
        x: position.x,
        y: position.y
      };

      const elementWithPosition = {
        ...element,
        transform: {
          ...element.transform,
          x: adjustedPosition.x,
          y: adjustedPosition.y
        }
      };

      canvasStateHook.addElement(elementWithPosition);
      setSelectedElementIds([elementWithPosition.id]);
    }
  }, [canvasStateHook]);

  const handleElementDrop = useCallback((elementId: string, position: Point) => {
    // Handle element repositioning via drag and drop
    canvasStateHook.updateElementTransform(elementId, {
      x: position.x,
      y: position.y
    });
  }, [canvasStateHook]);

  const convertAssetToElement = (asset: any): TemplateElement | null => {
    const baseElement = {
      id: `${asset.type}_${Date.now()}`,
      name: asset.name,
      transform: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
      },
      style: {
        opacity: 1,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      },
      locked: false,
      visible: true,
      zIndex: Math.max(...canvasStateHook.canvasState.elements.map(el => el.zIndex), 0) + 1
    };

    switch (asset.type) {
      case 'svg':
        return {
          ...baseElement,
          type: 'svg' as const,
          svgContent: asset.data
        } as any;

      case 'shape':
        return {
          ...baseElement,
          type: 'shape' as const,
          shapeType: asset.data.shapeType || 'rectangle'
        } as any;

      case 'sticker':
        return {
          ...baseElement,
          type: 'text' as const,
          text: asset.data.text,
          fill: asset.data.color,
          fontSize: 24,
          fontWeight: 'bold' as const,
          fontFamily: 'Inter',
          fontStyle: 'normal' as const,
          textAlign: 'center' as const,
          textDecoration: 'none' as const
        } as any;

      case 'text':
        return {
          ...baseElement,
          type: 'text' as const,
          text: asset.data.text || 'Sample Text',
          fill: asset.data.color || '#000000',
          fontSize: asset.data.fontSize || 16,
          fontWeight: (asset.data.fontWeight || '400') as any,
          fontFamily: asset.data.fontFamily || 'Inter',
          fontStyle: 'normal' as const,
          textAlign: 'left' as const,
          textDecoration: 'none' as const
        } as any;

      case 'chart':
        return {
          ...baseElement,
          type: 'chart' as const,
          chartType: asset.data.chartType || 'bar',
          data: asset.data.datasets || [],
          colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
        } as any;

      case 'frame':
        return {
          ...baseElement,
          type: 'frame' as const,
          frameType: asset.data.frameType || 'house',
          borderWidth: 4,
          borderColor: '#3b82f6'
        } as any;

      case 'grid':
        return {
          ...baseElement,
          type: 'grid' as const,
          gridType: asset.data.gridType || 'social',
          rows: asset.data.rows || 1,
          columns: asset.data.columns || 1,
          gap: 10
        } as any;

      default:
        return null;
    }
  };

  const handleZoomChange = useCallback((zoom: number) => {
    canvasStateHook.setZoom(zoom);
  }, [canvasStateHook]);

  const handlePanChange = useCallback((pan: { x: number; y: number }) => {
    canvasStateHook.setPan(pan);
  }, [canvasStateHook]);

  const handleGridToggle = useCallback(() => {
    canvasStateHook.toggleGrid();
  }, [canvasStateHook]);

  const handleGuidesToggle = useCallback(() => {
    canvasStateHook.toggleGuides();
  }, [canvasStateHook]);

  const handleUndo = useCallback(() => {
    canvasStateHook.undo();
  }, [canvasStateHook]);

  const handleRedo = useCallback(() => {
    canvasStateHook.redo();
  }, [canvasStateHook]);

  const handleExport = useCallback((format: 'png' | 'jpg' | 'pdf' | 'svg') => {
    // Export functionality will be implemented later
    console.log(`Exporting as ${format}`);
  }, []);

  const handleSave = useCallback(() => {
    // Save functionality will be implemented later
    console.log('Saving template...');
  }, []);

  const handleReset = useCallback(() => {
    canvasStateHook.resetView();
  }, [canvasStateHook]);

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Top Toolbar */}
      <EditorToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onExport={handleExport}
        onReset={handleReset}
        onZoomChange={handleZoomChange}
        onGridToggle={handleGridToggle}
        onGuidesToggle={handleGuidesToggle}
        canUndo={canvasStateHook.canUndo}
        canRedo={canvasStateHook.canRedo}
        currentZoom={canvasStateHook.canvasState.zoom}
        showGrid={canvasStateHook.canvasState.snapToGrid}
        showGuides={canvasStateHook.canvasState.showGuides}
        className="border-b border-gray-200"
      />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onElementsAdd={handleElementsAdd}
          className="border-r border-gray-200"
        />

        {/* Central Canvas Area */}
        <CanvasArea
          canvasState={canvasStateHook.canvasState}
          onElementSelect={handleElementSelect}
          onCanvasClick={handleCanvasClick}
          onZoomChange={handleZoomChange}
          onPanChange={handlePanChange}
          onElementsUpdate={canvasStateHook.updateElement}
          onElementsMove={canvasStateHook.moveElements}
          onAssetDrop={handleAssetDrop}
          onElementDrop={handleElementDrop}
          className="flex-1"
        />

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedElements={canvasStateHook.getSelectedElements()}
          onElementUpdate={canvasStateHook.updateElement}
          onElementStyleUpdate={canvasStateHook.updateElementStyle}
          onElementTransformUpdate={canvasStateHook.updateElementTransform}
          onElementsRemove={canvasStateHook.removeElement}
          onElementsDuplicate={canvasStateHook.duplicateElement}
          onElementsGroup={canvasStateHook.groupElements}
          onElementsUngroup={canvasStateHook.ungroupElements}
          onBringToFront={canvasStateHook.bringToFront}
          onSendToBack={canvasStateHook.sendToBack}
          onMoveUp={canvasStateHook.moveUp}
          onMoveDown={canvasStateHook.moveDown}
          collapsed={propertiesCollapsed}
          onToggleCollapse={() => setPropertiesCollapsed(!propertiesCollapsed)}
          className="border-l border-gray-200"
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Elements: {canvasStateHook.canvasState.elements.length}</span>
          <span>Selected: {selectedElementIds.length}</span>
          <span>Zoom: {Math.round(canvasStateHook.canvasState.zoom * 100)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => canvasStateHook.enableAutoSave()}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Auto-save: ON
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};