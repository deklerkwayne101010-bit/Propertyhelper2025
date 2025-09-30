'use client';

import React, { useState, useMemo } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { AssetItem, assetsByCategory, assetCategories, searchAssets } from '@/lib/asset-library';
import { TemplateElement } from '@/types/template-editor';
import { useDragDrop } from '@/hooks/use-drag-drop';

export interface AssetLibraryProps {
  category: string;
  searchQuery: string;
  onAssetSelect: (asset: AssetItem) => void;
  onElementsAdd: (elements: TemplateElement[]) => void;
  className?: string;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  category,
  searchQuery,
  onAssetSelect,
  onElementsAdd,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; asset: AssetItem } | null>(null);

  const dragDrop = useDragDrop();

  // Get assets for current category
  const categoryAssets = useMemo(() => {
    const baseAssets = assetsByCategory[category as keyof typeof assetsByCategory] || [];

    if (!searchQuery.trim()) {
      return baseAssets;
    }

    return searchAssets(searchQuery).filter(asset =>
      baseAssets.some(baseAsset => baseAsset.id === asset.id)
    );
  }, [category, searchQuery]);

  const handleAssetClick = (asset: AssetItem) => {
    setSelectedAssetId(asset.id);
    onAssetSelect(asset);
  };

  const handleAssetDoubleClick = (asset: AssetItem) => {
    // Convert asset to template element and add to canvas
    const element = convertAssetToElement(asset);
    if (element) {
      onElementsAdd([element]);
    }
  };

  const handleDragStart = (asset: AssetItem, event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    dragDrop.startAssetDrag(asset, event);
  };

  const handleDragEnd = () => {
    dragDrop.endDrag();
  };

  const convertAssetToElement = (asset: AssetItem): TemplateElement | null => {
    const baseElement = {
      id: `${asset.type}_${Date.now()}`,
      name: asset.name,
      transform: {
        x: 100,
        y: 100,
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
      zIndex: 1
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

  const renderAssetGrid = () => (
    <div className="grid grid-cols-3 gap-2 p-2">
      {categoryAssets.map((asset) => (
        <div
          key={asset.id}
          className={`group relative aspect-square bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:shadow-md ${
            selectedAssetId === asset.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          onClick={() => handleAssetClick(asset)}
          onDoubleClick={() => handleAssetDoubleClick(asset)}
          onDragStart={(e) => handleDragStart(asset, e)}
          onDragEnd={handleDragEnd}
          draggable
          title={asset.name}
        >
          {/* Asset Preview */}
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {asset.type === 'text' ? (
              <div className="text-xs text-center p-1" style={{
                fontFamily: asset.data.fontFamily || 'Inter',
                fontSize: '8px',
                fontWeight: asset.data.fontWeight || '400',
                color: asset.data.color || '#000000'
              }}>
                {asset.data.text || 'Text'}
              </div>
            ) : (
              asset.preview
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white bg-opacity-90 rounded px-2 py-1 text-xs font-medium text-gray-700">
                {asset.name}
              </div>
            </div>
          </div>

          {/* Asset Type Indicator */}
          <div className="absolute top-1 right-1">
            <div className={`w-3 h-3 rounded-full ${
              asset.type === 'svg' ? 'bg-purple-400' :
              asset.type === 'shape' ? 'bg-blue-400' :
              asset.type === 'sticker' ? 'bg-green-400' :
              asset.type === 'chart' ? 'bg-orange-400' :
              asset.type === 'frame' ? 'bg-pink-400' :
              'bg-gray-400'
            }`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderAssetList = () => (
    <div className="space-y-1 p-2">
      {categoryAssets.map((asset) => (
        <div
          key={asset.id}
          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
            selectedAssetId === asset.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
          }`}
          onClick={() => handleAssetClick(asset)}
          onDoubleClick={() => handleAssetDoubleClick(asset)}
        >
          {/* Asset Preview */}
          <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded">
            {asset.preview}
          </div>

          {/* Asset Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {asset.name}
            </div>
            <div className="text-xs text-gray-500">
              {asset.tags.slice(0, 2).join(', ')}
            </div>
          </div>

          {/* Asset Type */}
          <div className="text-xs text-gray-400 capitalize">
            {asset.type}
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <div className="text-4xl mb-4">
        {searchQuery ? '🔍' : '📭'}
      </div>
      <div className="text-center">
        <div className="font-medium text-gray-900 mb-1">
          {searchQuery ? 'No results found' : 'No assets available'}
        </div>
        <div className="text-sm">
          {searchQuery
            ? `Try searching for something else`
            : 'This category is currently empty'
          }
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm text-gray-900">
            {assetCategories.find(cat => cat.id === category)?.name || 'Assets'}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {categoryAssets.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {categoryAssets.length > 0 ? (
          viewMode === 'grid' ? renderAssetGrid() : renderAssetList()
        ) : (
          renderEmptyState()
        )}
      </div>

      {/* Footer */}
      {selectedAssetId && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Double-click to add to canvas
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const asset = categoryAssets.find(a => a.id === selectedAssetId);
                  if (asset) handleAssetDoubleClick(asset);
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};