'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Save, X } from 'lucide-react';

// Types for the wizard
export interface PropertyFormData {
  // Basic Information
  title: string;
  description: string;
  price: number;
  propertyType: 'HOUSE' | 'APARTMENT' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER';
  listingType: 'SALE' | 'RENT';

  // Location
  address: string;
  city: string;
  province: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };

  // Property Details
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  floorSize?: number;
  landSize?: number;
  yearBuilt?: number;
  features: string[];

  // Media
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
  }>;
  virtualTourUrl?: string;
  videoUrl?: string;
  floorplans: Array<{
    name: string;
    url: string;
    floor: number;
  }>;

  // Legal & Documents
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;

  // SEO & Marketing
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;

  // Commission & Pricing
  commissionRate?: number;
  commissionType: 'PERCENTAGE' | 'FIXED';
  priceIncludesVAT: boolean;

  // Status
  status: 'DRAFT' | 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE';
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isOptional?: boolean;
  validationSchema?: any;
}

interface PropertyListingWizardProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel?: () => void;
  onSaveDraft?: (data: PropertyFormData) => Promise<void>;
  mode?: 'create' | 'edit';
}

const PropertyListingWizard: React.FC<PropertyListingWizardProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  onSaveDraft,
  mode = 'create'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    propertyType: 'HOUSE',
    listingType: 'SALE',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    features: [],
    images: [],
    floorplans: [],
    documents: [],
    commissionType: 'PERCENTAGE',
    priceIncludesVAT: true,
    status: 'DRAFT',
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: 'basics',
      title: 'Property Basics',
      description: 'Basic information about your property',
      component: PropertyBasicsStep
    },
    {
      id: 'location',
      title: 'Location & Address',
      description: 'Property location and address details',
      component: LocationStep
    },
    {
      id: 'details',
      title: 'Property Details',
      description: 'Bedrooms, bathrooms, size and features',
      component: PropertyDetailsStep
    },
    {
      id: 'media',
      title: 'Photos & Media',
      description: 'Property images, virtual tour and videos',
      component: MediaUploadStep
    },
    {
      id: 'pricing',
      title: 'Pricing & Commission',
      description: 'Price details and commission structure',
      component: PricingStep
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Review your listing and publish',
      component: ReviewStep
    }
  ];

  const updateFormData = useCallback((updates: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors when data is updated
    if (errors) {
      setErrors({});
    }
  }, [errors]);

  const validateCurrentStep = useCallback(() => {
    const step = steps[currentStep];
    if (!step.validationSchema) return true;

    try {
      step.validationSchema.parse(formData);
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        if (err.path.length > 0) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  }, [currentStep, steps, formData]);

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      setIsSubmitting(true);
      try {
        await onSaveDraft(formData);
      } catch (error) {
        console.error('Error saving draft:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Circle className="w-5 h-5 text-blue-500 fill-current" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'create' ? 'Create Property Listing' : 'Edit Property Listing'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'create' ? 'Add a new property to your portfolio' : 'Update your property listing'}
            </p>
          </div>
          <div className="flex gap-2">
            {onSaveDraft && (
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center min-w-0">
                <div className="flex flex-col items-center">
                  {getStepIcon(index)}
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${index === currentStep ? 'text-blue-600' : index < currentStep ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    {step.isOptional && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Optional
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} style={{ minWidth: '2rem' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep].title}
            {steps[currentStep].isOptional && (
              <Badge variant="secondary">Optional</Badge>
            )}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {steps[currentStep].description}
          </p>
        </CardHeader>
        <CardContent>
          {/* Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Step Component */}
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Publishing...' : mode === 'create' ? 'Publish Listing' : 'Update Listing'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Import the actual step components
import PropertyBasicsStep from './PropertyBasicsStep';
import AddressLookupStep from './AddressLookupStep';
import PropertyDetailsStep from './PropertyDetailsStep';
import MediaUploadStep from './MediaUploadStep';
import PricingStep from './PricingStep';
import ReviewStep from './ReviewStep';

const LocationStep: React.FC<any> = ({ formData, updateFormData, errors }) => (
  <AddressLookupStep
    formData={formData}
    updateFormData={updateFormData}
    errors={errors}
  />
);



export default PropertyListingWizard;