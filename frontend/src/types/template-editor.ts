// Core template editor types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
}

export interface ElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffset?: Point;
  cornerRadius?: number;
}

// Base element interface
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  transform: Transform;
  style: ElementStyle;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

// Text element
export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'lighter';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  textDecoration: 'none' | 'underline' | 'line-through';
  fill: string;
  placeholder?: string; // For dynamic content like {{price}}
}

// Shape element
export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow';
}

// Image element
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// SVG element
export interface SVGElement extends BaseElement {
  type: 'svg';
  svgContent: string;
  fill?: string;
}

// Chart element
export interface ChartElement extends BaseElement {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'area';
  data: ChartDataPoint[];
  colors: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

// Frame element
export interface FrameElement extends BaseElement {
  type: 'frame';
  frameType: 'house' | 'polaroid' | 'agent' | 'badge';
  borderWidth: number;
  borderColor: string;
}

// Grid element
export interface GridElement extends BaseElement {
  type: 'grid';
  gridType: 'social' | 'flyer' | 'brochure';
  rows: number;
  columns: number;
  gap: number;
}

// Union type for all elements
export type TemplateElement =
  | TextElement
  | ShapeElement
  | ImageElement
  | SVGElement
  | ChartElement
  | FrameElement
  | GridElement;

export type ElementType =
  | 'text'
  | 'shape'
  | 'image'
  | 'svg'
  | 'chart'
  | 'frame'
  | 'grid';

// Canvas state
export interface CanvasState {
  elements: TemplateElement[];
  selectedElements: string[];
  clipboard: TemplateElement[];
  history: HistoryState[];
  historyIndex: number;
  zoom: number;
  pan: Point;
  gridSize: number;
  snapToGrid: boolean;
  showGuides: boolean;
  canvasSize: Size;
  background: CanvasBackground;
}

export interface HistoryState {
  elements: TemplateElement[];
  timestamp: number;
}

export interface CanvasBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  value: string | Gradient | ImageBackground;
}

export interface Gradient {
  type: 'linear' | 'radial';
  angle?: number;
  colors: { color: string; offset: number }[];
}

export interface ImageBackground {
  src: string;
  opacity: number;
  scale: number;
}

// Asset library types
export interface AssetCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  assets: AssetItem[];
  color?: string;
  count: number;
}

export interface AssetItem {
  id: string;
  name: string;
  type: ElementType;
  category: string;
  thumbnail: string;
  preview: string;
  data: any; // Element-specific data
  tags: string[];
  metadata?: AssetMetadata;
  variants?: AssetVariant[];
  isFavorite?: boolean;
  collection?: string;
  usageCount?: number;
  lastUsed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetMetadata {
  description?: string;
  usage?: string;
  compatibility?: string[];
  author?: string;
  license?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  colorVariants?: string[];
  style?: 'minimal' | 'detailed' | 'colorful' | 'monochrome';
  propertyType?: ('residential' | 'commercial' | 'luxury' | 'rental' | 'vacation')[];
  marketingUse?: ('social' | 'flyer' | 'brochure' | 'website' | 'email')[];
}

export interface AssetVariant {
  id: string;
  name: string;
  color?: string;
  style?: string;
  data: any;
  thumbnail: string;
}

export interface AssetCollection {
  id: string;
  name: string;
  description: string;
  assets: string[]; // Asset IDs
  category: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetSearchFilters {
  query: string;
  category?: string;
  type?: ElementType;
  tags?: string[];
  propertyType?: string[];
  marketingUse?: string[];
  style?: string;
  hasVariants?: boolean;
  isFavorite?: boolean;
  collection?: string;
  sortBy?: 'name' | 'usage' | 'recent' | 'created';
  sortOrder?: 'asc' | 'desc';
}

// Text presets
export interface TextPreset {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'lighter';
  fontStyle: 'normal' | 'italic';
  color: string;
  category: 'heading' | 'subheading' | 'body' | 'caption';
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  subcategory?: string;
  elements: TemplateElement[];
  canvasSize: Size;
  background: CanvasBackground;
  tags: string[];
  variables: TemplateVariable[];
  isPublic: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  parentTemplateId?: string;
}

export type TemplateCategory =
  | 'residential-sale'
  | 'rental'
  | 'luxury'
  | 'commercial'
  | 'social-media'
  | 'flyer'
  | 'brochure'
  | 'business-card'
  | 'email'
  | 'website';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean';
  defaultValue?: any;
  required: boolean;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface TemplateCollection {
  id: string;
  name: string;
  description: string;
  templates: string[]; // Template IDs
  category: TemplateCategory;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Export options
export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'svg';
  quality: number;
  scale: number;
  background: boolean;
}

// Property panel types
export interface PropertySection {
  id: string;
  name: string;
  icon: string;
  component: string;
  properties: Property[];
}

export interface Property {
  id: string;
  name: string;
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'slider';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

// Sidebar tab types
export type SidebarTab =
  | 'elements'
  | 'text'
  | 'backgrounds'
  | 'uploads'
  | 'templates';

// Keyboard shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
}

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  maxVersions: number;
}

// Template versioning
export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  name: string;
  description?: string;
  elements: TemplateElement[];
  createdAt: string;
  createdBy: string;
}

// Drag and drop
export interface DragItem {
  type: 'asset' | 'element';
  elementType?: ElementType;
  assetId?: string;
  elementId?: string;
  data?: any;
}

// Multi-select
export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Zoom and pan
export interface ViewportTransform {
  zoom: number;
  panX: number;
  panY: number;
}

// Alignment guides
export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  elements: string[];
}

// Snap points
export interface SnapPoint {
  x: number;
  y: number;
  type: 'grid' | 'element' | 'canvas';
}

// Animation and transitions
export interface AnimationPreset {
  id: string;
  name: string;
  duration: number;
  easing: string;
  properties: string[];
}

// Collaboration (future)
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: Point;
  selection?: string[];
}

// Error handling
export interface EditorError {
  id: string;
  type: 'validation' | 'network' | 'permission' | 'system';
  message: string;
  elementId?: string;
  timestamp: number;
}

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  elementCount: number;
  lastUpdate: number;
}

// Accessibility
export interface AccessibilityInfo {
  role: string;
  label: string;
  description?: string;
  keyboardShortcuts: string[];
  focusable: boolean;
}

// Mobile responsive
export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  canvasSize: Size;
  sidebarCollapsed: boolean;
}

// Plugin system (future extensibility)
export interface EditorPlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  components: PluginComponent[];
  hooks: PluginHook[];
}

export interface PluginComponent {
  name: string;
  component: React.ComponentType;
  position: 'toolbar' | 'sidebar' | 'properties' | 'canvas';
}

export interface PluginHook {
  name: string;
  callback: Function;
}

// Event system
export interface EditorEvent {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
}

// Validation
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (element: TemplateElement) => boolean;
  message: string;
}

// Theme system
export interface EditorTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

// Constants
export const ELEMENT_TYPES: ElementType[] = [
  'text',
  'shape',
  'image',
  'svg',
  'chart',
  'frame',
  'grid'
];

export const SIDEBAR_TABS: SidebarTab[] = [
  'elements',
  'text',
  'backgrounds',
  'uploads',
  'templates'
];

export const DEFAULT_CANVAS_SIZE: Size = {
  width: 800,
  height: 600
};

export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;

export const FONT_FAMILIES = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Raleway',
  'Nunito',
  'Merriweather'
];

export const TEXT_PRESETS: TextPreset[] = [
  {
    id: 'h1',
    name: 'Heading 1',
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#1f2937',
    category: 'heading'
  },
  {
    id: 'h2',
    name: 'Heading 2',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#374151',
    category: 'heading'
  },
  {
    id: 'body',
    name: 'Body Text',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#6b7280',
    category: 'body'
  },
  {
    id: 'caption',
    name: 'Caption',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#9ca3af',
    category: 'caption'
  }
];

export const PLACEHOLDER_PATTERNS = [
  { pattern: '{{price}}', description: 'Property price' },
  { pattern: '{{address}}', description: 'Property address' },
  { pattern: '{{agent_name}}', description: 'Agent name' },
  { pattern: '{{beds}}', description: 'Number of bedrooms' },
  { pattern: '{{baths}}', description: 'Number of bathrooms' },
  { pattern: '{{sqft}}', description: 'Square footage' },
  { pattern: '{{year_built}}', description: 'Year built' },
  { pattern: '{{mls_number}}', description: 'MLS number' },
  { pattern: '{{property_type}}', description: 'Property type' },
  { pattern: '{{listing_date}}', description: 'Listing date' }
];