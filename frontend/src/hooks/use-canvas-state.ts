import { useState, useCallback, useRef, useEffect } from 'react';
import {
  CanvasState,
  TemplateElement,
  HistoryState,
  Point,
  Size,
  Transform,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_GRID_SIZE,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  ElementType,
  TextElement,
  ShapeElement,
  ImageElement,
  SVGElement,
  ChartElement,
  FrameElement,
  GridElement
} from '@/types/template-editor';

const MAX_HISTORY_SIZE = 50;

export const useCanvasState = (initialElements: TemplateElement[] = []) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: initialElements,
    selectedElements: [],
    clipboard: [],
    history: [],
    historyIndex: -1,
    zoom: DEFAULT_ZOOM,
    pan: { x: 0, y: 0 },
    gridSize: DEFAULT_GRID_SIZE,
    snapToGrid: true,
    showGuides: true,
    canvasSize: DEFAULT_CANVAS_SIZE,
    background: {
      type: 'solid',
      value: '#ffffff'
    }
  });

  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const lastSaveTime = useRef<number>(Date.now());

  // History management
  const saveToHistory = useCallback(() => {
    const newHistoryState: HistoryState = {
      elements: JSON.parse(JSON.stringify(canvasState.elements)),
      timestamp: Date.now()
    };

    setCanvasState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newHistoryState);

      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, [canvasState.elements]);

  const undo = useCallback(() => {
    if (canvasState.historyIndex > 0) {
      const newIndex = canvasState.historyIndex - 1;
      const historyState = canvasState.history[newIndex];

      setCanvasState(prev => ({
        ...prev,
        elements: historyState.elements,
        historyIndex: newIndex
      }));
    }
  }, [canvasState.historyIndex, canvasState.history]);

  const redo = useCallback(() => {
    if (canvasState.historyIndex < canvasState.history.length - 1) {
      const newIndex = canvasState.historyIndex + 1;
      const historyState = canvasState.history[newIndex];

      setCanvasState(prev => ({
        ...prev,
        elements: historyState.elements,
        historyIndex: newIndex
      }));
    }
  }, [canvasState.historyIndex, canvasState.history]);

  // Element management
  const addElement = useCallback((element: TemplateElement) => {
    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, element]
    }));
    saveToHistory();
  }, [saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<TemplateElement>) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      ) as TemplateElement[]
    }));
  }, []);

  const removeElement = useCallback((elementId: string) => {
    setCanvasState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      selectedElements: prev.selectedElements.filter(id => id !== elementId)
    }));
    saveToHistory();
  }, [saveToHistory]);

  const duplicateElement = useCallback((elementId: string) => {
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const duplicatedElement: TemplateElement = {
        ...JSON.parse(JSON.stringify(element)),
        id: `${element.type}_${Date.now()}`,
        name: `${element.name} Copy`,
        transform: {
          ...element.transform,
          x: element.transform.x + 20,
          y: element.transform.y + 20
        }
      };

      setCanvasState(prev => ({
        ...prev,
        elements: [...prev.elements, duplicatedElement]
      }));
      saveToHistory();
    }
  }, [canvasState.elements, saveToHistory]);

  // Selection management
  const selectElement = useCallback((elementId: string, multiSelect = false) => {
    setCanvasState(prev => {
      if (multiSelect) {
        const isSelected = prev.selectedElements.includes(elementId);
        return {
          ...prev,
          selectedElements: isSelected
            ? prev.selectedElements.filter(id => id !== elementId)
            : [...prev.selectedElements, elementId]
        };
      } else {
        return {
          ...prev,
          selectedElements: [elementId]
        };
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      selectedElements: []
    }));
  }, []);

  const selectAll = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      selectedElements: prev.elements.map(el => el.id)
    }));
  }, [canvasState.elements]);

  // Element operations
  const updateElementTransform = useCallback((elementId: string, transform: Partial<Transform>) => {
    updateElement(elementId, {
      transform: { ...canvasState.elements.find(el => el.id === elementId)!.transform, ...transform }
    });
  }, [canvasState.elements, updateElement]);

  const updateElementStyle = useCallback((elementId: string, style: Partial<TemplateElement['style']>) => {
    updateElement(elementId, {
      style: { ...canvasState.elements.find(el => el.id === elementId)!.style, ...style }
    });
  }, [canvasState.elements, updateElement]);

  const moveElements = useCallback((elementIds: string[], delta: Point) => {
    elementIds.forEach(elementId => {
      const element = canvasState.elements.find(el => el.id === elementId);
      if (element) {
        updateElementTransform(elementId, {
          x: element.transform.x + delta.x,
          y: element.transform.y + delta.y
        });
      }
    });
  }, [canvasState.elements, updateElementTransform]);

  const resizeElements = useCallback((elementIds: string[], size: Size) => {
    elementIds.forEach(elementId => {
      updateElementTransform(elementId, {
        width: size.width,
        height: size.height
      });
    });
  }, [updateElementTransform]);

  const rotateElements = useCallback((elementIds: string[], rotation: number) => {
    elementIds.forEach(elementId => {
      updateElementTransform(elementId, { rotation });
    });
  }, [updateElementTransform]);

  const flipElements = useCallback((elementIds: string[], flipX = false, flipY = false) => {
    elementIds.forEach(elementId => {
      const element = canvasState.elements.find(el => el.id === elementId);
      if (element) {
        updateElementTransform(elementId, {
          scaleX: flipX ? -element.transform.scaleX : element.transform.scaleX,
          scaleY: flipY ? -element.transform.scaleY : element.transform.scaleY
        });
      }
    });
  }, [canvasState.elements, updateElementTransform]);

  // Layer management
  const bringToFront = useCallback((elementId: string) => {
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const maxZIndex = Math.max(...canvasState.elements.map(el => el.zIndex));
      updateElement(elementId, { zIndex: maxZIndex + 1 });
    }
  }, [canvasState.elements, updateElement]);

  const sendToBack = useCallback((elementId: string) => {
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const minZIndex = Math.min(...canvasState.elements.map(el => el.zIndex));
      updateElement(elementId, { zIndex: minZIndex - 1 });
    }
  }, [canvasState.elements, updateElement]);

  const moveUp = useCallback((elementId: string) => {
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const currentZIndex = element.zIndex;
      const nextElement = canvasState.elements
        .filter(el => el.zIndex > currentZIndex)
        .sort((a, b) => a.zIndex - b.zIndex)[0];

      if (nextElement) {
        updateElement(elementId, { zIndex: nextElement.zIndex });
        updateElement(nextElement.id, { zIndex: currentZIndex });
      }
    }
  }, [canvasState.elements, updateElement]);

  const moveDown = useCallback((elementId: string) => {
    const element = canvasState.elements.find(el => el.id === elementId);
    if (element) {
      const currentZIndex = element.zIndex;
      const prevElement = canvasState.elements
        .filter(el => el.zIndex < currentZIndex)
        .sort((a, b) => b.zIndex - a.zIndex)[0];

      if (prevElement) {
        updateElement(elementId, { zIndex: prevElement.zIndex });
        updateElement(prevElement.id, { zIndex: currentZIndex });
      }
    }
  }, [canvasState.elements, updateElement]);

  // Group/Ungroup operations
  const groupElements = useCallback((elementIds: string[]) => {
    const elements = canvasState.elements.filter(el => elementIds.includes(el.id));
    if (elements.length < 2) return;

    // Calculate group bounds
    const bounds = elements.reduce(
      (acc, el) => ({
        minX: Math.min(acc.minX, el.transform.x),
        minY: Math.min(acc.minY, el.transform.y),
        maxX: Math.max(acc.maxX, el.transform.x + el.transform.width),
        maxY: Math.max(acc.maxY, el.transform.y + el.transform.height)
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const groupElement: ShapeElement = {
      id: `group_${Date.now()}`,
      type: 'shape' as const,
      name: 'Group',
      shapeType: 'rectangle' as const,
      transform: {
        x: bounds.minX,
        y: bounds.minY,
        width: bounds.maxX - bounds.minX,
        height: bounds.maxY - bounds.minY,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
      },
      style: {
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeWidth: 2,
        opacity: 1
      },
      locked: false,
      visible: true,
      zIndex: Math.max(...elements.map(el => el.zIndex)) + 1
    };

    // Remove individual elements and add group
    setCanvasState(prev => ({
      ...prev,
      elements: [
        ...prev.elements.filter(el => !elementIds.includes(el.id)),
        groupElement
      ],
      selectedElements: [groupElement.id]
    }));

    saveToHistory();
  }, [canvasState.elements, saveToHistory]);

  const ungroupElements = useCallback((groupId: string) => {
    // For now, just remove the group element
    // In a full implementation, you'd restore the original elements
    removeElement(groupId);
  }, [removeElement]);

  // Clipboard operations
  const copyElements = useCallback(() => {
    const elements = canvasState.elements.filter(el =>
      canvasState.selectedElements.includes(el.id)
    );
    setCanvasState(prev => ({
      ...prev,
      clipboard: JSON.parse(JSON.stringify(elements))
    }));
  }, [canvasState.elements, canvasState.selectedElements]);

  const pasteElements = useCallback(() => {
    if (canvasState.clipboard.length === 0) return;

    const pastedElements = canvasState.clipboard.map(element => ({
      ...JSON.parse(JSON.stringify(element)),
      id: `${element.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${element.name} Copy`,
      transform: {
        ...element.transform,
        x: element.transform.x + 20,
        y: element.transform.y + 20
      },
      zIndex: Math.max(...canvasState.elements.map(el => el.zIndex), 0) + 1
    }));

    setCanvasState(prev => ({
      ...prev,
      elements: [...prev.elements, ...pastedElements],
      selectedElements: pastedElements.map(el => el.id)
    }));

    saveToHistory();
  }, [canvasState.clipboard, canvasState.elements, saveToHistory]);

  const cutElements = useCallback(() => {
    copyElements();
    const elementIds = [...canvasState.selectedElements];
    elementIds.forEach(id => removeElement(id));
  }, [canvasState.selectedElements, copyElements, removeElement]);

  // Canvas operations
  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    setCanvasState(prev => ({
      ...prev,
      zoom: clampedZoom
    }));
  }, []);

  const setPan = useCallback((pan: Point) => {
    setCanvasState(prev => ({
      ...prev,
      pan
    }));
  }, []);

  const resetView = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: DEFAULT_ZOOM,
      pan: { x: 0, y: 0 }
    }));
  }, []);

  const setCanvasSize = useCallback((size: Size) => {
    setCanvasState(prev => ({
      ...prev,
      canvasSize: size
    }));
  }, []);

  const setBackground = useCallback((background: CanvasState['background']) => {
    setCanvasState(prev => ({
      ...prev,
      background
    }));
  }, []);

  // Grid and guides
  const toggleGrid = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      snapToGrid: !prev.snapToGrid
    }));
  }, []);

  const toggleGuides = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      showGuides: !prev.showGuides
    }));
  }, []);

  const setGridSize = useCallback((size: number) => {
    setCanvasState(prev => ({
      ...prev,
      gridSize: size
    }));
  }, []);

  // Auto-save functionality
  const enableAutoSave = useCallback((interval = 30000) => { // 30 seconds default
    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current);
    }

    autoSaveTimer.current = setInterval(() => {
      // Auto-save logic would go here
      lastSaveTime.current = Date.now();
      console.log('Auto-saving template...');
    }, interval);
  }, []);

  const disableAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current);
      autoSaveTimer.current = undefined;
    }
  }, []);

  // Keyboard shortcuts
  const handleKeyboardShortcut = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, shiftKey, metaKey } = event;
    const isCtrl = ctrlKey || metaKey;

    if (isCtrl) {
      switch (key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          event.preventDefault();
          redo();
          break;
        case 'a':
          event.preventDefault();
          selectAll();
          break;
        case 'c':
          event.preventDefault();
          copyElements();
          break;
        case 'v':
          event.preventDefault();
          pasteElements();
          break;
        case 'x':
          event.preventDefault();
          cutElements();
          break;
        case 'd':
          event.preventDefault();
          const selectedIds = canvasState.selectedElements;
          selectedIds.forEach(id => duplicateElement(id));
          break;
        case 'g':
          event.preventDefault();
          if (canvasState.selectedElements.length > 1) {
            groupElements(canvasState.selectedElements);
          }
          break;
      }
    } else if (key === 'Escape') {
      clearSelection();
    } else if (key === 'Delete' || key === 'Backspace') {
      const selectedIds = [...canvasState.selectedElements];
      selectedIds.forEach(id => removeElement(id));
    }
  }, [undo, redo, selectAll, copyElements, pasteElements, cutElements, duplicateElement, groupElements, clearSelection, removeElement, canvasState.selectedElements]);

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, [handleKeyboardShortcut]);

  // Cleanup auto-save on unmount
  useEffect(() => {
    return () => {
      disableAutoSave();
    };
  }, [disableAutoSave]);

  // Element factory functions
  const createTextElement = useCallback((
    text: string,
    position: Point,
    fontSize = 24,
    fontFamily = 'Inter'
  ): TextElement => {
    const maxZIndex = Math.max(...canvasState.elements.map(el => el.zIndex), 0);
    return {
      id: `text_${Date.now()}`,
      type: 'text' as const,
      name: 'Text',
      text,
      fontFamily,
      fontSize,
      fontWeight: 'normal' as const,
      fontStyle: 'normal' as const,
      textAlign: 'left' as const,
      textDecoration: 'none' as const,
      fill: '#000000',
      transform: {
        x: position.x,
        y: position.y,
        width: 200,
        height: fontSize * 1.2,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
      },
      style: {
        opacity: 1
      },
      locked: false,
      visible: true,
      zIndex: maxZIndex + 1
    };
  }, [canvasState.elements]);

  const createShapeElement = useCallback((
    shapeType: ShapeElement['shapeType'],
    position: Point,
    size: Size
  ): ShapeElement => {
    const maxZIndex = Math.max(...canvasState.elements.map(el => el.zIndex), 0);
    return {
      id: `shape_${Date.now()}`,
      type: 'shape' as const,
      name: `${shapeType} Shape`,
      shapeType,
      transform: {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
      },
      style: {
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2,
        opacity: 1
      },
      locked: false,
      visible: true,
      zIndex: maxZIndex + 1
    };
  }, [canvasState.elements]);

  const createImageElement = useCallback((
    src: string,
    position: Point,
    size: Size
  ): ImageElement => {
    const maxZIndex = Math.max(...canvasState.elements.map(el => el.zIndex), 0);
    return {
      id: `image_${Date.now()}`,
      type: 'image' as const,
      name: 'Image',
      src,
      transform: {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0
      },
      style: {
        opacity: 1
      },
      locked: false,
      visible: true,
      zIndex: maxZIndex + 1
    };
  }, [canvasState.elements]);

  return {
    // State
    canvasState,

    // History
    saveToHistory,
    undo,
    redo,
    canUndo: canvasState.historyIndex > 0,
    canRedo: canvasState.historyIndex < canvasState.history.length - 1,

    // Elements
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    createTextElement,
    createShapeElement,
    createImageElement,

    // Selection
    selectElement,
    clearSelection,
    selectAll,

    // Element operations
    updateElementTransform,
    updateElementStyle,
    moveElements,
    resizeElements,
    rotateElements,
    flipElements,

    // Layer management
    bringToFront,
    sendToBack,
    moveUp,
    moveDown,

    // Group operations
    groupElements,
    ungroupElements,

    // Clipboard
    copyElements,
    pasteElements,
    cutElements,

    // Canvas
    setZoom,
    setPan,
    resetView,
    setCanvasSize,
    setBackground,

    // Grid and guides
    toggleGrid,
    toggleGuides,
    setGridSize,

    // Auto-save
    enableAutoSave,
    disableAutoSave,

    // Utilities
    getSelectedElements: () => canvasState.elements.filter(el =>
      canvasState.selectedElements.includes(el.id)
    ),
    getElementById: (id: string) => canvasState.elements.find(el => el.id === id),
    isElementSelected: (id: string) => canvasState.selectedElements.includes(id)
  };
};