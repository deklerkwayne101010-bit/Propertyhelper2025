import { Router, Request, Response } from 'express';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Google Places Autocomplete API
router.get('/autocomplete', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { q, country = 'za' } = req.query;

    if (!q || typeof q !== 'string' || q.length < 3) {
      return res.status(400).json({
        success: false,
        error: { message: 'Query must be at least 3 characters long' }
      });
    }

    // Using Google Places API for South Africa
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!googleApiKey) {
      return res.status(500).json({
        success: false,
        error: { message: 'Places API not configured' }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(q)}&` +
      `components=country:${country}&` +
      `key=${googleApiKey}&` +
      `language=en`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.error_message);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to search places' }
      });
    }

    // Transform Google Places response to our format
    const predictions = data.predictions?.map((prediction: any) => ({
      place_id: prediction.place_id,
      description: prediction.description,
      structured_formatting: {
        main_text: prediction.structured_formatting?.main_text || prediction.description,
        secondary_text: prediction.structured_formatting?.secondary_text || ''
      }
    })) || [];

    res.json({
      success: true,
      data: { predictions }
    });

  } catch (error) {
    console.error('Places autocomplete error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Google Places Geocoding API
router.get('/geocode', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { place_id } = req.query;

    if (!place_id || typeof place_id !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Place ID is required' }
      });
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!googleApiKey) {
      return res.status(500).json({
        success: false,
        error: { message: 'Places API not configured' }
      });
    }

    // Get place details first
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${place_id}&` +
      `key=${googleApiKey}&` +
      `language=en&` +
      `fields=formatted_address,geometry,address_component`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      console.error('Google Places Details API error:', detailsData.error_message);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get place details' }
      });
    }

    const place = detailsData.result;
    const location = place.geometry?.location;

    if (!location) {
      return res.status(400).json({
        success: false,
        error: { message: 'Location not found for this place' }
      });
    }

    // Transform to our format
    const result = {
      lat: location.lat,
      lng: location.lng,
      formatted_address: place.formatted_address,
      address_components: place.address_components?.map((component: any) => ({
        long_name: component.long_name,
        short_name: component.short_name,
        types: component.types
      })) || []
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Places geocoding error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Reverse Geocoding (coordinates to address)
router.get('/reverse-geocode', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid latitude and longitude are required' }
      });
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!googleApiKey) {
      return res.status(500).json({
        success: false,
        error: { message: 'Places API not configured' }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?` +
      `latlng=${latitude},${longitude}&` +
      `key=${googleApiKey}&` +
      `language=en`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Reverse Geocoding API error:', data.error_message);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to reverse geocode coordinates' }
      });
    }

    const result = data.results[0];
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { message: 'No address found for these coordinates' }
      });
    }

    const addressComponents = result.address_components?.map((component: any) => ({
      long_name: component.long_name,
      short_name: component.short_name,
      types: component.types
    })) || [];

    const responseData = {
      lat: latitude,
      lng: longitude,
      formatted_address: result.formatted_address,
      address_components: addressComponents
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Address validation for South Africa
router.post('/validate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { address, city, province, postalCode } = req.body;

    if (!address || !city || !province) {
      return res.status(400).json({
        success: false,
        error: { message: 'Address, city, and province are required' }
      });
    }

    // Basic South African address validation
    const validation = {
      isValid: true,
      issues: [] as string[],
      suggestions: [] as string[]
    };

    // Check if province is valid
    const validProvinces = [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
      'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ];

    if (!validProvinces.includes(province)) {
      validation.isValid = false;
      validation.issues.push('Invalid province specified');
      validation.suggestions.push('Please select a valid South African province');
    }

    // Validate postal code if provided
    if (postalCode && !/^\d{4}$/.test(postalCode)) {
      validation.isValid = false;
      validation.issues.push('Invalid postal code format');
      validation.suggestions.push('South African postal codes should be 4 digits');
    }

    // Check for common address issues
    if (address.length < 10) {
      validation.issues.push('Address seems too short');
      validation.suggestions.push('Please provide a complete street address');
    }

    if (!address.match(/\d+/)) {
      validation.issues.push('No street number found');
      validation.suggestions.push('Please include a street number in the address');
    }

    res.json({
      success: true,
      data: { validation }
    });

  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

export { router as placesRoutes };