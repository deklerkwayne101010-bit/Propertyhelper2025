'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Rect, Group, Line, Circle } from 'react-konva';
import Konva from 'konva';
import { TemplateElement, Point, Transform } from '@/types/template-editor';

export interface CanvasTransformerProps {
  element: TemplateElement;
  isSelected: boolean;
  onTransform: (elementId: string, transform: Partial<Transform>) => void;
  onTransformEnd: (elementId: string, transform: Partial<Transform>) => void;
  snapToGrid: boolean;
  gridSize: number;
  scale: number;
}

export const CanvasTransformer: React.FC<CanvasTransformerProps> = ({
  element,
  isSelected,
  onTransform,
  onTransformEnd,
  snapToGrid,
  gridSize,
  scale
}) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformBounds, setTransformBounds] = useState({
    x: element.transform.x,
    y: element.transform.y,
    width: element.transform.width,
    height: element.transform.height,
    rotation: element.transform.rotation,
    scaleX: element.transform.scaleX,
    scaleY: element.transform.scaleY
  });

  // Snap value to grid
  const snapToGridValue = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Handle transform changes
  const handleTransform = () => {
    if (!transformerRef.current) return;

    const transform = transformerRef.current;
    const nodes = transform.nodes();

    if (nodes.length > 0) {
      const node = nodes[0];
      const newTransform = {
        x: snapToGridValue(node.x()),
        y: snapToGridValue(node.y()),
        width: snapToGridValue(node.width() * node.scaleX()),
        height: snapToGridValue(node.height() * node.scaleY()),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY()
      };

      setTransformBounds(newTransform);
      onTransform(element.id, newTransform);
    }
  };

  // Handle transform end
  const handleTransformEnd = () => {
    if (!transformerRef.current) return;

    const transform = transformerRef.current;
    const nodes = transform.nodes();

    if (nodes.length > 0) {
      const node = nodes[0];
      const finalTransform = {
        x: snapToGridValue(node.x()),
        y: snapToGridValue(node.y()),
        width: snapToGridValue(node.width() * node.scaleX()),
        height: snapToGridValue(node.height() * node.scaleY()),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY()
      };

      setTransformBounds(finalTransform);
      onTransformEnd(element.id, finalTransform);
    }

    setIsTransforming(false);
  };

  // Handle transform start
  const handleTransformStart = () => {
    setIsTransforming(true);
  };

  // Update transformer when element changes
  useEffect(() => {
    if (transformerRef.current && isSelected) {
      transformerRef.current.nodes([transformerRef.current.getStage()!.findOne(`#${element.id}`) as any]);
      transformerRef.current.getLayer()!.batchDraw();
    }
  }, [element.id, isSelected, element.transform]);

  if (!isSelected) return null;

  return (
    <Group>
      {/* Transformer for resize/rotate handles */}
      <Rect
        x={transformBounds.x}
        y={transformBounds.y}
        width={transformBounds.width}
        height={transformBounds.height}
        rotation={transformBounds.rotation}
        scaleX={transformBounds.scaleX}
        scaleY={transformBounds.scaleY}
        id={element.id}
        draggable={!element.locked}
        onDragMove={handleTransform}
        onDragEnd={handleTransformEnd}
        onTransform={handleTransform}
        onTransformEnd={handleTransformEnd}
        onTransformStart={handleTransformStart}
      />

      {/* Custom resize handles for better UX */}
      {isSelected && !element.locked && (
        <>
          {/* Corner resize handles */}
          <Circle
            x={transformBounds.x}
            y={transformBounds.y}
            radius={6 / scale}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2 / scale}
            draggable
            onDragMove={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newY = snapToGridValue(e.target.y());
              const newWidth = transformBounds.width + (transformBounds.x - newX);
              const newHeight = transformBounds.height + (transformBounds.y - newY);

              if (newWidth > 10 && newHeight > 10) {
                onTransform(element.id, {
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight
                });
              }
            }}
            onDragEnd={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newY = snapToGridValue(e.target.y());
              const newWidth = transformBounds.width + (transformBounds.x - newX);
              const newHeight = transformBounds.height + (transformBounds.y - newY);

              if (newWidth > 10 && newHeight > 10) {
                onTransformEnd(element.id, {
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight
                });
              }
            }}
          />

          <Circle
            x={transformBounds.x + transformBounds.width}
            y={transformBounds.y}
            radius={6 / scale}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2 / scale}
            draggable
            onDragMove={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newWidth = newX - transformBounds.x;

              if (newWidth > 10) {
                onTransform(element.id, { width: newWidth });
              }
            }}
            onDragEnd={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newWidth = newX - transformBounds.x;

              if (newWidth > 10) {
                onTransformEnd(element.id, { width: newWidth });
              }
            }}
          />

          <Circle
            x={transformBounds.x}
            y={transformBounds.y + transformBounds.height}
            radius={6 / scale}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2 / scale}
            draggable
            onDragMove={(e) => {
              const newY = snapToGridValue(e.target.y());
              const newHeight = newY - transformBounds.y;

              if (newHeight > 10) {
                onTransform(element.id, { height: newHeight });
              }
            }}
            onDragEnd={(e) => {
              const newY = snapToGridValue(e.target.y());
              const newHeight = newY - transformBounds.y;

              if (newHeight > 10) {
                onTransformEnd(element.id, { height: newHeight });
              }
            }}
          />

          <Circle
            x={transformBounds.x + transformBounds.width}
            y={transformBounds.y + transformBounds.height}
            radius={6 / scale}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2 / scale}
            draggable
            onDragMove={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newY = snapToGridValue(e.target.y());
              const newWidth = newX - transformBounds.x;
              const newHeight = newY - transformBounds.y;

              if (newWidth > 10 && newHeight > 10) {
                onTransform(element.id, {
                  width: newWidth,
                  height: newHeight
                });
              }
            }}
            onDragEnd={(e) => {
              const newX = snapToGridValue(e.target.x());
              const newY = snapToGridValue(e.target.y());
              const newWidth = newX - transformBounds.x;
              const newHeight = newY - transformBounds.y;

              if (newWidth > 10 && newHeight > 10) {
                onTransformEnd(element.id, {
                  width: newWidth,
                  height: newHeight
                });
              }
            }}
          />

          {/* Rotation handle */}
          <Circle
            x={transformBounds.x + transformBounds.width / 2}
            y={transformBounds.y - 20 / scale}
            radius={6 / scale}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2 / scale}
            draggable
            onDragMove={(e) => {
              const centerX = transformBounds.x + transformBounds.width / 2;
              const centerY = transformBounds.y + transformBounds.height / 2;
              const handleX = e.target.x();
              const handleY = e.target.y();

              if (typeof handleX === 'number' && typeof handleY === 'number') {
                const angle = Math.atan2(handleY - centerY, handleX - centerX);
                const rotation = (angle * 180) / Math.PI;
                onTransform(element.id, { rotation });
              }
            }}
            onDragEnd={(e) => {
              const centerX = transformBounds.x + transformBounds.width / 2;
              const centerY = transformBounds.y + transformBounds.height / 2;
              const handleX = e.target.x();
              const handleY = e.target.y();

              if (typeof handleX === 'number' && typeof handleY === 'number') {
                const angle = Math.atan2(handleY - centerY, handleX - centerX);
                const rotation = (angle * 180) / Math.PI;
                onTransformEnd(element.id, { rotation });
              }
            }}
          />

          {/* Rotation line */}
          <Line
            points={[
              transformBounds.x + transformBounds.width / 2,
              transformBounds.y + transformBounds.height / 2,
              transformBounds.x + transformBounds.width / 2,
              transformBounds.y - 20 / scale
            ]}
            stroke="#3b82f6"
            strokeWidth={2 / scale}
            dash={[5 / scale, 5 / scale]}
          />
        </>
      )}
    </Group>
  );
};