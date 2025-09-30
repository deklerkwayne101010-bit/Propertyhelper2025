'use client';

import React from 'react';
import PropertyListingWizard, { PropertyFormData } from '@/components/property-listing/PropertyListingWizard';

const PropertyListingPage: React.FC = () => {
  const handleSubmit = async (data: PropertyFormData) => {
    try {
      console.log('Submitting property listing:', data);

      // Here you would typically send the data to your backend API
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Property created successfully:', result);

        // Show success message or redirect
        alert('Property listing created successfully!');
      } else {
        throw new Error('Failed to create property listing');
      }
    } catch (error) {
      console.error('Error creating property listing:', error);
      alert('Error creating property listing. Please try again.');
    }
  };

  const handleSaveDraft = async (data: PropertyFormData) => {
    try {
      console.log('Saving property listing as draft:', data);

      // Here you would typically send the data to your backend API
      const response = await fetch('/api/properties/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, status: 'DRAFT' })
      });

      if (response.ok) {
        alert('Draft saved successfully!');
      } else {
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyListingWizard
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        mode="create"
      />
    </div>
  );
};

export default PropertyListingPage;