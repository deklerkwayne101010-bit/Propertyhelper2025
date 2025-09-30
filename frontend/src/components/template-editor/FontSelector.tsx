'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Palette } from 'lucide-react';
import {
  GoogleFont,
  realEstateFonts,
  fontCategories,
  fontWeights,
  fontPreviewTexts,
  textStylePresets,
  fontLoader,
  getFontStack
} from '@/lib/google-fonts';

export interface FontSelectorProps {
  value: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
  };
  onChange: (value: FontSelectorProps['value']) => void;
  className?: string;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof fontCategories>('heading');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Load fonts when component mounts
  useEffect(() => {
    const loadInitialFonts = async () => {
      try {
        await fontLoader.loadFonts(['Inter', 'Roboto', 'Montserrat', 'Playfair Display']);
        setLoadedFonts(new Set(['Inter', 'Roboto', 'Montserrat', 'Playfair Display']));
      } catch (error) {
        console.error('Failed to load initial fonts:', error);
      }
    };

    loadInitialFonts();
  }, []);

  // Filter fonts based on search and category
  const filteredFonts = useMemo(() => {
    let fonts = realEstateFonts;

    // Filter by category
    if (selectedCategory) {
      const categoryFonts = fontCategories[selectedCategory].fonts;
      fonts = fonts.filter(font => categoryFonts.includes(font.family));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      fonts = fonts.filter(font =>
        font.family.toLowerCase().includes(query) ||
        font.category.toLowerCase().includes(query)
      );
    }

    return fonts;
  }, [searchQuery, selectedCategory]);

  const handleFontSelect = async (font: GoogleFont) => {
    try {
      // Load the font if not already loaded
      if (!loadedFonts.has(font.family)) {
        await fontLoader.loadFonts([font.family]);
        setLoadedFonts(prev => new Set(Array.from(prev).concat(font.family)));
      }

      onChange({
        ...value,
        fontFamily: font.family
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to load font:', error);
    }
  };

  const handlePresetSelect = (preset: typeof textStylePresets[0]) => {
    onChange({
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight.toString(),
      color: preset.color
    });
  };

  const currentFont = realEstateFonts.find(f => f.family === value.fontFamily);

  return (
    <div className={`relative ${className}`}>
      {/* Font Family Selector */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              className="text-sm truncate"
              style={{ fontFamily: getFontStack(value.fontFamily) }}
            >
              {value.fontFamily}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <input
            type="number"
            value={value.fontSize}
            onChange={(e) => onChange({ ...value, fontSize: parseInt(e.target.value) || 16 })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="8"
            max="200"
          />
        </div>

        {/* Font Weight */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Weight
          </label>
          <select
            value={value.fontWeight}
            onChange={(e) => onChange({ ...value, fontWeight: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentFont?.variants.map(weight => (
              <option key={weight} value={weight}>
                {fontWeights[weight as keyof typeof fontWeights]} ({weight})
              </option>
            ))}
          </select>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value.color}
              onChange={(e) => onChange({ ...value, color: e.target.value })}
              className="w-8 h-8 rounded border border-gray-300"
            />
            <input
              type="text"
              value={value.color}
              onChange={(e) => onChange({ ...value, color: e.target.value })}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Font Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex border-b border-gray-200">
            {Object.entries(fontCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as keyof typeof fontCategories)}
                className={`flex-1 px-3 py-2 text-xs font-medium ${
                  selectedCategory === key
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Font List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredFonts.map((font) => (
              <button
                key={font.family}
                onClick={() => handleFontSelect(font)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                style={{ fontFamily: getFontStack(font.family) }}
              >
                <div>
                  <div className="font-medium text-sm">{font.family}</div>
                  <div className="text-xs text-gray-500 capitalize">{font.category}</div>
                </div>
                {loadedFonts.has(font.family) && (
                  <Check size={16} className="text-green-600" />
                )}
              </button>
            ))}
          </div>

          {/* Text Style Presets */}
          <div className="border-t border-gray-200 p-2">
            <div className="text-xs font-medium text-gray-700 mb-2">Quick Styles</div>
            <div className="grid grid-cols-2 gap-1">
              {textStylePresets.slice(0, 4).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-left"
                  style={{ fontFamily: getFontStack(preset.fontFamily) }}
                >
                  <div className="font-medium truncate">{preset.name}</div>
                  <div className="text-gray-500 truncate">{preset.fontSize}px</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Font Preview */}
      <div className="mt-3 p-3 bg-gray-50 rounded-md">
        <div className="text-xs text-gray-600 mb-1">Preview</div>
        <div
          className="text-lg leading-relaxed"
          style={{
            fontFamily: getFontStack(value.fontFamily),
            fontSize: `${Math.min(value.fontSize, 24)}px`,
            fontWeight: value.fontWeight,
            color: value.color
          }}
        >
          {fontPreviewTexts[selectedCategory as keyof typeof fontPreviewTexts] || fontPreviewTexts.body}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};