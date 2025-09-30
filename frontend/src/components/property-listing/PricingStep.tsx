'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyFormData } from './PropertyListingWizard';
import { DollarSign, Percent, Calculator } from 'lucide-react';

interface PricingStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
}

const PricingStep: React.FC<PricingStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const handlePriceChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFormData({ price: numValue });
  };

  const handleCommissionChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    updateFormData({ commissionRate: numValue });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateCommission = () => {
    if (!formData.commissionRate || !formData.price) return 0;

    if (formData.commissionType === 'FIXED') {
      return formData.commissionRate;
    } else {
      return (formData.price * formData.commissionRate) / 100;
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {formData.listingType === 'RENT' ? 'Rental Price' : 'Sale Price'}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {formData.listingType === 'RENT'
              ? 'Monthly rental amount in South African Rand'
              : 'Sale price in South African Rand'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="price">Price (ZAR) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price || ''}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={`pl-10 text-lg ${errors.price ? 'border-red-500' : ''}`}
                min="0"
                step="1000"
              />
            </div>
            {formData.price > 0 && (
              <p className="text-sm text-gray-600">
                Formatted: {formatPrice(formData.price)}
                {formData.listingType === 'RENT' && ' per month'}
              </p>
            )}
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Commission Structure
          </CardTitle>
          <p className="text-sm text-gray-600">
            Set your commission rate for this listing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Commission Type */}
          <div className="space-y-2">
            <Label>Commission Type</Label>
            <Select
              value={formData.commissionType}
              onValueChange={(value) => updateFormData({ commissionType: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                <SelectItem value="FIXED">Fixed Amount (ZAR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commission Rate */}
          <div className="space-y-2">
            <Label htmlFor="commission-rate">
              Commission {formData.commissionType === 'PERCENTAGE' ? 'Rate (%)' : 'Amount (ZAR)'}
            </Label>
            <div className="relative">
              {formData.commissionType === 'PERCENTAGE' ? (
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              )}
              <Input
                id="commission-rate"
                type="number"
                placeholder={formData.commissionType === 'PERCENTAGE' ? '5' : '50000'}
                value={formData.commissionRate || ''}
                onChange={(e) => handleCommissionChange(e.target.value)}
                className="pl-10"
                min="0"
                step={formData.commissionType === 'PERCENTAGE' ? '0.1' : '1000'}
                max={formData.commissionType === 'PERCENTAGE' ? '50' : undefined}
              />
            </div>
          </div>

          {/* Commission Preview */}
          {formData.price > 0 && formData.commissionRate && formData.commissionRate > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calculator className="w-4 h-4" />
                Commission Preview
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Property {formData.listingType === 'RENT' ? 'Rental' : 'Sale'} Price:</span>
                  <span>{formatPrice(formData.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Commission:</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(calculateCommission())}
                  </span>
                </div>
                {formData.commissionType === 'PERCENTAGE' && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Commission Rate:</span>
                    <span>{formData.commissionRate}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VAT Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vat-included"
              checked={formData.priceIncludesVAT}
              onCheckedChange={(checked) => updateFormData({ priceIncludesVAT: !!checked })}
            />
            <Label htmlFor="vat-included" className="text-sm">
              Price includes VAT (if applicable)
            </Label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Check this if the price already includes Value Added Tax
          </p>
        </CardContent>
      </Card>

      {/* Pricing Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Research comparable properties in the area</li>
            <li>• Consider current market conditions</li>
            <li>• Factor in property condition and unique features</li>
            <li>• Set realistic commission rates to attract buyers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingStep;