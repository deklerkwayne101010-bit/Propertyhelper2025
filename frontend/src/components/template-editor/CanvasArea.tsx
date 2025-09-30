'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Image, Line, Group, Circle } from 'react-konva';
import Konva from 'konva';
import { CanvasState, TemplateElement, Point, Transform } from '@/types/template-editor';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { DragPreview } from './DragPreview';
import { CanvasTransformer } from './CanvasTransformer';

export interface CanvasAreaProps {
  canvasState: CanvasState;
  onElementSelect: (elementId: string, multiSelect?: boolean) => void;
  onCanvasClick: () => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: Point) => void;
  onElementsUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
  onElementsMove: (elementIds: string[], delta: Point) => void;
  onAssetDrop?: (asset: any, position: Point) => void;
  onElementDrop?: (elementId: string, position: Point) => void;
  className?: string;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasState,
  onElementSelect,
  onCanvasClick,
  onZoomChange,
  onPanChange,
  onElementsUpdate,
  onElementsMove,
  onAssetDrop,
  onElementDrop,
  className = ''
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; asset: any } | null>(null);

  const dragDrop = useDragDrop();

  // Update dimensions on container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle stage click
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onCanvasClick();
      setSelectedElements([]);
    }
  }, [onCanvasClick]);

  // Handle element click
  const handleElementClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>, elementId: string) => {
    e.cancelBubble = true;
    const multiSelect = e.evt.ctrlKey || e.evt.metaKey;
    onElementSelect(elementId, multiSelect);
    setSelectedElements(prev =>
      multiSelect
        ? prev.includes(elementId)
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
        : [elementId]
    );
  }, [onElementSelect]);

  // Handle element drag start
  const handleElementDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>, elementId: string) => {
    setIsDragging(true);
    setDragStart({ x: e.target.x(), y: e.target.y() });
  }, []);

  // Handle element drag end
  const handleElementDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>, elementId: string) => {
    setIsDragging(false);
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const newX = e.target.x();
      const newY = e.target.y();
      const deltaX = newX - element.transform.x;
      const deltaY = newY - element.transform.y;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        onElementsUpdate(elementId, {
          transform: {
            ...element.transform,
            x: newX,
            y: newY
          }
        });
      }
    }
  }, [canvasState.elements, onElementsUpdate]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0
      ? Math.max(0.1, oldScale * 0.9)
      : Math.min(5, oldScale * 1.1);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    onZoomChange(newScale);
    onPanChange(newPos);
  }, [onZoomChange, onPanChange]);

  // Handle drag over for drop functionality
  const handleDragOver = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    e.evt.dataTransfer!.dropEffect = 'copy';

    // Update drag preview position
    const stage = stageRef.current;
    if (stage) {
      const pointer = stage.getPointerPosition();
      if (pointer) {
        setDragPreview({
          x: pointer.x,
          y: pointer.y,
          asset: null // Will be set by drag drop hook
        });
      }
    }
  }, []);

  // Handle drop on canvas
  const handleDrop = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Convert screen coordinates to canvas coordinates
    const canvasPosition = {
      x: (pointer.x - stage.x()) / stage.scaleX(),
      y: (pointer.y - stage.y()) / stage.scaleY()
    };

    // Use the drag drop hook to handle the drop
    dragDrop.handleDrop(e.evt as any, canvasPosition, onAssetDrop || (() => {}), onElementDrop || (() => {}));

    setDragPreview(null);
  }, [onAssetDrop, onElementDrop, dragDrop]);

  // Render background
  const renderBackground = () => {
    const { background } = canvasState;

    if (background.type === 'solid') {
      return (
        <Rect
          x={0}
          y={0}
          width={canvasState.canvasSize.width}
          height={canvasState.canvasSize.height}
          fill={background.value as string}
        />
      );
    }

    if (background.type === 'gradient' && typeof background.value === 'object') {
      const gradient = background.value as any;
      if (gradient.type === 'linear') {
        return (
          <Rect
            x={0}
            y={0}
            width={canvasState.canvasSize.width}
            height={canvasState.canvasSize.height}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: canvasState.canvasSize.width, y: canvasState.canvasSize.height }}
            fillLinearGradientColorStops={gradient.colors.flatMap((c: any) => [c.offset, c.color])}
          />
        );
      }
    }

    return (
      <Rect
        x={0}
        y={0}
        width={canvasState.canvasSize.width}
        height={canvasState.canvasSize.height}
        fill="#ffffff"
      />
    );
  };

  // Render grid
  const renderGrid = () => {
    if (!canvasState.snapToGrid) return null;

    const gridSize = canvasState.gridSize;
    const lines = [];

    // Vertical lines
    for (let x = 0; x <= canvasState.canvasSize.width; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, canvasState.canvasSize.height]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= canvasState.canvasSize.height; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, canvasState.canvasSize.width, y]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />
      );
    }

    return <>{lines}</>;
  };

  // Render element
  const renderElement = (element: TemplateElement) => {
    const isSelected = selectedElements.includes(element.id);
    const { transform, style } = element;

    const commonProps = {
      key: element.id,
      x: transform.x,
      y: transform.y,
      width: transform.width,
      height: transform.height,
      rotation: transform.rotation,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      draggable: !element.locked,
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => handleElementClick(e, element.id),
      onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => handleElementDragStart(e, element.id),
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => handleElementDragEnd(e, element.id),
      opacity: element.visible ? style.opacity || 1 : 0,
    };

    // Selection outline
    const selectionOutline = isSelected ? (
      <Rect
        x={-2}
        y={-2}
        width={transform.width + 4}
        height={transform.height + 4}
        stroke="#3b82f6"
        strokeWidth={2}
        fill="transparent"
        listening={false}
      />
    ) : null;

    switch (element.type) {
      case 'text':
        const textElement = element as any;
        return (
          <Group key={element.id}>
            {selectionOutline}
            <Text
              {...commonProps}
              text={textElement.text}
              fontFamily={textElement.fontFamily}
              fontSize={textElement.fontSize}
              fontStyle={`${textElement.fontStyle} ${textElement.fontWeight}`}
              fill={textElement.fill}
              align={textElement.textAlign}
              listening={!element.locked}
            />
          </Group>
        );

      case 'shape':
        const shapeElement = element as any;
        const shapeProps = {
          ...commonProps,
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
        };

        switch (shapeElement.shapeType) {
          case 'rectangle':
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Rect {...shapeProps} />
              </Group>
            );
          case 'circle':
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Circle
                  {...shapeProps}
                  x={transform.width / 2}
                  y={transform.height / 2}
                  radius={Math.min(transform.width, transform.height) / 2}
                />
              </Group>
            );
          case 'triangle':
            const trianglePoints = [
              transform.width / 2, 0,
              0, transform.height,
              transform.width, transform.height
            ];
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Line {...shapeProps} points={trianglePoints} closed />
              </Group>
            );
          case 'line':
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Line
                  {...shapeProps}
                  points={[0, 0, transform.width, transform.height]}
                />
              </Group>
            );
          case 'arrow':
            const arrowPoints = [
              0, transform.height / 2,
              transform.width * 0.7, transform.height / 2,
              transform.width * 0.7, 0,
              transform.width, transform.height / 2,
              transform.width * 0.7, transform.height,
              transform.width * 0.7, transform.height / 2
            ];
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Line {...shapeProps} points={arrowPoints} />
              </Group>
            );
          default:
            return (
              <Group key={element.id}>
                {selectionOutline}
                <Rect {...shapeProps} />
              </Group>
            );
        }

      case 'image':
        const imageElement = element as any;
        return (
          <Group key={element.id}>
            {selectionOutline}
            <Rect
              {...commonProps}
              fillPatternImage={undefined} // Will be implemented with actual image loading
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth={1}
            />
          </Group>
        );

      default:
        return (
          <Group key={element.id}>
            {selectionOutline}
            <Rect
              {...commonProps}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth={1}
            />
          </Group>
        );
    }
  };

  return (
    <div ref={containerRef} className={`flex-1 bg-gray-100 overflow-hidden ${className}`}>
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleStageClick}
        onWheel={handleWheel}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        scaleX={canvasState.zoom}
        scaleY={canvasState.zoom}
        x={canvasState.pan.x}
        y={canvasState.pan.y}
        draggable={false}
      >
        <Layer>
          {/* Background */}
          {renderBackground()}

          {/* Grid */}
          {renderGrid()}

          {/* Elements */}
          {canvasState.elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(renderElement)}

          {/* Transformers for selected elements */}
          {canvasState.elements
            .filter(element => selectedElements.includes(element.id))
            .map(element => (
              <CanvasTransformer
                key={`transformer-${element.id}`}
                element={element}
                isSelected={selectedElements.includes(element.id)}
                onTransform={(elementId, transform) => {
                  const element = canvasState.elements.find(el => el.id === elementId);
                  if (element) {
                    onElementsUpdate(elementId, {
                      transform: { ...element.transform, ...transform }
                    });
                  }
                }}
                onTransformEnd={(elementId, transform) => {
                  const element = canvasState.elements.find(el => el.id === elementId);
                  if (element) {
                    onElementsUpdate(elementId, {
                      transform: { ...element.transform, ...transform }
                    });
                  }
                }}
                snapToGrid={canvasState.snapToGrid}
                gridSize={canvasState.gridSize}
                scale={canvasState.zoom}
              />
            ))}
        </Layer>

        {/* Selection Layer */}
        {selectedElements.length > 0 && (
          <Layer>
            {/* Multi-select bounding box would go here */}
          </Layer>
        )}
      </Stage>

      {/* Canvas Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {dimensions.width} × {dimensions.height} • {Math.round(canvasState.zoom * 100)}%
      </div>

      {/* Drag Preview */}
      {dragPreview && (
        <DragPreview
          x={dragPreview.x}
          y={dragPreview.y}
          preview={dragPreview.asset?.preview || '📄'}
          type={dragPreview.asset?.type || 'asset'}
          visible={true}
        />
      )}
    </div>
  );
};