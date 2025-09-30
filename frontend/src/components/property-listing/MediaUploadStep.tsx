'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PropertyFormData } from './PropertyListingWizard';
import { Upload, Image as ImageIcon, Star, Trash2, Camera, Loader2 } from 'lucide-react';

interface MediaUploadStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  errors: Record<string, string>;
}

interface ImageUpload {
  file: File;
  preview: string;
  isPrimary: boolean;
  order: number;
  uploading?: boolean;
  error?: string;
}

const MediaUploadStep: React.FC<MediaUploadStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [uploads, setUploads] = useState<ImageUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Convert file to base64 for preview
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file =>
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length !== fileArray.length) {
      alert('Some files were skipped. Only image files under 10MB are allowed.');
    }

    const newUploads: ImageUpload[] = await Promise.all(
      validFiles.map(async (file, index) => {
        const preview = await fileToBase64(file);
        return {
          file,
          preview,
          isPrimary: uploads.length === 0 && index === 0, // First image is primary by default
          order: uploads.length + index,
          uploading: false
        };
      })
    );

    setUploads(prev => [...prev, ...newUploads]);
  }, [uploads.length]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Set primary image
  const setPrimaryImage = (index: number) => {
    const updatedUploads = uploads.map((upload, i) => ({
      ...upload,
      isPrimary: i === index
    }));
    setUploads(updatedUploads);
  };

  // Remove image
  const removeImage = (index: number) => {
    const updatedUploads = uploads.filter((_, i) => i !== index);
    setUploads(updatedUploads);
  };

  // Upload images to backend
  const uploadImages = async () => {
    if (uploads.length === 0) return;

    // Mark all as uploading
    setUploads(prev => prev.map(upload => ({ ...upload, uploading: true, error: undefined })));

    try {
      const uploadedImages = [];

      for (const upload of uploads) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', upload.file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });

        if (response.ok) {
          const result = await response.json();
          uploadedImages.push({
            url: result.url,
            alt: `Property image ${upload.order + 1}`,
            isPrimary: upload.isPrimary,
            order: upload.order
          });
        } else {
          throw new Error(`Failed to upload ${upload.file.name}`);
        }
      }

      // Update form data with uploaded images
      updateFormData({ images: uploadedImages });

    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => prev.map(upload => ({
        ...upload,
        uploading: false,
        error: 'Upload failed'
      })));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Property Photos
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload high-quality photos of your property. First photo will be used as the main image.
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drag and drop photos here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
                className="mt-4"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Supported formats: JPG, PNG, WebP</p>
              <p>Maximum file size: 10MB per image</p>
              <p>Recommended: At least 1200x800 pixels</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Previews */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Images ({uploads.length})</CardTitle>
            <p className="text-sm text-gray-600">
              Click the star to set as primary image. Drag to reorder.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploads.map((upload, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={upload.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      {/* Primary indicator */}
                      {upload.isPrimary && (
                        <Badge className="bg-green-600 text-white">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Primary
                        </Badge>
                      )}

                      {/* Action buttons */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant={upload.isPrimary ? "default" : "outline"}
                          onClick={() => setPrimaryImage(index)}
                          className="mr-2"
                        >
                          <Star className={`w-4 h-4 ${upload.isPrimary ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Loading indicator */}
                    {upload.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}

                    {/* Error indicator */}
                    {upload.error && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center">
                        <p className="text-white text-xs text-center p-2">{upload.error}</p>
                      </div>
                    )}
                  </div>

                  {/* Image info */}
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    <p>{upload.file.name}</p>
                    <p>{(upload.file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload button */}
            <div className="mt-6 flex justify-center">
              <Button onClick={uploadImages} disabled={uploads.some(u => u.uploading)}>
                {uploads.some(u => u.uploading) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {uploads.length} Image{uploads.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Alert>
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Photo Tips:</strong> Upload high-quality images showing all rooms, exterior, and key features.
          The first photo will be your main listing image. Consider hiring a professional photographer for best results.
        </AlertDescription>
      </Alert>

      {/* Uploaded Images Summary */}
      {formData.images.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">
                {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} uploaded successfully
              </span>
            </div>
            <div className="mt-2 text-sm text-green-600">
              Primary image: {formData.images.find(img => img.isPrimary)?.alt || 'First image'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUploadStep;