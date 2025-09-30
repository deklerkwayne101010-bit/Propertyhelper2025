'use client';

import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Heart, Star, Info } from 'lucide-react';
import { AssetItem } from '@/lib/asset-library';
import { useDragDrop } from '@/hooks/use-drag-drop';

export interface AssetCategoryProps {
  title: string;
  assets: AssetItem[];
  searchQuery: string;
  onAssetSelect: (asset: AssetItem) => void;
  onAssetsAdd: (assets: AssetItem[]) => void;
  className?: string;
}

export const AssetCategory: React.FC<AssetCategoryProps> = ({
  title,
  assets,
  searchQuery,
  onAssetSelect,
  onAssetsAdd,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const dragDrop = useDragDrop();

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;

    const query = searchQuery.toLowerCase();
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(query) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
      asset.metadata?.description?.toLowerCase().includes(query)
    );
  }, [assets, searchQuery]);

  const handleAssetClick = (asset: AssetItem) => {
    setSelectedAssetId(asset.id);
    onAssetSelect(asset);
  };

  const handleAssetDoubleClick = (asset: AssetItem) => {
    onAssetsAdd([asset]);
  };

  const handleDragStart = (asset: AssetItem, event: React.DragEvent<HTMLElement>) => {
    event.stopPropagation();
    dragDrop.startAssetDrag(asset, event);
  };

  const handleDragEnd = () => {
    dragDrop.endDrag();
  };

  const toggleFavorite = (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(assetId)) {
      newFavorites.delete(assetId);
    } else {
      newFavorites.add(assetId);
    }
    setFavorites(newFavorites);
  };

  const renderAssetGrid = () => (
    <div className="grid grid-cols-3 gap-3 p-3">
      {filteredAssets.map((asset) => (
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
          <div className="w-full h-full flex items-center justify-center text-2xl p-2">
            {asset.type === 'text' ? (
              <div
                className="text-xs text-center truncate w-full"
                style={{
                  fontFamily: asset.data.fontFamily || 'Inter',
                  fontSize: '8px',
                  fontWeight: asset.data.fontWeight || '400',
                  color: asset.data.color || '#000000'
                }}
              >
                {asset.data.text || 'Text'}
              </div>
            ) : (
              <div className="text-center">
                {asset.preview}
              </div>
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

          {/* Asset Controls */}
          <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleFavorite(asset.id, e)}
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                favorites.has(asset.id) ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 hover:bg-opacity-100'
              }`}
            >
              <Heart size={10} className={favorites.has(asset.id) ? 'fill-current' : ''} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMetadata(showMetadata === asset.id ? null : asset.id);
              }}
              className="w-5 h-5 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100"
            >
              <Info size={10} />
            </button>
          </div>

          {/* Asset Type Indicator */}
          <div className="absolute top-1 left-1">
            <div className={`w-3 h-3 rounded-full ${
              asset.type === 'svg' ? 'bg-purple-400' :
              asset.type === 'shape' ? 'bg-blue-400' :
              asset.type === 'sticker' ? 'bg-green-400' :
              asset.type === 'chart' ? 'bg-orange-400' :
              asset.type === 'frame' ? 'bg-pink-400' :
              asset.type === 'grid' ? 'bg-indigo-400' :
              'bg-gray-400'
            }`} />
          </div>

          {/* Metadata Tooltip */}
          {showMetadata === asset.id && asset.metadata && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 text-white text-xs rounded p-2 z-10 max-w-xs">
              <div className="font-medium mb-1">{asset.name}</div>
              {asset.metadata.description && (
                <div className="mb-1">{asset.metadata.description}</div>
              )}
              {asset.metadata.usage && (
                <div className="text-gray-300 mb-1">
                  <strong>Usage:</strong> {asset.metadata.usage}
                </div>
              )}
              {asset.metadata.propertyType && (
                <div className="flex flex-wrap gap-1">
                  {asset.metadata.propertyType.map(type => (
                    <span key={type} className="bg-gray-700 px-1 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAssetList = () => (
    <div className="space-y-1 p-3">
      {filteredAssets.map((asset) => (
        <div
          key={asset.id}
          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
            selectedAssetId === asset.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
          }`}
          onClick={() => handleAssetClick(asset)}
          onDoubleClick={() => handleAssetDoubleClick(asset)}
        >
          {/* Asset Preview */}
          <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-100 rounded flex-shrink-0">
            {asset.preview}
          </div>

          {/* Asset Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {asset.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {asset.metadata?.description || asset.tags.slice(0, 2).join(', ')}
            </div>
            {asset.metadata?.propertyType && (
              <div className="flex flex-wrap gap-1 mt-1">
                {asset.metadata.propertyType.slice(0, 2).map(type => (
                  <span key={type} className="bg-gray-100 text-gray-600 px-1 rounded text-xs">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Asset Controls */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={(e) => toggleFavorite(asset.id, e)}
              className={`p-1 rounded ${favorites.has(asset.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={14} className={favorites.has(asset.id) ? 'fill-current' : ''} />
            </button>
            <div className="text-xs text-gray-400 capitalize">
              {asset.type}
            </div>
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
            {title}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {filteredAssets.length}
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
        {filteredAssets.length > 0 ? (
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
                  const asset = filteredAssets.find(a => a.id === selectedAssetId);
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