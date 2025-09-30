// Google Fonts integration for the template editor

export interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
  version: string;
  lastModified: string;
  popularity: number;
}

// Real estate optimized Google Fonts
export const realEstateFonts: GoogleFont[] = [
  {
    family: 'Inter',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    category: 'sans-serif',
    version: '3.19',
    lastModified: '2021-03-24',
    popularity: 1000
  },
  {
    family: 'Roboto',
    variants: ['100', '300', '400', '500', '700', '900'],
    category: 'sans-serif',
    version: '2.137',
    lastModified: '2019-06-10',
    popularity: 999
  },
  {
    family: 'Open Sans',
    variants: ['300', '400', '500', '600', '700', '800'],
    category: 'sans-serif',
    version: '1.10',
    lastModified: '2017-05-31',
    popularity: 998
  },
  {
    family: 'Lato',
    variants: ['100', '300', '400', '700', '900'],
    category: 'sans-serif',
    version: '2.015',
    lastModified: '2019-03-26',
    popularity: 997
  },
  {
    family: 'Montserrat',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    category: 'sans-serif',
    version: '7.200',
    lastModified: '2020-01-15',
    popularity: 996
  },
  {
    family: 'Poppins',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    category: 'sans-serif',
    version: '4.003',
    lastModified: '2020-09-02',
    popularity: 995
  },
  {
    family: 'Playfair Display',
    variants: ['400', '500', '600', '700', '800', '900'],
    category: 'serif',
    version: '1.202',
    lastModified: '2020-09-21',
    popularity: 800
  },
  {
    family: 'Merriweather',
    variants: ['300', '400', '700', '900'],
    category: 'serif',
    version: '2.100',
    lastModified: '2019-01-10',
    popularity: 799
  },
  {
    family: 'Crimson Text',
    variants: ['400', '600'],
    category: 'serif',
    version: '1.002',
    lastModified: '2017-05-16',
    popularity: 798
  },
  {
    family: 'Raleway',
    variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    category: 'sans-serif',
    version: '4.101',
    lastModified: '2020-10-14',
    popularity: 900
  },
  {
    family: 'Nunito',
    variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
    category: 'sans-serif',
    version: '3.601',
    lastModified: '2019-12-04',
    popularity: 899
  },
  {
    family: 'Source Sans Pro',
    variants: ['200', '300', '400', '600', '700', '900'],
    category: 'sans-serif',
    version: '3.006',
    lastModified: '2019-05-28',
    popularity: 898
  },
  {
    family: 'Oswald',
    variants: ['200', '300', '400', '500', '600', '700'],
    category: 'sans-serif',
    version: '4.100',
    lastModified: '2019-01-10',
    popularity: 850
  },
  {
    family: 'PT Sans',
    variants: ['400', '700'],
    category: 'sans-serif',
    version: '2.005',
    lastModified: '2017-08-08',
    popularity: 849
  },
  {
    family: 'Ubuntu',
    variants: ['300', '400', '500', '700'],
    category: 'sans-serif',
    version: '1.011',
    lastModified: '2018-08-01',
    popularity: 848
  }
];

// Font categories for real estate
export const fontCategories = {
  heading: {
    name: 'Headings',
    description: 'Bold, impactful fonts for titles and headers',
    fonts: ['Playfair Display', 'Montserrat', 'Oswald', 'Poppins', 'Raleway']
  },
  subheading: {
    name: 'Subheadings',
    description: 'Readable fonts for section headers',
    fonts: ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Nunito']
  },
  body: {
    name: 'Body Text',
    description: 'Clean, readable fonts for main content',
    fonts: ['Inter', 'Source Sans Pro', 'Roboto', 'Open Sans', 'Lato']
  },
  caption: {
    name: 'Captions',
    description: 'Small, legible fonts for details and captions',
    fonts: ['Inter', 'Roboto', 'Open Sans', 'PT Sans', 'Ubuntu']
  },
  decorative: {
    name: 'Decorative',
    description: 'Stylish fonts for special occasions',
    fonts: ['Playfair Display', 'Crimson Text', 'Merriweather', 'Raleway']
  }
};

// Font weights mapping
export const fontWeights = {
  '100': 'Thin',
  '200': 'Extra Light',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semi Bold',
  '700': 'Bold',
  '800': 'Extra Bold',
  '900': 'Black'
};

// Generate Google Fonts URL
export const generateGoogleFontsUrl = (fonts: string[]): string => {
  const fontSpecs = fonts.map(font => {
    const googleFont = realEstateFonts.find(f => f.family === font);
    if (googleFont) {
      const weights = googleFont.variants.slice(0, 3).join(','); // Limit to 3 weights for performance
      return `${font.replace(/\s+/g, '+')}:${weights}`;
    }
    return font.replace(/\s+/g, '+');
  });

  return `https://fonts.googleapis.com/css2?${fontSpecs.map(spec => `family=${spec}`).join('&')}&display=swap`;
};

// Load Google Fonts dynamically
export const loadGoogleFonts = (fonts: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if fonts are already loaded
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = generateGoogleFontsUrl(fonts);
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Failed to load Google Fonts'));

    document.head.appendChild(link);
  });
};

// Get font stack (fallback fonts)
export const getFontStack = (primaryFont: string): string => {
  const googleFont = realEstateFonts.find(f => f.family === primaryFont);
  const category = googleFont?.category || 'sans-serif';

  const fallbacks = {
    'sans-serif': ', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'serif': ', Georgia, "Times New Roman", Times, serif',
    'monospace': ', "SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace'
  };

  return `"${primaryFont}"${fallbacks[category as keyof typeof fallbacks] || fallbacks['sans-serif']}`;
};

// Font preview text for real estate
export const fontPreviewTexts = {
  heading: 'Luxury Waterfront Home',
  subheading: 'Spacious Family Residence',
  body: 'This beautiful property features an open floor plan with modern amenities and stunning views of the surrounding landscape.',
  caption: '4 bed • 3 bath • 2,450 sqft'
};

// Text style presets for real estate
export const textStylePresets = [
  {
    id: 'h1-luxury',
    name: 'Luxury Heading',
    category: 'heading',
    fontFamily: 'Playfair Display',
    fontSize: 48,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 1.2,
    letterSpacing: '-0.025em'
  },
  {
    id: 'h2-modern',
    name: 'Modern Subheading',
    category: 'subheading',
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 1.3,
    letterSpacing: '-0.025em'
  },
  {
    id: 'body-clean',
    name: 'Clean Body Text',
    category: 'body',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
    lineHeight: 1.6,
    letterSpacing: '0'
  },
  {
    id: 'caption-details',
    name: 'Property Details',
    category: 'caption',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    lineHeight: 1.4,
    letterSpacing: '0.025em'
  },
  {
    id: 'price-display',
    name: 'Price Display',
    category: 'heading',
    fontFamily: 'Poppins',
    fontSize: 36,
    fontWeight: '700',
    color: '#059669',
    lineHeight: 1.2,
    letterSpacing: '-0.025em'
  },
  {
    id: 'agent-signature',
    name: 'Agent Signature',
    category: 'body',
    fontFamily: 'Crimson Text',
    fontSize: 18,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 1.5,
    letterSpacing: '0.025em'
  }
];

// Utility functions
export const getFontsByCategory = (category: keyof typeof fontCategories): string[] => {
  return fontCategories[category].fonts;
};

export const getFontByFamily = (family: string): GoogleFont | undefined => {
  return realEstateFonts.find(font => font.family === family);
};

export const searchFonts = (query: string): GoogleFont[] => {
  const lowercaseQuery = query.toLowerCase();
  return realEstateFonts.filter(font =>
    font.family.toLowerCase().includes(lowercaseQuery) ||
    font.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getPopularFonts = (limit = 10): GoogleFont[] => {
  return [...realEstateFonts]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

export const getFontsByWeight = (weight: string): GoogleFont[] => {
  return realEstateFonts.filter(font =>
    font.variants.includes(weight)
  );
};

// Font loading state management
export class FontLoader {
  private loadedFonts: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  async loadFonts(fonts: string[]): Promise<void> {
    const fontsToLoad = fonts.filter(font => !this.loadedFonts.has(font));

    if (fontsToLoad.length === 0) {
      return Promise.resolve();
    }

    const loadPromise = loadGoogleFonts(fontsToLoad)
      .then(() => {
        fontsToLoad.forEach(font => this.loadedFonts.add(font));
      })
      .catch(error => {
        console.error('Failed to load fonts:', error);
        throw error;
      });

    // Cache the promise
    fontsToLoad.forEach(font => {
      this.loadingPromises.set(font, loadPromise);
    });

    return loadPromise;
  }

  isFontLoaded(font: string): boolean {
    return this.loadedFonts.has(font);
  }

  async ensureFontLoaded(font: string): Promise<void> {
    if (this.isFontLoaded(font)) {
      return Promise.resolve();
    }

    const existingPromise = this.loadingPromises.get(font);
    if (existingPromise) {
      return existingPromise;
    }

    return this.loadFonts([font]);
  }
}

// Export singleton instance
export const fontLoader = new FontLoader();

// Initialize with common fonts
export const initializeCommonFonts = (): Promise<void> => {
  const commonFonts = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display'];
  return fontLoader.loadFonts(commonFonts);
};