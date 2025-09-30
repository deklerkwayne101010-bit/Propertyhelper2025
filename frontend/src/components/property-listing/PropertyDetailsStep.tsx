'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyFormData } from './PropertyListingWizard';
import { Bed, Bath, Car, Home, Calendar, Ruler, CheckSquare, Plus, X } from 'lucide-react';

interface PropertyDetailsStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [customFeature, setCustomFeature] = useState('');

  // Predefined feature categories for better organization
  const featureCategories = {
    interior: {
      title: 'Interior Features',
      icon: Home,
      features: [
        'Air Conditioning', 'Heating', 'Fireplace', 'Built-in Cupboards',
        'Walk-in Closet', 'Study/Office', 'Open Plan Living',
        'High Ceilings', 'Underfloor Heating', 'Smart Home System'
      ]
    },
    exterior: {
      title: 'Exterior & Garden',
      icon: Home,
      features: [
        'Garden', 'Swimming Pool', 'Patio/Deck', 'Braai Area',
        'Borehole', 'Irrigation System', 'Outdoor Entertainment',
        'Electric Fence', 'Automated Gates', 'Carport'
      ]
    },
    security: {
      title: 'Security Features',
      icon: CheckSquare,
      features: [
        '24/7 Security', 'Alarm System', 'Security Gates',
        'Intercom System', 'Security Cameras', 'Armed Response',
        'Perimeter Wall', 'Security Beams', 'Safe Room'
      ]
    },
    eco: {
      title: 'Eco-Friendly Features',
      icon: CheckSquare,
      features: [
        'Solar Panels', 'Solar Geyser', 'Rainwater Tank',
        'Greywater System', 'Energy Efficient', 'LED Lighting',
        'Insulation', 'Double Glazing', 'Heat Pump'
      ]
    },
    lifestyle: {
      title: 'Lifestyle Features',
      icon: CheckSquare,
      features: [
        'Pet Friendly', 'Child Friendly', 'Wheelchair Accessible',
        'Staff Quarters', 'Gym', 'Wine Cellar',
        'Home Theatre', 'Library', 'Games Room'
      ]
    }
  };

  const handleNumericInput = (field: keyof PropertyFormData, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue !== undefined && (isNaN(numValue) || numValue < 0)) return;

    updateFormData({ [field]: numValue });
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = formData.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];

    updateFormData({ features: newFeatures });
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
      updateFormData({
        features: [...(formData.features || []), customFeature.trim()]
      });
      setCustomFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    const newFeatures = formData.features.filter(f => f !== feature);
    updateFormData({ features: newFeatures });
  };

  const formatArea = (value?: number) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-ZA').format(value) + ' m²';
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* Room Counts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Room Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Basic room counts and layout information
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="w-4 h-4" />
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="3"
                value={formData.bedrooms || ''}
                onChange={(e) => handleNumericInput('bedrooms', e.target.value)}
                min="0"
                max="50"
                className={errors.bedrooms ? 'border-red-500' : ''}
              />
              {errors.bedrooms && (
                <p className="text-sm text-red-600">{errors.bedrooms}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="w-4 h-4" />
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="2.5"
                value={formData.bathrooms || ''}
                onChange={(e) => handleNumericInput('bathrooms', e.target.value)}
                min="0"
                max="50"
                step="0.5"
                className={errors.bathrooms ? 'border-red-500' : ''}
              />
              {errors.bathrooms && (
                <p className="text-sm text-red-600">{errors.bathrooms}</p>
              )}
              <p className="text-xs text-gray-500">
                Use decimals for half bathrooms (e.g., 2.5)
              </p>
            </div>

            {/* Garages */}
            <div className="space-y-2">
              <Label htmlFor="garages" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Garages
              </Label>
              <Input
                id="garages"
                type="number"
                placeholder="2"
                value={formData.garages || ''}
                onChange={(e) => handleNumericInput('garages', e.target.value)}
                min="0"
                max="20"
                className={errors.garages ? 'border-red-500' : ''}
              />
              {errors.garages && (
                <p className="text-sm text-red-600">{errors.garages}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Property Sizes
          </CardTitle>
          <p className="text-sm text-gray-600">
            Floor area and land size in square meters
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Floor Size */}
            <div className="space-y-2">
              <Label htmlFor="floor-size">Floor Size (m²)</Label>
              <div className="relative">
                <Input
                  id="floor-size"
                  type="number"
                  placeholder="150"
                  value={formData.floorSize || ''}
                  onChange={(e) => handleNumericInput('floorSize', e.target.value)}
                  min="0"
                  step="0.01"
                  className={`pr-16 ${errors.floorSize ? 'border-red-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  m²
                </div>
              </div>
              {formData.floorSize && (
                <p className="text-sm text-gray-600">
                  Formatted: {formatArea(formData.floorSize)}
                </p>
              )}
              {errors.floorSize && (
                <p className="text-sm text-red-600">{errors.floorSize}</p>
              )}
            </div>

            {/* Land Size */}
            <div className="space-y-2">
              <Label htmlFor="land-size">Land Size (m²)</Label>
              <div className="relative">
                <Input
                  id="land-size"
                  type="number"
                  placeholder="800"
                  value={formData.landSize || ''}
                  onChange={(e) => handleNumericInput('landSize', e.target.value)}
                  min="0"
                  step="0.01"
                  className={`pr-16 ${errors.landSize ? 'border-red-500' : ''}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  m²
                </div>
              </div>
              {formData.landSize && (
                <p className="text-sm text-gray-600">
                  Formatted: {formatArea(formData.landSize)}
                </p>
              )}
              {errors.landSize && (
                <p className="text-sm text-red-600">{errors.landSize}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year Built */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Property Age
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="year-built">Year Built</Label>
            <Input
              id="year-built"
              type="number"
              placeholder="2020"
              value={formData.yearBuilt || ''}
              onChange={(e) => handleNumericInput('yearBuilt', e.target.value)}
              min="1800"
              max={currentYear}
              className={errors.yearBuilt ? 'border-red-500' : ''}
            />
            {errors.yearBuilt && (
              <p className="text-sm text-red-600">{errors.yearBuilt}</p>
            )}
            <p className="text-sm text-gray-500">
              Leave blank if unknown or for new developments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Property Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Property Features
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select all features that apply to this property
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Feature Categories */}
          {Object.entries(featureCategories).map(([categoryKey, category]) => {
            const Icon = category.icon;
            return (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <h4 className="font-medium text-gray-900">{category.title}</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label
                        htmlFor={feature}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Custom Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Custom Features</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom feature..."
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFeature()}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomFeature}
                disabled={!customFeature.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selected Features Display */}
          {formData.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Selected Features</h4>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Property Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-blue-600" />
              <span>
                {formData.bedrooms || 0} Bedroom{(formData.bedrooms || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-blue-600" />
              <span>
                {formData.bathrooms || 0} Bathroom{(formData.bathrooms || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>
                {formData.garages || 0} Garage{(formData.garages || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-blue-600" />
              <span>
                {formatArea(formData.floorSize)} Floor
              </span>
            </div>
          </div>

          {formData.landSize && (
            <div className="mt-2 text-sm text-blue-700">
              Land Size: {formatArea(formData.landSize)}
            </div>
          )}

          {formData.yearBuilt && (
            <div className="mt-2 text-sm text-blue-700">
              Built in {formData.yearBuilt}
              {currentYear - formData.yearBuilt > 0 && (
                <span className="text-blue-600">
                  {' '}({currentYear - formData.yearBuilt} years old)
                </span>
              )}
            </div>
          )}

          {formData.features.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium text-blue-900 mb-1">
                {formData.features.length} Feature{formData.features.length !== 1 ? 's' : ''}:
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.features.slice(0, 6).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {formData.features.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{formData.features.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsStep;