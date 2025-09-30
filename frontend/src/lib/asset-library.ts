// Real Estate Asset Library Data
export interface AssetItem {
  id: string;
  name: string;
  category: string;
  type: 'svg' | 'shape' | 'sticker' | 'chart' | 'frame' | 'grid' | 'text';
  data: any;
  tags: string[];
  preview: string;
  metadata?: {
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
    marketingUse?: ('social' | 'flyer' | 'brochure' | 'website' | 'email' | 'business-card')[];
  };
  variants?: AssetVariant[];
  isFavorite?: boolean;
  collection?: string;
  usageCount?: number;
  lastUsed?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetVariant {
  id: string;
  name: string;
  color?: string;
  style?: string;
  data: any;
  thumbnail: string;
}

export interface AssetVariant {
  id: string;
  name: string;
  color?: string;
  style?: string;
  data: any;
  thumbnail: string;
}

// Real Estate Graphics (SVG Icons) - Expanded Collection
export const realEstateGraphics: AssetItem[] = [
  // Houses & Buildings
  {
    id: 'house-modern',
    name: 'Modern House',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="60" height="50" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="10,40 50,20 90,40" fill="currentColor"/>
      <rect x="35" y="55" width="10" height="15" fill="white"/>
      <rect x="55" y="55" width="10" height="15" fill="white"/>
      <rect x="25" y="25" width="15" height="10" fill="currentColor"/>
    </svg>`,
    tags: ['house', 'home', 'building', 'modern'],
    preview: '🏠',
    metadata: {
      description: 'Clean modern house icon perfect for contemporary listings',
      usage: 'Use for modern property listings and clean designs',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'house-victorian',
    name: 'Victorian House',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="35" width="70" height="55" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="5,35 50,15 95,35" fill="currentColor"/>
      <rect x="30" y="50" width="12" height="18" fill="white"/>
      <rect x="58" y="50" width="12" height="18" fill="white"/>
      <rect x="25" y="25" width="18" height="12" fill="currentColor"/>
      <rect x="57" y="25" width="18" height="12" fill="currentColor"/>
    </svg>`,
    tags: ['house', 'victorian', 'classic', 'traditional'],
    preview: '🏛️',
    metadata: {
      description: 'Classic Victorian-style house with detailed architecture',
      usage: 'Ideal for traditional and heritage property listings',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'apartment-building',
    name: 'Apartment Building',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="60" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="15" y="35" width="12" height="12" fill="white"/>
      <rect x="35" y="35" width="12" height="12" fill="white"/>
      <rect x="55" y="35" width="12" height="12" fill="white"/>
      <rect x="75" y="35" width="12" height="12" fill="white"/>
      <rect x="15" y="55" width="12" height="12" fill="white"/>
      <rect x="35" y="55" width="12" height="12" fill="white"/>
      <rect x="55" y="55" width="12" height="12" fill="white"/>
      <rect x="75" y="55" width="12" height="12" fill="white"/>
    </svg>`,
    tags: ['apartment', 'building', 'condo', 'multi-family'],
    preview: '🏢',
    metadata: {
      description: 'Multi-story apartment building icon',
      usage: 'Perfect for condo and apartment complex listings',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'townhouse',
    name: 'Townhouse',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="50" height="55" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="15,35 50,20 85,35" fill="currentColor"/>
      <rect x="35" y="50" width="8" height="12" fill="white"/>
      <rect x="57" y="50" width="8" height="12" fill="white"/>
      <rect x="30" y="25" width="12" height="8" fill="currentColor"/>
      <rect x="58" y="25" width="12" height="8" fill="currentColor"/>
      <line x1="50" y1="35" x2="50" y2="90" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['townhouse', 'row-house', 'attached', 'shared-wall'],
    preview: '🏘️',
    metadata: {
      description: 'Townhouse or row house with shared walls',
      usage: 'Great for townhome communities and attached housing',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'brochure']
    }
  },
  {
    id: 'mansion',
    name: 'Luxury Mansion',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="60" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="5,30 50,10 95,30" fill="currentColor"/>
      <rect x="25" y="45" width="12" height="18" fill="white"/>
      <rect x="63" y="45" width="12" height="18" fill="white"/>
      <rect x="20" y="20" width="20" height="15" fill="currentColor"/>
      <rect x="60" y="20" width="20" height="15" fill="currentColor"/>
      <circle cx="35" cy="75" r="6" fill="white" stroke="currentColor" stroke-width="2"/>
      <circle cx="65" cy="75" r="6" fill="white" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['mansion', 'luxury', 'estate', 'palatial'],
    preview: '🏰',
    metadata: {
      description: 'Grand luxury mansion with circular driveway',
      usage: 'Perfect for high-end luxury property marketing',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'condo-modern',
    name: 'Modern Condo',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="60" height="65" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="25" y="30" width="10" height="10" fill="white"/>
      <rect x="45" y="30" width="10" height="10" fill="white"/>
      <rect x="65" y="30" width="10" height="10" fill="white"/>
      <rect x="25" y="50" width="10" height="10" fill="white"/>
      <rect x="45" y="50" width="10" height="10" fill="white"/>
      <rect x="65" y="50" width="10" height="10" fill="white"/>
      <rect x="25" y="70" width="10" height="10" fill="white"/>
      <rect x="45" y="70" width="10" height="10" fill="white"/>
      <rect x="65" y="70" width="10" height="10" fill="white"/>
      <rect x="30" y="15" width="40" height="8" fill="currentColor"/>
    </svg>`,
    tags: ['condo', 'modern', 'high-rise', 'downtown'],
    preview: '🏙️',
    metadata: {
      description: 'Modern high-rise condominium building',
      usage: 'Ideal for urban condo and loft listings',
      propertyType: ['residential'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'cottage',
    name: 'Cozy Cottage',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="45" width="50" height="45" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="15,45 50,25 85,45" fill="currentColor"/>
      <rect x="35" y="60" width="8" height="12" fill="white"/>
      <rect x="57" y="60" width="8" height="12" fill="white"/>
      <rect x="30" y="35" width="12" height="8" fill="currentColor"/>
      <rect x="58" y="35" width="12" height="8" fill="currentColor"/>
      <path d="M20,70 Q30,65 40,70 Q50,75 60,70 Q70,65 80,70" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['cottage', 'cozy', 'cabin', 'rustic'],
    preview: '🏡',
    metadata: {
      description: 'Charming cottage with picket fence',
      usage: 'Perfect for cozy homes and vacation properties',
      propertyType: ['residential', 'vacation'],
      marketingUse: ['flyer', 'social', 'brochure']
    }
  },
  {
    id: 'commercial-building',
    name: 'Commercial Building',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="70" height="70" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="20" y="25" width="10" height="12" fill="white"/>
      <rect x="35" y="25" width="10" height="12" fill="white"/>
      <rect x="50" y="25" width="10" height="12" fill="white"/>
      <rect x="65" y="25" width="10" height="12" fill="white"/>
      <rect x="20" y="45" width="10" height="12" fill="white"/>
      <rect x="35" y="45" width="10" height="12" fill="white"/>
      <rect x="50" y="45" width="10" height="12" fill="white"/>
      <rect x="65" y="45" width="10" height="12" fill="white"/>
      <rect x="20" y="65" width="10" height="12" fill="white"/>
      <rect x="35" y="65" width="10" height="12" fill="white"/>
      <rect x="50" y="65" width="10" height="12" fill="white"/>
      <rect x="65" y="65" width="10" height="12" fill="white"/>
      <rect x="25" y="10" width="50" height="8" fill="currentColor"/>
    </svg>`,
    tags: ['commercial', 'office', 'business', 'retail'],
    preview: '🏢',
    metadata: {
      description: 'Multi-story commercial office building',
      usage: 'Great for commercial property listings',
      propertyType: ['commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },

  // Property Features
  {
    id: 'swimming-pool',
    name: 'Swimming Pool',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="60" rx="35" ry="15" fill="currentColor" opacity="0.3"/>
      <path d="M15,60 Q25,45 35,50 T50,55 T65,50 T75,45 Q85,60 85,60" fill="currentColor" opacity="0.6"/>
      <circle cx="30" cy="50" r="3" fill="currentColor"/>
      <circle cx="70" cy="48" r="3" fill="currentColor"/>
    </svg>`,
    tags: ['pool', 'swimming', 'amenity', 'luxury'],
    preview: '🏊',
    metadata: {
      description: 'Refreshing swimming pool with water reflections',
      usage: 'Highlight luxury amenities in property listings',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'garage',
    name: 'Garage',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="60" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="25" y="35" width="50" height="35" fill="white" stroke="currentColor" stroke-width="2"/>
      <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="3"/>
      <circle cx="60" cy="80" r="8" fill="white" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['garage', 'parking', 'car', 'driveway'],
    preview: '🚗',
    metadata: {
      description: 'Two-car garage with automatic door',
      usage: 'Show parking and storage features',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'brochure']
    }
  },
  {
    id: 'garden',
    name: 'Garden',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,70 Q20,60 30,65 T50,60 T70,65 T80,60 Q90,70 90,70 L90,90 L10,90 Z" fill="currentColor" opacity="0.2"/>
      <circle cx="25" cy="65" r="4" fill="currentColor" opacity="0.6"/>
      <circle cx="45" cy="62" r="5" fill="currentColor" opacity="0.6"/>
      <circle cx="65" cy="67" r="3" fill="currentColor" opacity="0.6"/>
      <rect x="35" y="55" width="3" height="15" fill="currentColor" opacity="0.4"/>
      <rect x="55" y="58" width="3" height="12" fill="currentColor" opacity="0.4"/>
    </svg>`,
    tags: ['garden', 'landscape', 'yard', 'outdoor'],
    preview: '🌳',
    metadata: {
      description: 'Beautiful landscaped garden with flowers',
      usage: 'Highlight outdoor living spaces',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="60" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="30" width="40" height="45" fill="white"/>
      <path d="M35,35 L65,35 L60,45 L40,45 Z" fill="currentColor" opacity="0.2"/>
      <circle cx="45" cy="55" r="3" fill="#ff6b35" opacity="0.8"/>
      <circle cx="55" cy="52" r="2" fill="#ff8c42" opacity="0.8"/>
      <circle cx="50" cy="58" r="2" fill="#ff6b35" opacity="0.8"/>
      <rect x="35" y="75" width="30" height="10" fill="currentColor" opacity="0.3"/>
    </svg>`,
    tags: ['fireplace', 'cozy', 'warmth', 'feature'],
    preview: '🔥',
    metadata: {
      description: 'Cozy fireplace with burning logs',
      usage: 'Highlight interior features and comfort',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'deck-patio',
    name: 'Deck & Patio',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="50" width="60" height="30" fill="currentColor" opacity="0.3"/>
      <rect x="25" y="55" width="8" height="20" fill="currentColor" opacity="0.6"/>
      <rect x="35" y="55" width="8" height="20" fill="currentColor" opacity="0.6"/>
      <rect x="45" y="55" width="8" height="20" fill="currentColor" opacity="0.6"/>
      <rect x="57" y="55" width="8" height="20" fill="currentColor" opacity="0.6"/>
      <rect x="67" y="55" width="8" height="20" fill="currentColor" opacity="0.6"/>
      <circle cx="30" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="70" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <rect x="15" y="45" width="70" height="3" fill="currentColor" opacity="0.5"/>
    </svg>`,
    tags: ['deck', 'patio', 'outdoor', 'entertainment'],
    preview: '🪴',
    metadata: {
      description: 'Spacious deck with outdoor furniture',
      usage: 'Show outdoor entertaining spaces',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'basement',
    name: 'Finished Basement',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="40" width="70" height="50" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="20" y="45" width="60" height="35" fill="white"/>
      <rect x="25" y="50" width="15" height="20" fill="currentColor" opacity="0.2"/>
      <rect x="60" y="50" width="15" height="20" fill="currentColor" opacity="0.2"/>
      <circle cx="35" cy="60" r="3" fill="currentColor" opacity="0.4"/>
      <circle cx="70" cy="60" r="3" fill="currentColor" opacity="0.4"/>
      <rect x="25" y="35" width="50" height="5" fill="currentColor" opacity="0.3"/>
    </svg>`,
    tags: ['basement', 'finished', 'bonus', 'space'],
    preview: '🏠',
    metadata: {
      description: 'Finished basement with recreation areas',
      usage: 'Highlight additional living space',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'brochure']
    }
  },
  {
    id: 'laundry-room',
    name: 'Laundry Room',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="50" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="25" y="35" width="50" height="35" fill="white"/>
      <rect x="30" y="40" width="12" height="8" fill="currentColor" opacity="0.3"/>
      <rect x="58" y="40" width="12" height="8" fill="currentColor" opacity="0.3"/>
      <circle cx="36" cy="50" r="4" fill="currentColor" opacity="0.5"/>
      <circle cx="64" cy="50" r="4" fill="currentColor" opacity="0.5"/>
      <rect x="30" y="60" width="40" height="5" fill="currentColor" opacity="0.2"/>
    </svg>`,
    tags: ['laundry', 'washer', 'dryer', 'utility'],
    preview: '👕',
    metadata: {
      description: 'Modern laundry room with appliances',
      usage: 'Show practical home features',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website']
    }
  },
  {
    id: 'home-office',
    name: 'Home Office',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="60" height="55" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="25" y="30" width="50" height="40" fill="white"/>
      <rect x="30" y="35" width="20" height="12" fill="currentColor" opacity="0.2"/>
      <rect x="55" y="35" width="15" height="8" fill="currentColor" opacity="0.3"/>
      <circle cx="40" cy="55" r="3" fill="currentColor" opacity="0.4"/>
      <rect x="50" y="50" width="20" height="3" fill="currentColor" opacity="0.2"/>
      <rect x="50" y="55" width="20" height="3" fill="currentColor" opacity="0.2"/>
    </svg>`,
    tags: ['office', 'work', 'study', 'remote'],
    preview: '💼',
    metadata: {
      description: 'Dedicated home office space',
      usage: 'Appeal to remote workers and professionals',
      propertyType: ['residential'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'walk-in-closet',
    name: 'Walk-in Closet',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="50" height="70" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="25" width="40" height="55" fill="white"/>
      <line x1="35" y1="30" x2="35" y2="75" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <line x1="40" y1="30" x2="40" y2="75" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <line x1="60" y1="30" x2="60" y2="75" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <line x1="65" y1="30" x2="65" y2="75" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <circle cx="45" cy="40" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="55" cy="40" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="45" cy="55" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="55" cy="55" r="2" fill="currentColor" opacity="0.4"/>
    </svg>`,
    tags: ['closet', 'walk-in', 'storage', 'organization'],
    preview: '👗',
    metadata: {
      description: 'Spacious walk-in closet with organization',
      usage: 'Highlight storage and luxury features',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'wine-cellar',
    name: 'Wine Cellar',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="30" width="70" height="60" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="20" y="35" width="60" height="45" fill="white" opacity="0.9"/>
      <rect x="25" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="32" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="39" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="46" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="53" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="60" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <rect x="67" y="40" width="4" height="30" fill="currentColor" opacity="0.6"/>
      <ellipse cx="35" cy="75" rx="25" ry="6" fill="currentColor" opacity="0.3"/>
      <rect x="25" y="50" width="50" height="3" fill="currentColor" opacity="0.2"/>
    </svg>`,
    tags: ['wine', 'cellar', 'luxury', 'entertainment'],
    preview: '🍷',
    metadata: {
      description: 'Climate-controlled wine cellar',
      usage: 'Highlight luxury entertainment features',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['brochure', 'website', 'flyer']
    }
  },

  // Location & Navigation
  {
    id: 'location-pin',
    name: 'Location Pin',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,10 L35,35 Q25,45 30,60 Q35,75 50,85 Q65,75 70,60 Q75,45 65,35 Z" fill="currentColor"/>
      <circle cx="50" cy="45" r="8" fill="white"/>
      <path d="M47,42 L50,45 L53,42 L50,39 Z" fill="currentColor"/>
    </svg>`,
    tags: ['location', 'pin', 'map', 'address'],
    preview: '📍',
    metadata: {
      description: 'Precise location marker pin',
      usage: 'Show property location on maps',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'map',
    name: 'Map',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,20 L30,15 L50,25 L70,20 L90,30 L85,80 L65,85 L45,75 L25,80 L10,70 Z" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
      <path d="M20,30 L40,25 L60,35 L80,30" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M25,40 L45,35 L65,45" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="35" cy="50" r="3" fill="currentColor"/>
      <circle cx="55" cy="60" r="3" fill="currentColor"/>
    </svg>`,
    tags: ['map', 'location', 'area', 'neighborhood'],
    preview: '🗺️',
    metadata: {
      description: 'Detailed neighborhood map view',
      usage: 'Show location context and nearby amenities',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'school-district',
    name: 'School District',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="35" width="60" height="40" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <polygon points="15,35 50,20 85,35" fill="currentColor"/>
      <rect x="30" y="45" width="8" height="12" fill="white"/>
      <rect x="45" y="45" width="8" height="12" fill="white"/>
      <rect x="60" y="45" width="8" height="12" fill="white"/>
      <rect x="35" y="25" width="30" height="8" fill="currentColor"/>
      <path d="M25,65 L75,65" stroke="currentColor" stroke-width="2"/>
      <circle cx="40" cy="70" r="2" fill="currentColor"/>
      <circle cx="60" cy="70" r="2" fill="currentColor"/>
    </svg>`,
    tags: ['school', 'education', 'district', 'family'],
    preview: '🏫',
    metadata: {
      description: 'School building representing district quality',
      usage: 'Highlight education and family-friendly areas',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'shopping-center',
    name: 'Shopping Center',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="40" width="80" height="45" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="15" y="45" width="12" height="15" fill="white"/>
      <rect x="35" y="45" width="12" height="15" fill="white"/>
      <rect x="55" y="45" width="12" height="15" fill="white"/>
      <rect x="15" y="65" width="12" height="15" fill="white"/>
      <rect x="35" y="65" width="12" height="15" fill="white"/>
      <rect x="55" y="65" width="12" height="15" fill="white"/>
      <rect x="20" y="30" width="60" height="8" fill="currentColor"/>
      <circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.5"/>
      <circle cx="75" cy="25" r="3" fill="currentColor" opacity="0.5"/>
    </svg>`,
    tags: ['shopping', 'retail', 'convenience', 'amenities'],
    preview: '🛍️',
    metadata: {
      description: 'Shopping center with multiple stores',
      usage: 'Show nearby shopping and convenience',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'park-playground',
    name: 'Park & Playground',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="75" rx="40" ry="15" fill="currentColor" opacity="0.2"/>
      <circle cx="30" cy="60" r="8" fill="currentColor" opacity="0.4"/>
      <circle cx="70" cy="58" r="6" fill="currentColor" opacity="0.4"/>
      <rect x="25" y="45" width="4" height="20" fill="currentColor" opacity="0.5"/>
      <rect x="35" y="50" width="4" height="15" fill="currentColor" opacity="0.5"/>
      <rect x="65" y="47" width="4" height="18" fill="currentColor" opacity="0.5"/>
      <path d="M20,70 Q30,65 40,70 Q50,75 60,70 Q70,65 80,70" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <rect x="45" y="40" width="10" height="25" fill="currentColor" opacity="0.6"/>
      <circle cx="50" cy="35" r="4" fill="currentColor" opacity="0.6"/>
    </svg>`,
    tags: ['park', 'playground', 'recreation', 'family'],
    preview: '🌳',
    metadata: {
      description: 'Community park with playground equipment',
      usage: 'Highlight family-friendly neighborhoods',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'highway-access',
    name: 'Highway Access',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,50 L90,50" stroke="currentColor" stroke-width="6"/>
      <path d="M20,45 L25,50 L20,55" fill="currentColor"/>
      <path d="M35,45 L40,50 L35,55" fill="currentColor"/>
      <path d="M50,45 L55,50 L50,55" fill="currentColor"/>
      <path d="M65,45 L70,50 L65,55" fill="currentColor"/>
      <path d="M80,45 L85,50 L80,55" fill="currentColor"/>
      <rect x="15" y="35" width="70" height="30" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.2"/>
      <rect x="20" y="20" width="10" height="10" fill="white" stroke="currentColor" stroke-width="1"/>
    </svg>`,
    tags: ['highway', 'access', 'commute', 'transportation'],
    preview: '🛣️',
    metadata: {
      description: 'Easy highway access with traffic indicators',
      usage: 'Highlight convenient commuting options',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="60" height="30" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="25" y="45" width="50" height="20" fill="white"/>
      <circle cx="30" cy="75" r="8" fill="currentColor"/>
      <circle cx="70" cy="75" r="8" fill="currentColor"/>
      <rect x="25" y="30" width="50" height="8" fill="currentColor"/>
      <circle cx="35" cy="25" r="3" fill="white"/>
      <circle cx="65" cy="25" r="3" fill="white"/>
      <rect x="15" y="65" width="70" height="5" fill="currentColor" opacity="0.3"/>
    </svg>`,
    tags: ['bus', 'train', 'public', 'transport', 'commute'],
    preview: '🚌',
    metadata: {
      description: 'Public transportation bus stop',
      usage: 'Show convenient transit options',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'airport-nearby',
    name: 'Airport Nearby',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,30 L45,35 L50,40 L55,35 Z" fill="currentColor"/>
      <path d="M30,50 L35,45 L40,50 L35,55 Z" fill="currentColor"/>
      <path d="M70,50 L65,45 L60,50 L65,55 Z" fill="currentColor"/>
      <path d="M50,70 L45,65 L40,70 L45,75 Z" fill="currentColor"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <rect x="48" y="20" width="4" height="60" fill="currentColor" opacity="0.2"/>
      <rect x="20" y="48" width="60" height="4" fill="currentColor" opacity="0.2"/>
      <path d="M10,50 L20,45 L20,55 Z" fill="currentColor" opacity="0.4"/>
      <path d="M80,50 L90,45 L90,55 Z" fill="currentColor" opacity="0.4"/>
    </svg>`,
    tags: ['airport', 'travel', 'flight', 'convenience'],
    preview: '✈️',
    metadata: {
      description: 'Airport with runway and terminal',
      usage: 'Highlight travel convenience',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },

  // Keys & Security
  {
    id: 'house-keys',
    name: 'House Keys',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="70" rx="25" ry="8" fill="currentColor" opacity="0.3"/>
      <path d="M15,65 L25,60 L35,65 L45,60 L55,65 L65,60 L75,65" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="20" cy="62" r="3" fill="currentColor"/>
      <circle cx="40" cy="57" r="3" fill="currentColor"/>
      <circle cx="60" cy="62" r="3" fill="currentColor"/>
      <rect x="70" y="55" width="8" height="15" rx="2" fill="currentColor"/>
      <path d="M72,60 L76,55 L80,60" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['keys', 'security', 'access', 'lock'],
    preview: '🗝️',
    metadata: {
      description: 'Set of house keys with keychain',
      usage: 'Represent property ownership and security',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'smart-lock',
    name: 'Smart Lock',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="25" width="30" height="50" rx="5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="40" y="30" width="20" height="25" rx="3" fill="white"/>
      <circle cx="50" cy="40" r="3" fill="currentColor"/>
      <rect x="42" y="60" width="16" height="3" fill="currentColor" opacity="0.6"/>
      <path d="M45,67 L55,67" stroke="currentColor" stroke-width="2"/>
      <circle cx="60" cy="35" r="4" fill="currentColor" opacity="0.3"/>
      <path d="M58,33 L62,37 M62,33 L58,37" stroke="currentColor" stroke-width="1" opacity="0.5"/>
    </svg>`,
    tags: ['smart', 'lock', 'security', 'technology'],
    preview: '🔒',
    metadata: {
      description: 'Modern smart lock with digital access',
      usage: 'Highlight modern security features',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'security-system',
    name: 'Security System',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="30" width="50" height="45" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="35" width="40" height="30" fill="white"/>
      <circle cx="40" cy="45" r="4" fill="currentColor" opacity="0.8"/>
      <circle cx="60" cy="45" r="4" fill="currentColor" opacity="0.8"/>
      <rect x="35" y="55" width="30" height="8" fill="currentColor" opacity="0.3"/>
      <path d="M30,25 L35,30 L40,25 L45,30 L50,25 L55,30 L60,25 L65,30 L70,25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <circle cx="80" cy="20" r="3" fill="#ff0000" opacity="0.8"/>
    </svg>`,
    tags: ['security', 'system', 'alarm', 'protection'],
    preview: '🛡️',
    metadata: {
      description: 'Comprehensive home security system',
      usage: 'Emphasize safety and security features',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },

  // Money & Finance
  {
    id: 'dollar-sign',
    name: 'Dollar Sign',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,15 Q35,25 35,40 Q35,50 45,50 L55,50 Q65,50 65,40 Q65,25 50,15" fill="currentColor" opacity="0.2"/>
      <path d="M45,30 L45,70 M55,30 L55,70 M40,35 L60,35 M40,65 L60,65" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M50,30 Q40,35 40,45 Q40,55 50,60 Q60,55 60,45 Q60,35 50,30" fill="none" stroke="currentColor" stroke-width="3"/>
    </svg>`,
    tags: ['money', 'price', 'cost', 'finance'],
    preview: '💰',
    metadata: {
      description: 'Dollar sign representing value and pricing',
      usage: 'Highlight property value and investment',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'investment-growth',
    name: 'Investment Growth',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,70 L30,60 L40,65 L50,50 L60,55 L70,45 L80,40" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="20" cy="70" r="3" fill="currentColor"/>
      <circle cx="30" cy="60" r="3" fill="currentColor"/>
      <circle cx="40" cy="65" r="3" fill="currentColor"/>
      <circle cx="50" cy="50" r="3" fill="currentColor"/>
      <circle cx="60" cy="55" r="3" fill="currentColor"/>
      <circle cx="70" cy="45" r="3" fill="currentColor"/>
      <circle cx="80" cy="40" r="3" fill="currentColor"/>
      <path d="M75,35 L80,40 L85,30 L80,35 L75,40" fill="currentColor"/>
      <rect x="15" y="75" width="70" height="15" fill="currentColor" opacity="0.1"/>
    </svg>`,
    tags: ['investment', 'growth', 'appreciation', 'equity'],
    preview: '📈',
    metadata: {
      description: 'Upward trending investment growth chart',
      usage: 'Show property value appreciation potential',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.3"/>
      <circle cx="70" cy="30" r="8" fill="currentColor" opacity="0.3"/>
      <circle cx="30" cy="70" r="8" fill="currentColor" opacity="0.3"/>
      <circle cx="70" cy="70" r="8" fill="currentColor" opacity="0.3"/>
      <path d="M25,35 L35,25" stroke="currentColor" stroke-width="2"/>
      <path d="M65,35 L75,25" stroke="currentColor" stroke-width="2"/>
      <path d="M25,75 L35,65" stroke="currentColor" stroke-width="2"/>
      <path d="M65,75 L75,65" stroke="currentColor" stroke-width="2"/>
      <path d="M38,30 L62,30" stroke="currentColor" stroke-width="2"/>
      <path d="M38,70 L62,70" stroke="currentColor" stroke-width="2"/>
      <rect x="45" y="45" width="10" height="10" fill="currentColor"/>
      <path d="M47,47 L53,53 M53,47 L47,53" stroke="white" stroke-width="1"/>
    </svg>`,
    tags: ['cash', 'flow', 'rental', 'income'],
    preview: '💵',
    metadata: {
      description: 'Money circulation representing cash flow',
      usage: 'Highlight rental income potential',
      propertyType: ['rental', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },

  // Communication
  {
    id: 'phone',
    name: 'Phone',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="10" width="30" height="60" rx="5" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="40" y="15" width="20" height="30" rx="2" fill="white"/>
      <circle cx="45" cy="50" r="2" fill="currentColor"/>
      <circle cx="55" cy="50" r="2" fill="currentColor"/>
      <path d="M40,55 L60,55" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    tags: ['phone', 'contact', 'call', 'mobile'],
    preview: '📱',
    metadata: {
      description: 'Modern smartphone for contact information',
      usage: 'Display agent or office contact details',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'business-card', 'website']
    }
  },
  {
    id: 'email-contact',
    name: 'Email Contact',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="70" height="50" rx="3" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="20" y="30" width="60" height="35" fill="white"/>
      <path d="M25,35 L75,35 L65,45 L35,45 Z" fill="currentColor" opacity="0.2"/>
      <path d="M30,40 L70,40" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <path d="M30,50 L60,50" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      <circle cx="80" cy="20" r="8" fill="currentColor" opacity="0.2"/>
      <path d="M77,17 L83,23 L77,23 L77,17" fill="white"/>
    </svg>`,
    tags: ['email', 'contact', 'message', 'communication'],
    preview: '📧',
    metadata: {
      description: 'Email envelope with contact information',
      usage: 'Show digital contact methods',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'business-card']
    }
  },
  {
    id: 'video-call',
    name: 'Video Call',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="50" height="35" rx="3" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="25" width="40" height="25" fill="white"/>
      <circle cx="35" cy="30" r="3" fill="currentColor" opacity="0.3"/>
      <rect x="45" y="28" width="15" height="8" fill="currentColor" opacity="0.2"/>
      <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="60" cy="40" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M32,45 L68,45" stroke="currentColor" stroke-width="2"/>
      <circle cx="80" cy="30" r="6" fill="currentColor" opacity="0.2"/>
      <path d="M77,27 L83,33 L77,33 L77,27" fill="white"/>
    </svg>`,
    tags: ['video', 'call', 'virtual', 'tour'],
    preview: '📹',
    metadata: {
      description: 'Video call interface for virtual tours',
      usage: 'Promote virtual property tours',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },

  // Awards & Badges
  {
    id: 'sold-badge',
    name: 'Sold Badge',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="currentColor" stroke="currentColor" stroke-width="3"/>
      <path d="M25,50 L40,35 L75,35 L60,50 L75,65 L40,65 Z" fill="white"/>
    </svg>`,
    tags: ['sold', 'badge', 'award', 'achievement'],
    preview: '🏆',
    metadata: {
      description: 'Sold badge for successful transactions',
      usage: 'Indicate property has been sold',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'award-winning',
    name: 'Award Winning',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="75" rx="30" ry="8" fill="currentColor" opacity="0.3"/>
      <rect x="35" y="30" width="30" height="45" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <path d="M30,35 L40,25 L60,25 L70,35" fill="currentColor"/>
      <circle cx="45" cy="40" r="3" fill="white"/>
      <circle cx="55" cy="40" r="3" fill="white"/>
      <path d="M40,50 L60,50" stroke="white" stroke-width="2"/>
      <path d="M40,60 L60,60" stroke="white" stroke-width="2"/>
      <rect x="25" y="70" width="50" height="10" fill="currentColor" opacity="0.4"/>
    </svg>`,
    tags: ['award', 'winner', 'trophy', 'excellence'],
    preview: '🏆',
    metadata: {
      description: 'Trophy for award-winning properties',
      usage: 'Highlight exceptional properties or agents',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['brochure', 'website', 'flyer']
    }
  },
  {
    id: 'top-producer',
    name: 'Top Producer',
    category: 'graphics',
    type: 'svg',
    data: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="25" r="15" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <rect x="35" y="35" width="30" height="40" fill="currentColor" stroke="currentColor" stroke-width="2"/>
      <path d="M30,40 L40,30 L60,30 L70,40" fill="currentColor"/>
      <circle cx="45" cy="45" r="2" fill="white"/>
      <circle cx="55" cy="45" r="2" fill="white"/>
      <path d="M40,55 L60,55" stroke="white" stroke-width="1"/>
      <path d="M40,62 L60,62" stroke="white" stroke-width="1"/>
      <rect x="25" y="70" width="50" height="8" fill="currentColor" opacity="0.3"/>
      <text x="50" y="85" text-anchor="middle" fill="currentColor" font-size="8" opacity="0.7">TOP</text>
    </svg>`,
    tags: ['top', 'producer', 'agent', 'success'],
    preview: '👑',
    metadata: {
      description: 'Crown and trophy for top producing agents',
      usage: 'Highlight successful real estate professionals',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['business-card', 'website', 'flyer']
    }
  }
];

// Marketing Stickers - Expanded Collection
export const marketingStickers: AssetItem[] = [
  {
    id: 'just-listed',
    name: 'Just Listed',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'JUST LISTED', color: '#ef4444' },
    tags: ['new', 'listing', 'fresh', 'hot'],
    preview: '🆕',
    metadata: {
      description: 'Bold "Just Listed" sticker for new properties',
      usage: 'Announce new listings on the market',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'price-reduced',
    name: 'Price Reduced',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'PRICE REDUCED', color: '#f59e0b' },
    tags: ['sale', 'discount', 'reduced', 'bargain'],
    preview: '💰',
    metadata: {
      description: 'Eye-catching price reduction announcement',
      usage: 'Highlight price improvements to attract buyers',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'sold',
    name: 'Sold',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'SOLD', color: '#10b981' },
    tags: ['sold', 'completed', 'success'],
    preview: '✅',
    metadata: {
      description: 'Success indicator for sold properties',
      usage: 'Show successful transaction completion',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'open-house',
    name: 'Open House',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'OPEN HOUSE', color: '#3b82f6' },
    tags: ['open', 'house', 'viewing', 'tour'],
    preview: '🚪',
    metadata: {
      description: 'Invitation for property viewing',
      usage: 'Promote scheduled open house events',
      propertyType: ['residential'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'coming-soon',
    name: 'Coming Soon',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'COMING SOON', color: '#8b5cf6' },
    tags: ['soon', 'upcoming', 'preview'],
    preview: '🔮',
    metadata: {
      description: 'Teaser for upcoming listings',
      usage: 'Build anticipation for new properties',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['social', 'website', 'email']
    }
  },
  {
    id: 'luxury-home',
    name: 'Luxury Home',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'LUXURY HOME', color: '#f59e0b' },
    tags: ['luxury', 'premium', 'exclusive', 'high-end'],
    preview: '💎',
    metadata: {
      description: 'Premium luxury property designation',
      usage: 'Highlight high-end property features',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['brochure', 'website', 'flyer']
    }
  },
  {
    id: 'waterfront',
    name: 'Waterfront',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'WATERFRONT', color: '#0ea5e9' },
    tags: ['water', 'lake', 'ocean', 'view'],
    preview: '🌊',
    metadata: {
      description: 'Waterfront property highlight',
      usage: 'Emphasize scenic water views',
      propertyType: ['residential', 'luxury', 'vacation'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'investment',
    name: 'Investment Property',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'INVESTMENT', color: '#059669' },
    tags: ['investment', 'income', 'rental', 'business'],
    preview: '📈',
    metadata: {
      description: 'Investment opportunity indicator',
      usage: 'Target investor buyers',
      propertyType: ['rental', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'foreclosure',
    name: 'Foreclosure Sale',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'FORECLOSURE', color: '#dc2626' },
    tags: ['foreclosure', 'sale', 'opportunity', 'distressed'],
    preview: '⚡',
    metadata: {
      description: 'Foreclosure or distressed property sale',
      usage: 'Highlight special purchase opportunities',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'new-construction',
    name: 'New Construction',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'NEW BUILD', color: '#06b6d4' },
    tags: ['new', 'construction', 'modern', 'warranty'],
    preview: '🏗️',
    metadata: {
      description: 'Brand new construction indicator',
      usage: 'Highlight modern features and warranties',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'motivated-seller',
    name: 'Motivated Seller',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'MOTIVATED', color: '#f97316' },
    tags: ['motivated', 'seller', 'flexible', 'negotiable'],
    preview: '💭',
    metadata: {
      description: 'Motivated seller opportunity',
      usage: 'Indicate flexible selling terms',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'pending',
    name: 'Pending Sale',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'PENDING', color: '#eab308' },
    tags: ['pending', 'under-contract', 'processing'],
    preview: '⏳',
    metadata: {
      description: 'Property under contract indicator',
      usage: 'Show active transaction status',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website']
    }
  },
  {
    id: 'price-drop',
    name: 'Price Drop',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'PRICE DROP', color: '#ef4444' },
    tags: ['price', 'drop', 'reduction', 'deal'],
    preview: '📉',
    metadata: {
      description: 'Significant price reduction alert',
      usage: 'Create urgency for price reductions',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'virtual-tour',
    name: 'Virtual Tour',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'VIRTUAL TOUR', color: '#8b5cf6' },
    tags: ['virtual', 'tour', 'online', 'remote'],
    preview: '🥽',
    metadata: {
      description: 'Virtual tour available indicator',
      usage: 'Promote digital property viewing',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['social', 'website', 'email']
    }
  },
  {
    id: 'pet-friendly',
    name: 'Pet Friendly',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'PET FRIENDLY', color: '#10b981' },
    tags: ['pet', 'friendly', 'animals', 'dogs', 'cats'],
    preview: '🐕',
    metadata: {
      description: 'Pet-friendly property designation',
      usage: 'Appeal to pet owners',
      propertyType: ['residential', 'rental'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'furnished',
    name: 'Fully Furnished',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'FURNISHED', color: '#f59e0b' },
    tags: ['furnished', 'furniture', 'move-in', 'ready'],
    preview: '🛋️',
    metadata: {
      description: 'Fully furnished property indicator',
      usage: 'Highlight move-in ready properties',
      propertyType: ['residential', 'rental', 'vacation'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'rental',
    name: 'For Rent',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'FOR RENT', color: '#3b82f6' },
    tags: ['rental', 'lease', 'tenant', 'income'],
    preview: '🏠',
    metadata: {
      description: 'Rental property designation',
      usage: 'Target rental property seekers',
      propertyType: ['rental'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'short-sale',
    name: 'Short Sale',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'SHORT SALE', color: '#dc2626' },
    tags: ['short', 'sale', 'opportunity', 'below-market'],
    preview: '💸',
    metadata: {
      description: 'Short sale opportunity indicator',
      usage: 'Highlight potential below-market deals',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'bank-owned',
    name: 'Bank Owned',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'BANK OWNED', color: '#7c3aed' },
    tags: ['bank', 'owned', 'reo', 'foreclosure'],
    preview: '🏦',
    metadata: {
      description: 'REO/Bank-owned property indicator',
      usage: 'Indicate institutional seller',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'auction',
    name: 'Auction',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'AUCTION', color: '#ea580c' },
    tags: ['auction', 'bid', 'competitive', 'opportunity'],
    preview: '🔨',
    metadata: {
      description: 'Property auction announcement',
      usage: 'Promote auction events',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'water-view',
    name: 'Water View',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'WATER VIEW', color: '#0ea5e9' },
    tags: ['water', 'view', 'scenic', 'panoramic'],
    preview: '🌅',
    metadata: {
      description: 'Scenic water view designation',
      usage: 'Highlight panoramic water views',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'mountain-view',
    name: 'Mountain View',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'MOUNTAIN VIEW', color: '#16a34a' },
    tags: ['mountain', 'view', 'scenic', 'nature'],
    preview: '🏔️',
    metadata: {
      description: 'Mountain view property highlight',
      usage: 'Emphasize natural scenic beauty',
      propertyType: ['residential', 'luxury', 'vacation'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'golf-course',
    name: 'Golf Course',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'GOLF COURSE', color: '#059669' },
    tags: ['golf', 'course', 'community', 'amenity'],
    preview: '⛳',
    metadata: {
      description: 'Golf course community designation',
      usage: 'Highlight recreational amenities',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'gated-community',
    name: 'Gated Community',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'GATED', color: '#7c3aed' },
    tags: ['gated', 'community', 'security', 'exclusive'],
    preview: '🚪',
    metadata: {
      description: 'Gated community security feature',
      usage: 'Emphasize security and exclusivity',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'fixer-upper',
    name: 'Fixer Upper',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'FIXER UPPER', color: '#ca8a04' },
    tags: ['fixer', 'upper', 'renovation', 'potential'],
    preview: '🔨',
    metadata: {
      description: 'Property needing renovation indicator',
      usage: 'Target buyers looking for projects',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'move-in-ready',
    name: 'Move-in Ready',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'MOVE-IN READY', color: '#10b981' },
    tags: ['move-in', 'ready', 'turnkey', 'immediate'],
    preview: '⚡',
    metadata: {
      description: 'Immediate occupancy available',
      usage: 'Highlight hassle-free purchase',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'owner-financing',
    name: 'Owner Financing',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'OWNER FINANCING', color: '#059669' },
    tags: ['owner', 'financing', 'seller', 'terms'],
    preview: '💳',
    metadata: {
      description: 'Seller financing available',
      usage: 'Highlight flexible financing options',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'reduced-price',
    name: 'Reduced Price',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'REDUCED', color: '#ef4444' },
    tags: ['reduced', 'price', 'discount', 'motivated'],
    preview: '💥',
    metadata: {
      description: 'Price reduction announcement',
      usage: 'Create urgency with price improvements',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'just-renovated',
    name: 'Just Renovated',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'JUST RENOVATED', color: '#06b6d4' },
    tags: ['renovated', 'updated', 'modern', 'fresh'],
    preview: '✨',
    metadata: {
      description: 'Recently renovated property',
      usage: 'Highlight recent improvements',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'must-see',
    name: 'Must See',
    category: 'stickers',
    type: 'sticker',
    data: { text: 'MUST SEE', color: '#f97316' },
    tags: ['must', 'see', 'amazing', 'incredible'],
    preview: '🤩',
    metadata: {
      description: 'Exceptional property recommendation',
      usage: 'Highlight extraordinary properties',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['social', 'flyer', 'website']
    }
  }
];

// Basic Shapes - Expanded Collection
export const basicShapes: AssetItem[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'rectangle' },
    tags: ['rectangle', 'square', 'box', 'frame'],
    preview: '⬜',
    metadata: {
      description: 'Basic rectangle shape for layouts',
      usage: 'Create frames, backgrounds, and containers',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'social']
    }
  },
  {
    id: 'circle',
    name: 'Circle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'circle' },
    tags: ['circle', 'round', 'oval', 'dot'],
    preview: '⭕',
    metadata: {
      description: 'Perfect circle for highlights and badges',
      usage: 'Create circular highlights and button backgrounds',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'triangle' },
    tags: ['triangle', 'arrow', 'pointer', 'direction'],
    preview: '🔺',
    metadata: {
      description: 'Triangular shape for directional elements',
      usage: 'Point to important information or features',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'social']
    }
  },
  {
    id: 'line',
    name: 'Line',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'line' },
    tags: ['line', 'divider', 'separator', 'border'],
    preview: '─',
    metadata: {
      description: 'Straight line for dividing content',
      usage: 'Separate sections and create visual hierarchy',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'arrow',
    name: 'Arrow',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'arrow' },
    tags: ['arrow', 'pointer', 'direction', 'navigation'],
    preview: '➡️',
    metadata: {
      description: 'Directional arrow for navigation',
      usage: 'Guide attention and show direction',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'star',
    name: 'Star',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'star' },
    tags: ['star', 'rating', 'favorite', 'highlight'],
    preview: '⭐',
    metadata: {
      description: 'Star shape for ratings and highlights',
      usage: 'Show ratings and highlight key features',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'pentagon' },
    tags: ['pentagon', 'five-sided', 'geometric', 'badge'],
    preview: '⬟',
    metadata: {
      description: 'Five-sided geometric shape',
      usage: 'Create unique badges and highlights',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'social']
    }
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'hexagon' },
    tags: ['hexagon', 'six-sided', 'honeycomb', 'modern'],
    preview: '⬢',
    metadata: {
      description: 'Six-sided modern geometric shape',
      usage: 'Create modern, tech-forward designs',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'octagon' },
    tags: ['octagon', 'eight-sided', 'stop-sign', 'warning'],
    preview: '⬣',
    metadata: {
      description: 'Eight-sided shape for warnings and highlights',
      usage: 'Create attention-grabbing elements',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'diamond' },
    tags: ['diamond', 'rhombus', 'gem', 'luxury'],
    preview: '💎',
    metadata: {
      description: 'Diamond shape for luxury and premium feel',
      usage: 'Highlight premium features and luxury properties',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['brochure', 'flyer', 'website']
    }
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'heart' },
    tags: ['heart', 'love', 'favorite', 'home'],
    preview: '❤️',
    metadata: {
      description: 'Heart shape for emotional appeal',
      usage: 'Create warm, welcoming feeling',
      propertyType: ['residential'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'oval',
    name: 'Oval',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'oval' },
    tags: ['oval', 'ellipse', 'rounded', 'soft'],
    preview: '🥚',
    metadata: {
      description: 'Soft oval shape for elegant designs',
      usage: 'Create soft, rounded design elements',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['brochure', 'flyer', 'website']
    }
  },
  {
    id: 'rounded-rectangle',
    name: 'Rounded Rectangle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'rounded-rectangle' },
    tags: ['rounded', 'rectangle', 'soft', 'modern'],
    preview: '▭',
    metadata: {
      description: 'Modern rounded rectangle shape',
      usage: 'Create modern, friendly design elements',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'trapezoid' },
    tags: ['trapezoid', 'four-sided', 'geometric', 'modern'],
    preview: '⬜',
    metadata: {
      description: 'Trapezoidal geometric shape',
      usage: 'Create dynamic, modern layouts',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'parallelogram' },
    tags: ['parallelogram', 'slanted', 'dynamic', 'modern'],
    preview: '⬛',
    metadata: {
      description: 'Slanted parallelogram for dynamic designs',
      usage: 'Add movement and energy to layouts',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'curved-line',
    name: 'Curved Line',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'curved-line' },
    tags: ['curve', 'line', 'flow', 'elegant'],
    preview: '～',
    metadata: {
      description: 'Elegant curved line for flowing designs',
      usage: 'Create elegant separators and flowing elements',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['brochure', 'flyer', 'website']
    }
  },
  {
    id: 'wave',
    name: 'Wave',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'wave' },
    tags: ['wave', 'flow', 'water', 'movement'],
    preview: '🌊',
    metadata: {
      description: 'Wave pattern for dynamic designs',
      usage: 'Add movement and represent water features',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'zigzag',
    name: 'Zigzag',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'zigzag' },
    tags: ['zigzag', 'lightning', 'energy', 'attention'],
    preview: '⚡',
    metadata: {
      description: 'Zigzag pattern for attention-grabbing designs',
      usage: 'Create excitement and draw attention',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'cross',
    name: 'Cross',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'cross' },
    tags: ['cross', 'plus', 'add', 'combine'],
    preview: '✚',
    metadata: {
      description: 'Cross shape for combination and addition',
      usage: 'Combine elements or show additions',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'x-mark',
    name: 'X Mark',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'x-mark' },
    tags: ['x', 'mark', 'close', 'attention'],
    preview: '✖',
    metadata: {
      description: 'X mark for emphasis and attention',
      usage: 'Highlight important information',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'check-mark',
    name: 'Check Mark',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'check-mark' },
    tags: ['check', 'mark', 'approval', 'success'],
    preview: '✓',
    metadata: {
      description: 'Check mark for approval and success',
      usage: 'Indicate completed features or approval',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'right-triangle',
    name: 'Right Triangle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'right-triangle' },
    tags: ['right', 'triangle', 'angle', 'corner'],
    preview: '🔺',
    metadata: {
      description: 'Right-angled triangle shape',
      usage: 'Create directional and corner elements',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'equilateral-triangle',
    name: 'Equilateral Triangle',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'equilateral-triangle' },
    tags: ['equilateral', 'triangle', 'balanced', 'stable'],
    preview: '🔺',
    metadata: {
      description: 'Balanced equilateral triangle',
      usage: 'Represent stability and balance',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'rounded-star',
    name: 'Rounded Star',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'rounded-star' },
    tags: ['rounded', 'star', 'soft', 'friendly'],
    preview: '⭐',
    metadata: {
      description: 'Soft, rounded star shape',
      usage: 'Create friendly, approachable highlights',
      propertyType: ['residential'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'flower-petal',
    name: 'Flower Petal',
    category: 'shapes',
    type: 'shape',
    data: { shapeType: 'flower-petal' },
    tags: ['flower', 'petal', 'nature', 'organic'],
    preview: '🌸',
    metadata: {
      description: 'Organic flower petal shape',
      usage: 'Add natural, organic feel to designs',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'social', 'website']
    }
  }
];

// Chart Templates - Expanded Collection
export const chartTemplates: AssetItem[] = [
  {
    id: 'price-trend',
    name: 'Price Trend Chart',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Property Value',
        data: [250000, 265000, 280000, 275000, 290000, 310000]
      }]
    },
    tags: ['chart', 'trend', 'price', 'growth'],
    preview: '📈',
    metadata: {
      description: 'Property value appreciation over time',
      usage: 'Show investment potential and market trends',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'market-comparison',
    name: 'Market Comparison',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'bar',
      labels: ['Your Home', 'Area Avg', 'City Avg'],
      datasets: [{
        label: 'Price per Sqft',
        data: [250, 220, 200]
      }]
    },
    tags: ['chart', 'comparison', 'market', 'analysis'],
    preview: '📊',
    metadata: {
      description: 'Compare property value to market averages',
      usage: 'Demonstrate property value positioning',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'demographics',
    name: 'Neighborhood Demographics',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'pie',
      labels: ['Families', 'Singles', 'Retirees', 'Students'],
      datasets: [{
        data: [45, 25, 20, 10]
      }]
    },
    tags: ['chart', 'demographics', 'neighborhood', 'population'],
    preview: '🥧',
    metadata: {
      description: 'Neighborhood population breakdown',
      usage: 'Show community composition and lifestyle',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'price-history',
    name: 'Price History',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'line',
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [{
        label: 'Median Sale Price',
        data: [320000, 340000, 380000, 420000, 450000, 480000]
      }]
    },
    tags: ['chart', 'history', 'price', 'appreciation'],
    preview: '📈',
    metadata: {
      description: 'Historical price trends for the area',
      usage: 'Show long-term value appreciation',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'inventory-levels',
    name: 'Market Inventory',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'bar',
      labels: ['Homes for Sale', 'Pending Sales', 'Recently Sold'],
      datasets: [{
        label: 'Current Month',
        data: [45, 23, 67]
      }]
    },
    tags: ['chart', 'inventory', 'market', 'supply'],
    preview: '📊',
    metadata: {
      description: 'Current market inventory levels',
      usage: 'Show market conditions and competition',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'flyer', 'brochure']
    }
  },
  {
    id: 'days-on-market',
    name: 'Days on Market',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'bar',
      labels: ['This Property', 'Neighborhood Avg', 'City Avg'],
      datasets: [{
        label: 'Days on Market',
        data: [15, 30, 45]
      }]
    },
    tags: ['chart', 'market-time', 'comparison', 'speed'],
    preview: '⏱️',
    metadata: {
      description: 'Property marketing time comparison',
      usage: 'Highlight quick sale potential',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'rental-yield',
    name: 'Rental Yield',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'doughnut',
      labels: ['Rental Income', 'Property Expenses', 'Net Yield'],
      datasets: [{
        data: [8.5, 3.2, 5.3]
      }]
    },
    tags: ['chart', 'rental', 'yield', 'income'],
    preview: '💰',
    metadata: {
      description: 'Investment property rental yield analysis',
      usage: 'Show income potential for investors',
      propertyType: ['rental', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'school-ratings',
    name: 'School Ratings',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'bar',
      labels: ['Elementary', 'Middle School', 'High School'],
      datasets: [{
        label: 'GreatSchools Rating',
        data: [8, 7, 9]
      }]
    },
    tags: ['chart', 'schools', 'education', 'family'],
    preview: '🎓',
    metadata: {
      description: 'Local school district ratings',
      usage: 'Appeal to families with school information',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'crime-statistics',
    name: 'Safety Index',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'gauge',
      labels: ['Property Crime', 'Violent Crime', 'Safety Score'],
      datasets: [{
        data: [85, 92, 88]
      }]
    },
    tags: ['chart', 'safety', 'crime', 'security'],
    preview: '🛡️',
    metadata: {
      description: 'Neighborhood safety and crime statistics',
      usage: 'Highlight safe community environment',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'walkability-score',
    name: 'Walkability Score',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'radialBar',
      labels: ['Walk Score', 'Bike Score', 'Transit Score'],
      datasets: [{
        data: [75, 60, 45]
      }]
    },
    tags: ['chart', 'walkability', 'lifestyle', 'convenience'],
    preview: '🚶',
    metadata: {
      description: 'Walkability and transit accessibility scores',
      usage: 'Show convenient location benefits',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'social', 'website']
    }
  },
  {
    id: 'appreciation-rate',
    name: 'Appreciation Rate',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'line',
      labels: ['5 Year', '3 Year', '1 Year'],
      datasets: [{
        label: 'Annual Appreciation',
        data: [4.2, 5.1, 6.8]
      }]
    },
    tags: ['chart', 'appreciation', 'growth', 'investment'],
    preview: '📈',
    metadata: {
      description: 'Property value appreciation rates',
      usage: 'Demonstrate investment potential',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'comparable-sales',
    name: 'Comparable Sales',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'scatter',
      labels: ['Sale Price', 'Square Footage', 'Days on Market'],
      datasets: [{
        label: 'Recent Sales',
        data: [450000, 520000, 380000, 610000]
      }]
    },
    tags: ['chart', 'comps', 'sales', 'comparison'],
    preview: '🏠',
    metadata: {
      description: 'Comparable property sales analysis',
      usage: 'Support pricing strategy with market data',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'website', 'brochure']
    }
  },
  {
    id: 'cash-flow-projection',
    name: 'Cash Flow Projection',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'area',
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [{
        label: 'Projected Cash Flow',
        data: [15000, 18000, 21000, 24000, 27000]
      }]
    },
    tags: ['chart', 'cash-flow', 'projection', 'investment'],
    preview: '💵',
    metadata: {
      description: 'Investment cash flow projections',
      usage: 'Show income potential over time',
      propertyType: ['rental', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'amenity-proximity',
    name: 'Amenity Proximity',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'radar',
      labels: ['Shopping', 'Schools', 'Parks', 'Restaurants', 'Highway'],
      datasets: [{
        label: 'Distance (miles)',
        data: [0.5, 1.2, 0.8, 0.3, 2.1]
      }]
    },
    tags: ['chart', 'amenities', 'proximity', 'convenience'],
    preview: '📍',
    metadata: {
      description: 'Distance to nearby amenities',
      usage: 'Highlight convenient location benefits',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'website', 'social']
    }
  },
  {
    id: 'seasonal-trends',
    name: 'Seasonal Market Trends',
    category: 'charts',
    type: 'chart',
    data: {
      chartType: 'line',
      labels: ['Winter', 'Spring', 'Summer', 'Fall'],
      datasets: [{
        label: 'Average Sale Price',
        data: [420000, 450000, 480000, 440000]
      }]
    },
    tags: ['chart', 'seasonal', 'trends', 'timing'],
    preview: '📅',
    metadata: {
      description: 'Seasonal real estate market patterns',
      usage: 'Help determine optimal selling time',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  }
];

// Photo Frames - Expanded Collection
export const photoFrames: AssetItem[] = [
  {
    id: 'house-silhouette',
    name: 'House Silhouette Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'house' },
    tags: ['frame', 'house', 'silhouette', 'border'],
    preview: '🏠',
    metadata: {
      description: 'House-shaped frame for property photos',
      usage: 'Frame interior or exterior property shots',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'polaroid-frame',
    name: 'Polaroid Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'polaroid' },
    tags: ['frame', 'polaroid', 'photo', 'retro'],
    preview: '📸',
    metadata: {
      description: 'Classic Polaroid-style photo frame',
      usage: 'Create retro, instant photo effects',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'agent-headshot',
    name: 'Agent Headshot Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'agent' },
    tags: ['frame', 'agent', 'headshot', 'professional'],
    preview: '👤',
    metadata: {
      description: 'Professional headshot frame for agents',
      usage: 'Frame real estate agent photos',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['business-card', 'flyer', 'website']
    }
  },
  {
    id: 'elegant-border',
    name: 'Elegant Border',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'elegant' },
    tags: ['frame', 'elegant', 'border', 'decorative'],
    preview: '🖼️',
    metadata: {
      description: 'Ornate elegant frame border',
      usage: 'Add sophisticated framing to luxury properties',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['brochure', 'flyer', 'website']
    }
  },
  {
    id: 'modern-frame',
    name: 'Modern Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'modern' },
    tags: ['frame', 'modern', 'clean', 'minimal'],
    preview: '🖼️',
    metadata: {
      description: 'Clean, modern photo frame design',
      usage: 'Contemporary framing for modern properties',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'rustic-frame',
    name: 'Rustic Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'rustic' },
    tags: ['frame', 'rustic', 'wood', 'natural'],
    preview: '🖼️',
    metadata: {
      description: 'Wood-textured rustic photo frame',
      usage: 'Frame country and rustic property photos',
      propertyType: ['residential'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'vintage-frame',
    name: 'Vintage Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'vintage' },
    tags: ['frame', 'vintage', 'antique', 'classic'],
    preview: '🖼️',
    metadata: {
      description: 'Antique-style vintage photo frame',
      usage: 'Frame historic and traditional properties',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['brochure', 'flyer', 'website']
    }
  },
  {
    id: 'keyhole-frame',
    name: 'Keyhole Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'keyhole' },
    tags: ['frame', 'keyhole', 'unique', 'creative'],
    preview: '🗝️',
    metadata: {
      description: 'Unique keyhole-shaped photo frame',
      usage: 'Create distinctive property presentations',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'double-frame',
    name: 'Double Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'double' },
    tags: ['frame', 'double', 'pair', 'comparison'],
    preview: '🖼️',
    metadata: {
      description: 'Side-by-side double photo frame',
      usage: 'Compare before/after or interior/exterior',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'oval-frame',
    name: 'Oval Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'oval' },
    tags: ['frame', 'oval', 'portrait', 'classic'],
    preview: '🖼️',
    metadata: {
      description: 'Classic oval portrait frame',
      usage: 'Frame formal portraits and headshots',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['business-card', 'flyer', 'website']
    }
  },
  {
    id: 'collage-frame',
    name: 'Collage Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'collage' },
    tags: ['frame', 'collage', 'multiple', 'gallery'],
    preview: '🖼️',
    metadata: {
      description: 'Multi-photo collage frame',
      usage: 'Display multiple property images',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'panoramic-frame',
    name: 'Panoramic Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'panoramic' },
    tags: ['frame', 'panoramic', 'wide', 'landscape'],
    preview: '🖼️',
    metadata: {
      description: 'Wide panoramic photo frame',
      usage: 'Frame landscape and panoramic views',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'heart-frame',
    name: 'Heart Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'heart' },
    tags: ['frame', 'heart', 'love', 'home'],
    preview: '❤️',
    metadata: {
      description: 'Heart-shaped decorative frame',
      usage: 'Add warmth to family home presentations',
      propertyType: ['residential'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'star-frame',
    name: 'Star Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'star' },
    tags: ['frame', 'star', 'highlight', 'special'],
    preview: '⭐',
    metadata: {
      description: 'Star-shaped highlight frame',
      usage: 'Highlight featured or luxury properties',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['social', 'flyer', 'website']
    }
  },
  {
    id: 'ribbon-frame',
    name: 'Ribbon Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'ribbon' },
    tags: ['frame', 'ribbon', 'celebration', 'achievement'],
    preview: '🎀',
    metadata: {
      description: 'Decorative ribbon-framed border',
      usage: 'Celebrate special property features',
      propertyType: ['residential', 'luxury'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'corner-frame',
    name: 'Corner Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'corner' },
    tags: ['frame', 'corner', 'minimal', 'subtle'],
    preview: '🖼️',
    metadata: {
      description: 'Subtle corner accent frame',
      usage: 'Add subtle framing without overwhelming',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'filmstrip-frame',
    name: 'Filmstrip Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'filmstrip' },
    tags: ['frame', 'filmstrip', 'sequence', 'multiple'],
    preview: '🎞️',
    metadata: {
      description: 'Film strip style multi-photo frame',
      usage: 'Show property tour sequence',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social', 'website', 'flyer']
    }
  },
  {
    id: 'badge-frame',
    name: 'Badge Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'badge' },
    tags: ['frame', 'badge', 'award', 'achievement'],
    preview: '🏆',
    metadata: {
      description: 'Award badge style frame',
      usage: 'Highlight award-winning or featured properties',
      propertyType: ['luxury', 'residential'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'watermark-frame',
    name: 'Watermark Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'watermark' },
    tags: ['frame', 'watermark', 'branding', 'subtle'],
    preview: '🖼️',
    metadata: {
      description: 'Subtle watermark-style frame',
      usage: 'Brand photos with company watermark',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'social', 'flyer']
    }
  },
  {
    id: 'certificate-frame',
    name: 'Certificate Frame',
    category: 'frames',
    type: 'frame',
    data: { frameType: 'certificate' },
    tags: ['frame', 'certificate', 'formal', 'official'],
    preview: '🖼️',
    metadata: {
      description: 'Formal certificate-style frame',
      usage: 'Frame official documents and certifications',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['brochure', 'website', 'flyer']
    }
  }
];

// Layout Grids - Expanded Collection
export const layoutGrids: AssetItem[] = [
  {
    id: 'social-post',
    name: 'Social Media Post',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'social', rows: 1, columns: 1 },
    tags: ['grid', 'social', 'post', 'instagram'],
    preview: '📱',
    metadata: {
      description: 'Single image social media post layout',
      usage: 'Create engaging social media content',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social']
    }
  },
  {
    id: 'flyer-layout',
    name: 'Property Flyer',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'flyer', rows: 2, columns: 2 },
    tags: ['grid', 'flyer', 'brochure', 'layout'],
    preview: '📄',
    metadata: {
      description: 'Standard property flyer layout',
      usage: 'Design effective property marketing flyers',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer']
    }
  },
  {
    id: 'brochure-spread',
    name: 'Brochure Spread',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'brochure', rows: 3, columns: 2 },
    tags: ['grid', 'brochure', 'spread', 'layout'],
    preview: '📖',
    metadata: {
      description: 'Two-page brochure spread layout',
      usage: 'Design comprehensive property brochures',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['brochure']
    }
  },
  {
    id: 'business-card',
    name: 'Business Card',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'business-card', rows: 1, columns: 2 },
    tags: ['grid', 'business', 'card', 'contact'],
    preview: '💼',
    metadata: {
      description: 'Professional business card layout',
      usage: 'Design agent and office business cards',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['business-card']
    }
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'instagram-story', rows: 3, columns: 1 },
    tags: ['grid', 'instagram', 'story', 'vertical'],
    preview: '📱',
    metadata: {
      description: 'Vertical Instagram story layout',
      usage: 'Create engaging story content',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social']
    }
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'facebook-post', rows: 1, columns: 2 },
    tags: ['grid', 'facebook', 'post', 'horizontal'],
    preview: '📱',
    metadata: {
      description: 'Facebook-optimized post layout',
      usage: 'Design content for Facebook sharing',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['social']
    }
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'email-newsletter', rows: 4, columns: 2 },
    tags: ['grid', 'email', 'newsletter', 'layout'],
    preview: '📧',
    metadata: {
      description: 'Email newsletter layout design',
      usage: 'Create professional email marketing',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['email']
    }
  },
  {
    id: 'website-hero',
    name: 'Website Hero Section',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'website-hero', rows: 2, columns: 1 },
    tags: ['grid', 'website', 'hero', 'banner'],
    preview: '🌐',
    metadata: {
      description: 'Website hero section layout',
      usage: 'Design impactful homepage sections',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website']
    }
  },
  {
    id: 'property-card',
    name: 'Property Card',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'property-card', rows: 2, columns: 1 },
    tags: ['grid', 'property', 'card', 'listing'],
    preview: '🏠',
    metadata: {
      description: 'Property listing card layout',
      usage: 'Display property information in cards',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'social']
    }
  },
  {
    id: 'comparison-grid',
    name: 'Property Comparison',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'comparison', rows: 1, columns: 3 },
    tags: ['grid', 'comparison', 'multiple', 'analysis'],
    preview: '⚖️',
    metadata: {
      description: 'Side-by-side property comparison layout',
      usage: 'Compare multiple properties or features',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'feature-grid',
    name: 'Feature Highlights',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'feature-grid', rows: 2, columns: 3 },
    tags: ['grid', 'features', 'highlights', 'benefits'],
    preview: '✨',
    metadata: {
      description: 'Property feature highlight grid',
      usage: 'Showcase key property benefits',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'website']
    }
  },
  {
    id: 'testimonial-grid',
    name: 'Testimonial Layout',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'testimonial', rows: 2, columns: 2 },
    tags: ['grid', 'testimonial', 'review', 'social-proof'],
    preview: '💬',
    metadata: {
      description: 'Customer testimonial layout',
      usage: 'Display client reviews and testimonials',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'gallery-grid',
    name: 'Photo Gallery',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'gallery', rows: 3, columns: 3 },
    tags: ['grid', 'gallery', 'photos', 'images'],
    preview: '🖼️',
    metadata: {
      description: 'Photo gallery grid layout',
      usage: 'Display multiple property images',
      propertyType: ['residential', 'commercial', 'luxury'],
      marketingUse: ['website', 'flyer', 'brochure']
    }
  },
  {
    id: 'stats-dashboard',
    name: 'Statistics Dashboard',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'stats-dashboard', rows: 2, columns: 4 },
    tags: ['grid', 'statistics', 'dashboard', 'metrics'],
    preview: '📊',
    metadata: {
      description: 'Property statistics dashboard layout',
      usage: 'Display key metrics and data',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'contact-info',
    name: 'Contact Information',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'contact-info', rows: 3, columns: 1 },
    tags: ['grid', 'contact', 'information', 'details'],
    preview: '📞',
    metadata: {
      description: 'Contact information layout',
      usage: 'Display agent and office contact details',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['flyer', 'brochure', 'business-card']
    }
  },
  {
    id: 'timeline-layout',
    name: 'Property Timeline',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'timeline', rows: 5, columns: 1 },
    tags: ['grid', 'timeline', 'history', 'milestones'],
    preview: '⏰',
    metadata: {
      description: 'Property history timeline layout',
      usage: 'Show property history and milestones',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'pricing-grid',
    name: 'Pricing Comparison',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'pricing', rows: 1, columns: 4 },
    tags: ['grid', 'pricing', 'comparison', 'packages'],
    preview: '💰',
    metadata: {
      description: 'Service pricing comparison grid',
      usage: 'Compare service packages and pricing',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'team-grid',
    name: 'Team Members',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'team', rows: 2, columns: 3 },
    tags: ['grid', 'team', 'agents', 'staff'],
    preview: '👥',
    metadata: {
      description: 'Real estate team member grid',
      usage: 'Showcase team members and expertise',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'service-grid',
    name: 'Services Overview',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'services', rows: 2, columns: 3 },
    tags: ['grid', 'services', 'offerings', 'capabilities'],
    preview: '⚙️',
    metadata: {
      description: 'Real estate services grid layout',
      usage: 'Highlight available services',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  },
  {
    id: 'portfolio-grid',
    name: 'Portfolio Showcase',
    category: 'grids',
    type: 'grid',
    data: { gridType: 'portfolio', rows: 3, columns: 2 },
    tags: ['grid', 'portfolio', 'showcase', 'properties'],
    preview: '🏠',
    metadata: {
      description: 'Property portfolio showcase layout',
      usage: 'Display multiple property listings',
      propertyType: ['residential', 'commercial'],
      marketingUse: ['website', 'brochure', 'flyer']
    }
  }
];

// Text Presets with Google Fonts
export const textPresets: AssetItem[] = [
  {
    id: 'heading-luxury',
    name: 'Luxury Heading',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Playfair Display',
      fontSize: 48,
      fontWeight: '700',
      color: '#1f2937',
      text: 'Luxury Waterfront Home'
    },
    tags: ['heading', 'luxury', 'elegant', 'title'],
    preview: 'H1'
  },
  {
    id: 'heading-modern',
    name: 'Modern Heading',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Montserrat',
      fontSize: 36,
      fontWeight: '600',
      color: '#374151',
      text: 'Modern Family Home'
    },
    tags: ['heading', 'modern', 'clean', 'title'],
    preview: 'H2'
  },
  {
    id: 'body-clean',
    name: 'Clean Body Text',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '400',
      color: '#6b7280',
      text: 'This beautiful property features an open floor plan with modern amenities and stunning views.'
    },
    tags: ['body', 'text', 'paragraph', 'content'],
    preview: 'P'
  },
  {
    id: 'caption-details',
    name: 'Property Details',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '500',
      color: '#9ca3af',
      text: '4 bed • 3 bath • 2,450 sqft'
    },
    tags: ['caption', 'details', 'specs', 'info'],
    preview: 'CAP'
  },
  {
    id: 'price-display',
    name: 'Price Display',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Poppins',
      fontSize: 36,
      fontWeight: '700',
      color: '#059669',
      text: '$750,000'
    },
    tags: ['price', 'cost', 'money', 'highlight'],
    preview: '$'
  },
  {
    id: 'agent-signature',
    name: 'Agent Signature',
    category: 'text',
    type: 'text',
    data: {
      fontFamily: 'Crimson Text',
      fontSize: 18,
      fontWeight: '400',
      color: '#374151',
      text: 'Sarah Johnson\nReal Estate Professional'
    },
    tags: ['signature', 'agent', 'contact', 'professional'],
    preview: 'Sig'
  }
];

// All assets combined
export const allAssets: AssetItem[] = [
  ...realEstateGraphics,
  ...marketingStickers,
  ...basicShapes,
  ...chartTemplates,
  ...photoFrames,
  ...layoutGrids,
  ...textPresets
];

// Assets by category
export const assetsByCategory = {
  graphics: realEstateGraphics,
  stickers: marketingStickers,
  shapes: basicShapes,
  charts: chartTemplates,
  frames: photoFrames,
  grids: layoutGrids,
  text: textPresets
};

// Asset categories for sidebar
export const assetCategories = [
  { id: 'graphics', name: 'Graphics', icon: '🎨', count: realEstateGraphics.length, description: 'Real estate icons and illustrations' },
  { id: 'stickers', name: 'Stickers', icon: '🏷️', count: marketingStickers.length, description: 'Marketing callouts and badges' },
  { id: 'shapes', name: 'Shapes', icon: '🔷', count: basicShapes.length, description: 'Geometric shapes and elements' },
  { id: 'charts', name: 'Charts', icon: '📊', count: chartTemplates.length, description: 'Data visualizations and graphs' },
  { id: 'frames', name: 'Frames', icon: '🖼️', count: photoFrames.length, description: 'Photo frames and borders' },
  { id: 'grids', name: 'Grids', icon: '📐', count: layoutGrids.length, description: 'Layout templates and grids' },
  { id: 'text', name: 'Text', icon: '📝', count: textPresets.length, description: 'Typography and text presets' }
];

// Helper functions
export const getAssetById = (id: string): AssetItem | undefined => {
  return allAssets.find(asset => asset.id === id);
};

export const getAssetsByCategory = (category: string): AssetItem[] => {
  return assetsByCategory[category as keyof typeof assetsByCategory] || [];
};

export const searchAssets = (query: string): AssetItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return allAssets.filter(asset =>
    asset.name.toLowerCase().includes(lowercaseQuery) ||
    asset.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAssetsByType = (type: AssetItem['type']): AssetItem[] => {
  return allAssets.filter(asset => asset.type === type);
};