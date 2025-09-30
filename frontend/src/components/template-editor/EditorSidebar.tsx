'use client';

import React, { useState } from 'react';
import {
  Shapes,
  Type,
  Image,
  Upload,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Triangle,
  Circle,
  Square,
  FileText,
  BarChart3,
  Frame,
  LayoutGrid
} from 'lucide-react';
import { SidebarTab, TemplateElement } from '@/types/template-editor';
import { AssetLibrary } from './AssetLibrary';
import { AssetItem } from '@/lib/asset-library';

export interface EditorSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onElementsAdd: (elements: TemplateElement[]) => void;
  className?: string;
}

interface TabConfig {
  id: SidebarTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const TABS: TabConfig[] = [
  {
    id: 'elements',
    label: 'Elements',
    icon: <Shapes size={18} />
  },
  {
    id: 'text',
    label: 'Text',
    icon: <Type size={18} />
  },
  {
    id: 'backgrounds',
    label: 'Backgrounds',
    icon: <Image size={18} />
  },
  {
    id: 'uploads',
    label: 'Uploads',
    icon: <Upload size={18} />
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <Bookmark size={18} />
  }
];

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  onElementsAdd,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [elementsCategory, setElementsCategory] = useState('graphics');

  const handleAssetSelect = (asset: AssetItem) => {
    // This will be implemented when we add drag and drop
    console.log('Asset selected:', asset);
  };

  const handleElementClick = (elementType: string, elementData: any) => {
    // Handle non-asset elements (text, backgrounds, etc.)
    console.log('Adding element:', elementType, elementData);
  };

  const renderElementsTab = () => (
    <AssetLibrary
      category={elementsCategory}
      searchQuery={searchQuery}
      onAssetSelect={handleAssetSelect}
      onElementsAdd={(elements) => {
        // Convert assets to elements and add to canvas
        console.log('Adding elements to canvas:', elements);
      }}
    />
  );

  const renderTextTab = () => (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Text Presets</h3>
        <div className="space-y-2">
          {[
            { name: 'Heading 1', size: '32px', weight: 'Bold' },
            { name: 'Heading 2', size: '24px', weight: 'Bold' },
            { name: 'Body Text', size: '16px', weight: 'Normal' },
            { name: 'Caption', size: '12px', weight: 'Normal' }
          ].map(preset => (
            <button
              key={preset.name}
              onClick={() => handleElementClick('text', preset)}
              className="w-full p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.size} • {preset.weight}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Property Fields</h3>
        <div className="space-y-2">
          {[
            { label: 'Price', placeholder: '{{price}}' },
            { label: 'Address', placeholder: '{{address}}' },
            { label: 'Bedrooms', placeholder: '{{beds}}' },
            { label: 'Bathrooms', placeholder: '{{baths}}' },
            { label: 'Agent Name', placeholder: '{{agent_name}}' }
          ].map(field => (
            <button
              key={field.placeholder}
              onClick={() => handleElementClick('text', { text: field.placeholder })}
              className="w-full p-2 text-left text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium">{field.label}</div>
              <div className="text-xs text-blue-600">{field.placeholder}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackgroundsTab = () => (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Solid Colors</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
            '#ced4da', '#adb5bd', '#6c757d', '#495057',
            '#343a40', '#212529', '#007bff', '#28a745',
            '#dc3545', '#ffc107', '#fd7e14', '#6610f2'
          ].map(color => (
            <button
              key={color}
              onClick={() => handleElementClick('background', { type: 'solid', color })}
              className="aspect-square rounded-md border-2 border-gray-200 hover:border-gray-400"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Gradients</h3>
        <div className="space-y-2">
          {[
            { name: 'Sunset', colors: ['#ff6b6b', '#ffa500'] },
            { name: 'Ocean', colors: ['#2196f3', '#21cbf3'] },
            { name: 'Forest', colors: ['#4caf50', '#8bc34a'] },
            { name: 'Purple', colors: ['#9c27b0', '#e91e63'] }
          ].map(gradient => (
            <button
              key={gradient.name}
              onClick={() => handleElementClick('background', { type: 'gradient', ...gradient })}
              className="w-full p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium text-sm">{gradient.name}</div>
              <div className="flex space-x-1 mt-1">
                {gradient.colors.map(color => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUploadsTab = () => (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Upload Files</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here or click to browse
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Choose Files
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Supports: JPG, PNG, SVG, PDF
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Uploads</h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 border border-gray-200 rounded-md">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium">image{index + 1}.jpg</div>
                <div className="text-xs text-gray-500">2.3 MB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Template Categories</h3>
        <div className="space-y-2">
          {[
            { name: 'Property Listings', count: 12 },
            { name: 'Social Media Posts', count: 8 },
            { name: 'Flyers', count: 15 },
            { name: 'Brochures', count: 6 }
          ].map(category => (
            <button
              key={category.name}
              className="w-full p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="font-medium text-sm">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} templates</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index}
              className="aspect-[4/3] bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200 flex items-center justify-center"
            >
              <FileText size={24} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'elements':
        return renderElementsTab();
      case 'text':
        return renderTextTab();
      case 'backgrounds':
        return renderBackgroundsTab();
      case 'uploads':
        return renderUploadsTab();
      case 'templates':
        return renderTemplatesTab();
      default:
        return renderElementsTab();
    }
  };

  return (
    <div className={`flex bg-white border-r border-gray-200 ${className}`}>
      {/* Tab Navigation */}
      <div className={`flex flex-col border-r border-gray-200 ${collapsed ? 'w-12' : 'w-16'}`}>
        <div className="p-2 border-b border-gray-200">
          <button
            onClick={onToggleCollapse}
            className="w-full p-2 rounded-md hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full p-3 flex flex-col items-center space-y-1 relative ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={collapsed ? tab.label : undefined}
            >
              {tab.icon}
              {!collapsed && (
                <span className="text-xs font-medium">{tab.label}</span>
              )}
              {tab.badge && !collapsed && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      )}
    </div>
  );
};