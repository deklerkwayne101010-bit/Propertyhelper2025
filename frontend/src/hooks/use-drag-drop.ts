import { useState, useCallback, useRef, DragEvent } from 'react';
import { Point } from '@/types/template-editor';
import { AssetItem } from '@/lib/asset-library';

export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dragOffset: Point;
  dragPreview: {
    x: number;
    y: number;
    element: any;
  } | null;
}

export interface DragItem {
  type: 'asset' | 'element';
  assetId?: string;
  elementId?: string;
  asset?: AssetItem;
  offset: Point;
}

export const useDragDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragItem: null,
    dragOffset: { x: 0, y: 0 },
    dragPreview: null
  });

  const dragImageRef = useRef<HTMLImageElement | null>(null);

  // Start dragging an asset from the sidebar
  const startAssetDrag = useCallback((
    asset: AssetItem,
    event: React.DragEvent<HTMLElement>,
    offset: Point = { x: 0, y: 0 }
  ) => {
    const dragItem: DragItem = {
      type: 'asset',
      assetId: asset.id,
      asset,
      offset
    };

    setDragState({
      isDragging: true,
      dragItem,
      dragOffset: offset,
      dragPreview: null
    });

    // Create custom drag image
    if (!dragImageRef.current) {
      dragImageRef.current = document.createElement('img');
      dragImageRef.current.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" fill="${asset.type === 'text' ? '#3b82f6' : '#10b981'}" rx="4"/>
          <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-family="Arial">
            ${asset.preview || asset.name.charAt(0)}
          </text>
        </svg>
      `);
    }

    event.dataTransfer.setDragImage(dragImageRef.current, 20, 20);
    event.dataTransfer.effectAllowed = 'copy';

    // Store drag data
    event.dataTransfer.setData('application/json', JSON.stringify(dragItem));
  }, []);

  // Start dragging an element on the canvas
  const startElementDrag = useCallback((
    elementId: string,
    event: React.DragEvent<HTMLElement>,
    offset: Point = { x: 0, y: 0 }
  ) => {
    const dragItem: DragItem = {
      type: 'element',
      elementId,
      offset
    };

    setDragState({
      isDragging: true,
      dragItem,
      dragOffset: offset,
      dragPreview: null
    });

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(dragItem));
  }, []);

  // Handle drag over for drop zones
  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

    // Update drag preview position
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (dragState.dragItem) {
      setDragState(prev => ({
        ...prev,
        dragPreview: {
          x,
          y,
          element: dragState.dragItem.asset ? {
            type: dragState.dragItem.asset.type,
            name: dragState.dragItem.asset.name,
            preview: dragState.dragItem.asset.preview
          } : null
        }
      }));
    }
  }, [dragState.dragItem]);

  // Handle drop on canvas
  const handleDrop = useCallback((
    event: DragEvent<HTMLElement>,
    canvasPosition: Point,
    onAssetDrop: (asset: AssetItem, position: Point) => void,
    onElementDrop: (elementId: string, position: Point) => void
  ) => {
    event.preventDefault();

    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/json'));

      if (dragData.type === 'asset' && dragData.asset) {
        // Calculate position accounting for zoom and pan
        const position = {
          x: canvasPosition.x,
          y: canvasPosition.y
        };

        onAssetDrop(dragData.asset, position);
      } else if (dragData.type === 'element' && dragData.elementId) {
        const position = {
          x: canvasPosition.x,
          y: canvasPosition.y
        };

        onElementDrop(dragData.elementId, position);
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }

    // Reset drag state
    setDragState({
      isDragging: false,
      dragItem: null,
      dragOffset: { x: 0, y: 0 },
      dragPreview: null
    });
  }, []);

  // End drag operation
  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      dragItem: null,
      dragOffset: { x: 0, y: 0 },
      dragPreview: null
    });
  }, []);

  // Get drag preview component
  const getDragPreview = useCallback(() => {
    if (!dragState.dragPreview || !dragState.dragItem) return null;

    return {
      x: dragState.dragPreview.x,
      y: dragState.dragPreview.y,
      element: dragState.dragItem.asset ? {
        type: dragState.dragItem.asset.type,
        name: dragState.dragItem.asset.name,
        preview: dragState.dragItem.asset.preview
      } : null
    };
  }, [dragState.dragPreview, dragState.dragItem]);

  return {
    dragState,
    startAssetDrag,
    startElementDrag,
    handleDragOver,
    handleDrop,
    endDrag,
    getDragPreview,
    isDragging: dragState.isDragging
  };
};