'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PropertyFormData } from './PropertyListingWizard';
import {
  Home,
  MapPin,
  DollarSign,
  Camera,
  CheckCircle,
  AlertTriangle,
  Bed,
  Bath,
  Car,
  Ruler,
  Calendar,
  FileText
} from 'lucide-react';

interface ReviewStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  updateFormData,
  errors,
  onSubmit,
  isSubmitting
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatArea = (value?: number) => {
    if (!value) return 'Not specified';
    return new Intl.NumberFormat('en-ZA').format(value) + ' m²';
  };

  const getCompletionScore = () => {
    let score = 0;
    let maxScore = 100;

    // Basic info (30 points)
    if (formData.title) score += 10;
    if (formData.description) score += 10;
    if (formData.price > 0) score += 10;

    // Location (20 points)
    if (formData.address) score += 10;
    if (formData.city && formData.province) score += 10;

    // Property details (20 points)
    if (formData.bedrooms || formData.bathrooms) score += 10;
    if (formData.floorSize || formData.landSize) score += 10;

    // Media (20 points)
    if (formData.images.length > 0) score += 20;

    // Features (10 points)
    if (formData.features.length > 0) score += 10;

    return { score, maxScore, percentage: Math.round((score / maxScore) * 100) };
  };

  const completion = getCompletionScore();

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 border-green-200';
    if (percentage >= 60) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Completion Score */}
      <Card className={getScoreBgColor(completion.percentage)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${getScoreColor(completion.percentage)}`}>
                Listing Completion: {completion.percentage}%
              </h3>
              <p className="text-sm text-gray-600">
                {completion.score} out of {completion.maxScore} sections completed
              </p>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(completion.percentage)}`}>
              {completion.percentage}%
            </div>
          </div>

          {completion.percentage < 80 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Consider adding more details to improve your listing's visibility and buyer interest.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Property Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Property Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{formData.title || 'Untitled Property'}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {formData.propertyType}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatPrice(formData.price)}
                {formData.listingType === 'RENT' && ' per month'}
              </span>
            </div>
          </div>

          {formData.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {formData.address && (
              <p><strong>Address:</strong> {formData.address}</p>
            )}
            <div className="flex gap-4">
              {formData.city && <p><strong>City:</strong> {formData.city}</p>}
              {formData.province && <p><strong>Province:</strong> {formData.province}</p>}
            </div>
            {formData.postalCode && <p><strong>Postal Code:</strong> {formData.postalCode}</p>}
            {formData.coordinates && (
              <p className="text-xs text-gray-500">
                Coordinates: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{formData.bedrooms || 0} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{formData.bathrooms || 0} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-400" />
              <span>{formData.garages || 0} Garages</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-400" />
              <span>{formatArea(formData.floorSize)}</span>
            </div>
          </div>

          {formData.landSize && (
            <p className="text-sm mt-2">
              <strong>Land Size:</strong> {formatArea(formData.landSize)}
            </p>
          )}

          {formData.yearBuilt && (
            <p className="text-sm mt-2">
              <strong>Year Built:</strong> {formData.yearBuilt}
            </p>
          )}

          {formData.features.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Features</h4>
              <div className="flex flex-wrap gap-1">
                {formData.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Camera className="w-4 h-4 text-gray-400" />
            <span>
              {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} uploaded
            </span>
            {formData.images.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {formData.images.filter(img => img.isPrimary).length} primary
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Pricing & Commission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Property Price:</span>
            <span className="font-medium">{formatPrice(formData.price)}</span>
          </div>
          {formData.commissionRate && formData.commissionRate > 0 && (
            <div className="flex justify-between">
              <span>Your Commission:</span>
              <span className="font-medium text-green-600">
                {formatPrice(
                  formData.commissionType === 'FIXED'
                    ? formData.commissionRate
                    : (formData.price * formData.commissionRate) / 100
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>VAT Included:</span>
            <span>{formData.priceIncludesVAT ? 'Yes' : 'No'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Listing Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.status}
              onChange={(e) => updateFormData({ status: e.target.value as any })}
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="ACTIVE">Publish Immediately</option>
              <option value="PENDING">Submit for Review</option>
            </select>
          </div>

          {completion.percentage < 60 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your listing is only {completion.percentage}% complete. Consider adding more details before publishing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => updateFormData({ status: 'DRAFT' })}
        >
          Save as Draft
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || completion.percentage < 30}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Listing'}
        </Button>
      </div>

      {completion.percentage < 30 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please complete at least 30% of the listing details before publishing.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReviewStep;