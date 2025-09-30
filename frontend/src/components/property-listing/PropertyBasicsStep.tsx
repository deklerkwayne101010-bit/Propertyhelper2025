'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PropertyFormData } from './PropertyListingWizard';
import { Home, Building, Building2, MapPin, DollarSign, FileText } from 'lucide-react';

interface PropertyBasicsStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
}

const PropertyBasicsStep: React.FC<PropertyBasicsStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const propertyTypeOptions = [
    { value: 'HOUSE', label: 'House', icon: Home },
    { value: 'APARTMENT', label: 'Apartment', icon: Building },
    { value: 'TOWNHOUSE', label: 'Townhouse', icon: Building2 },
    { value: 'LAND', label: 'Vacant Land', icon: MapPin },
    { value: 'COMMERCIAL', label: 'Commercial', icon: Building },
    { value: 'INDUSTRIAL', label: 'Industrial', icon: Building },
    { value: 'OTHER', label: 'Other', icon: Home }
  ];

  const listingTypeOptions = [
    { value: 'SALE', label: 'For Sale' },
    { value: 'RENT', label: 'For Rent' }
  ];

  const handleTitleChange = (value: string) => {
    updateFormData({ title: value });
    // Auto-generate slug if not manually set
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      updateFormData({ slug: generateSlug(value) });
    }
  };

  const handleDescriptionChange = (value: string) => {
    updateFormData({ description: value });
    // Auto-generate meta description if not manually set
    if (!formData.metaDescription) {
      const autoMeta = value.length > 160 ? value.substring(0, 157) + '...' : value;
      updateFormData({ metaDescription: autoMeta });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const formatPrice = (value: number) => {
    if (formData.listingType === 'RENT') {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value) + ' per month';
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Property Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Property Title *
        </Label>
        <Input
          id="title"
          placeholder="e.g., Modern 3 Bedroom House in Sandton"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={`text-lg ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title}</p>
        )}
        <p className="text-sm text-gray-500">
          Choose a descriptive title that highlights your property's best features
        </p>
      </div>

      {/* Property Type & Listing Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-base font-medium">Property Type *</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => updateFormData({ propertyType: value as any })}
          >
            <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-red-600">{errors.propertyType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">Listing Type *</Label>
          <Select
            value={formData.listingType}
            onValueChange={(value) => updateFormData({ listingType: value as any })}
          >
            <SelectTrigger className={errors.listingType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select listing type" />
            </SelectTrigger>
            <SelectContent>
              {listingTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.listingType && (
            <p className="text-sm text-red-600">{errors.listingType}</p>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="text-base font-medium">
          {formData.listingType === 'RENT' ? 'Monthly Rent' : 'Sale Price'} (ZAR) *
        </Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="price"
            type="number"
            placeholder="0"
            value={formData.price || ''}
            onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
            className={`pl-10 text-lg ${errors.price ? 'border-red-500' : ''}`}
            min="0"
            step="1000"
          />
        </div>
        {formData.price > 0 && (
          <p className="text-sm text-gray-600">
            Formatted: {formatPrice(formData.price)}
          </p>
        )}
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price}</p>
        )}
        <p className="text-sm text-gray-500">
          {formData.listingType === 'RENT'
            ? 'Enter the monthly rental amount in South African Rand'
            : 'Enter the sale price in South African Rand'
          }
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Property Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property in detail. Include information about the location, features, nearby amenities, and what makes this property special..."
          value={formData.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
          maxLength={5000}
        />
        <div className="flex justify-between text-sm">
          <span className={errors.description ? 'text-red-600' : 'text-gray-500'}>
            {errors.description || 'Highlight the best features of your property'}
          </span>
          <span className={formData.description.length > 4500 ? 'text-orange-600' : 'text-gray-400'}>
            {formData.description.length}/5000
          </span>
        </div>
      </div>

      {/* Quick Feature Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Feature Tags</CardTitle>
          <p className="text-sm text-gray-600">
            Select common features to help buyers find your property
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Garden', 'Pool', 'Garage', 'Security', 'Balcony', 'Built-in Cupboards',
              'Air Conditioning', 'Heating', 'Fireplace', 'Study', 'Laundry Room',
              'Pet Friendly', '24/7 Security', 'Electric Fence', 'Alarm System'
            ].map((feature) => (
              <Badge
                key={feature}
                variant={formData.features.includes(feature) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  const newFeatures = formData.features.includes(feature)
                    ? formData.features.filter(f => f !== feature)
                    : [...formData.features, feature];
                  updateFormData({ features: newFeatures });
                }}
              >
                {feature}
              </Badge>
            ))}
          </div>
          {formData.features.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Features:</p>
              <div className="flex flex-wrap gap-1">
                {formData.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Listing Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {formData.title || 'Property Title'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {propertyTypeOptions.find(opt => opt.value === formData.propertyType)?.label || 'Property Type'}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formData.price > 0 ? formatPrice(formData.price) : 'Price not set'}
              </span>
            </div>
            {formData.description && (
              <p className="text-sm text-gray-700 line-clamp-3">
                {formData.description}
              </p>
            )}
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.features.slice(0, 5).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {formData.features.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{formData.features.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyBasicsStep;