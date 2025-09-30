'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PropertyFormData } from './PropertyListingWizard';
import { MapPin, Navigation, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AddressLookupStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
}

interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

const AddressLookupStep: React.FC<AddressLookupStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [searchQuery, setSearchQuery] = useState(formData.address || '');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string>('');

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // South African provinces for validation
  const southAfricanProvinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  ];

  // Auto-complete search using Google Places-like API
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using a South Africa-focused places API
      const response = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(query)}&country=za`);

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.predictions || []);
        setShowSuggestions(true);
      } else {
        console.error('Places API error:', response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Geocode address to get coordinates and formatted address
  const geocodeAddress = async (placeId: string) => {
    setIsGeocoding(true);
    setGeocodeError('');

    try {
      const response = await fetch(`/api/places/geocode?place_id=${placeId}`);

      if (response.ok) {
        const data: GeocodeResult = await response.json();

        // Extract address components
        const addressComponents = data.address_components;
        const getComponent = (types: string[]) =>
          addressComponents.find(component => types.some(type => component.types.includes(type)));

        const streetNumber = getComponent(['street_number'])?.long_name;
        const streetName = getComponent(['route'])?.long_name;
        const suburb = getComponent(['sublocality', 'locality'])?.long_name;
        const city = getComponent(['locality'])?.long_name || getComponent(['administrative_area_level_2'])?.long_name;
        const province = getComponent(['administrative_area_level_1'])?.long_name;
        const postalCode = getComponent(['postal_code'])?.long_name;

        // Build full address
        const fullAddress = [streetNumber, streetName, suburb, city, province].filter(Boolean).join(', ');

        // Update form data
        updateFormData({
          address: fullAddress,
          city: city || '',
          province: province || '',
          postalCode: postalCode || '',
          coordinates: { lat: data.lat, lng: data.lng }
        });

        setSearchQuery(fullAddress);
        setShowSuggestions(false);

      } else {
        setGeocodeError('Failed to get location details. Please try again.');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setGeocodeError('Error getting location details. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle manual address input
  const handleManualAddressChange = (field: keyof PropertyFormData, value: string) => {
    updateFormData({ [field]: value });

    // Clear coordinates if address is manually edited
    if (field === 'address' && formData.coordinates) {
      updateFormData({ coordinates: undefined });
    }
  };

  // Validate South African postal code
  const isValidPostalCode = (postalCode: string) => {
    return /^\d{4}$/.test(postalCode);
  };

  const selectedPlace = suggestions.find(s => s.description === searchQuery);

  return (
    <div className="space-y-6">
      {/* Address Search */}
      <div className="space-y-2">
        <Label htmlFor="address-search" className="text-base font-medium">
          Search Address *
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="address-search"
            placeholder="Start typing to search for your property address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
            className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
            <CardContent className="p-0">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 focus:outline-none focus:bg-blue-50"
                  onClick={() => geocodeAddress(suggestion.place_id)}
                  disabled={isGeocoding}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.structured_formatting.main_text}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
        <p className="text-sm text-gray-500">
          Search for your property address using our South Africa-focused database
        </p>
      </div>

      {/* Manual Address Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address Details</CardTitle>
          <p className="text-sm text-gray-600">
            Review and edit the address details below
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Address */}
          <div className="space-y-2">
            <Label htmlFor="full-address">Full Address</Label>
            <Input
              id="full-address"
              placeholder="123 Main Street, Sandton, Johannesburg"
              value={formData.address}
              onChange={(e) => handleManualAddressChange('address', e.target.value)}
              className={errors.address ? 'border-red-500' : ''}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City/Town *</Label>
              <Input
                id="city"
                placeholder="Johannesburg"
                value={formData.city}
                onChange={(e) => handleManualAddressChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => handleManualAddressChange('province', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.province ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Province</option>
                {southAfricanProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-sm text-red-600">{errors.province}</p>
              )}
            </div>
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal-code">Postal Code</Label>
            <Input
              id="postal-code"
              placeholder="2191"
              value={formData.postalCode}
              onChange={(e) => handleManualAddressChange('postalCode', e.target.value)}
              maxLength={4}
              className={formData.postalCode && !isValidPostalCode(formData.postalCode) ? 'border-orange-500' : ''}
            />
            {formData.postalCode && !isValidPostalCode(formData.postalCode) && (
              <p className="text-sm text-orange-600">Postal code should be 4 digits</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coordinates Display */}
      {formData.coordinates && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Location Verified</span>
            </div>
            <div className="mt-2 text-sm text-green-600">
              <div>Latitude: {formData.coordinates.lat.toFixed(6)}</div>
              <div>Longitude: {formData.coordinates.lng.toFixed(6)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geocoding Error */}
      {geocodeError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{geocodeError}</AlertDescription>
        </Alert>
      )}

      {/* Map Preview Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Map Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {formData.coordinates ? (
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">Location Set</p>
                <p className="text-sm text-gray-600">
                  {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Map preview will appear here</p>
                <p className="text-sm text-gray-400">
                  Complete address search to see location
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">Address Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the search function for accurate geocoding</li>
            <li>• Include street number and suburb for better results</li>
            <li>• Verify the location on the map preview</li>
            <li>• Coordinates help with property search and mapping features</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressLookupStep;