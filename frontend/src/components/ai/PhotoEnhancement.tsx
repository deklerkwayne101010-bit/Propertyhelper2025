'use client'

import React, { useState, useCallback } from 'react'
import { Upload, Sparkles, Download, Loader2 } from 'lucide-react'

interface PhotoEnhancementProps {
  onEnhancementComplete?: (originalUrl: string, enhancedUrl: string) => void
}

export const PhotoEnhancement: React.FC<PhotoEnhancementProps> = ({
  onEnhancementComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Handle file selection
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setEnhancedUrl(null)
    }
  }, [])

  // Process image enhancement
  const handleEnhance = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/photos/enhance', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const result = await response.json()
        setEnhancedUrl(result.enhancedUrl)
        setProgress(100)

        if (onEnhancementComplete) {
          onEnhancementComplete(previewUrl!, result.enhancedUrl)
        }
      } else {
        throw new Error('Enhancement failed')
      }
    } catch (error) {
      console.error('Enhancement error:', error)
      alert('Failed to enhance image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Download enhanced image
  const handleDownload = () => {
    if (enhancedUrl) {
      const link = document.createElement('a')
      link.href = enhancedUrl
      link.download = `enhanced-${selectedFile?.name}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Photo Enhancement
        </h2>
        <p className="text-gray-600">
          Transform your property photos with AI-powered enhancement tools
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {selectedFile ? selectedFile.name : 'Click to upload a property photo'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG up to 10MB
            </p>
          </div>
        </label>
      </div>

      {/* Preview and Enhancement */}
      {previewUrl && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Original</h3>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Enhanced Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Enhanced</h3>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {enhancedUrl ? (
                <img
                  src={enhancedUrl}
                  alt="Enhanced"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Enhanced image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhancement Options */}
      {selectedFile && !enhancedUrl && (
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Enhancement Options</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Auto Enhance</p>
                <p className="text-sm text-gray-500">Automatic quality improvement</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Color Correction</p>
                <p className="text-sm text-gray-500">Balance colors and lighting</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">Sharpen</p>
                <p className="text-sm text-gray-500">Increase image sharpness</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {selectedFile && !enhancedUrl && (
          <button
            onClick={handleEnhance}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span>{isProcessing ? 'Processing...' : 'Enhance Photo'}</span>
          </button>
        )}

        {enhancedUrl && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5" />
            <span>Download Enhanced</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Enhancement History */}
      <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Recent Enhancements</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">living-room.jpg</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">View</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">kitchen-photo.jpg</p>
              <p className="text-sm text-gray-500">15 minutes ago</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">View</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoEnhancement