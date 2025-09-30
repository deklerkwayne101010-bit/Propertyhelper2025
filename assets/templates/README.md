# Template Collection

This directory contains pre-designed templates for Property Helper 2025.

## Directory Structure

```
templates/
├── flyers/                 # Property flyer templates
│   ├── residential/       # Residential property flyers
│   ├── commercial/        # Commercial property flyers
│   ├── land/             # Land listing flyers
│   └── rental/           # Rental property flyers
├── social-media/          # Social media post templates
│   ├── facebook/         # Facebook-optimized templates
│   ├── instagram/        # Instagram post and story templates
│   ├── linkedin/         # LinkedIn professional templates
│   └── twitter/          # Twitter/X post templates
├── presentations/         # Multi-slide presentation templates
│   ├── listing/          # Property listing presentations
│   ├── investment/        # Investment opportunity decks
│   └── market-analysis/   # Market analysis reports
├── email/                # Email newsletter templates
│   ├── property-alerts/  # New listing notifications
│   ├── market-updates/    # Market update newsletters
│   └── promotional/      # Promotional campaigns
└── print/                # Print-ready templates
    ├── brochures/        # Multi-page property brochures
    ├── postcards/        # Direct mail postcards
    └── business-cards/   # Agent business card designs
```

## Template File Structure

Each template should include:
- `template.json` - Template metadata and configuration
- `preview.png` - Template preview image
- `layers/` - Individual layer files (PNG/SVG)
- `fonts/` - Required font files
- `config.json` - Template-specific settings

## Template Metadata Format

```json
{
  "id": "unique-template-id",
  "name": "Template Name",
  "description": "Template description",
  "category": "flyers/residential",
  "dimensions": {
    "width": 1920,
    "height": 1080
  },
  "colorScheme": ["#primary", "#secondary"],
  "tags": ["residential", "modern", "clean"],
  "version": "1.0.0",
  "author": "Property Helper Team",
  "created": "2025-01-01",
  "updated": "2025-01-01"
}
```

## Creating New Templates

1. Design template in the editor
2. Export all layers as individual files
3. Create template metadata JSON
4. Generate preview image
5. Test template loading in editor
6. Update this README with new template

## Template Guidelines

- **Aspect Ratios**: Use standard ratios (16:9, 4:3, 1:1, 9:16)
- **Color Schemes**: Limit to 2-3 primary colors
- **Typography**: Use web-safe fonts or include font files
- **File Sizes**: Keep templates under 2MB when possible
- **Responsive**: Design for both portrait and landscape orientations