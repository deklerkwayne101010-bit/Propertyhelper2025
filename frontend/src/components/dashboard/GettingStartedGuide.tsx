'use client'

import { X, CheckCircle, Circle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GettingStartedGuideProps {
  onClose: () => void
}

export function GettingStartedGuide({ onClose }: GettingStartedGuideProps) {
  const steps = [
    {
      id: 1,
      title: 'Complete your profile',
      description: 'Add your agency details and contact information',
      completed: true,
    },
    {
      id: 2,
      title: 'Create your first listing',
      description: 'Add a property listing with photos and details',
      completed: false,
    },
    {
      id: 3,
      title: 'Enhance property photos',
      description: 'Use AI to improve your property images',
      completed: false,
    },
    {
      id: 4,
      title: 'Create a custom template',
      description: 'Design branded property brochures',
      completed: false,
    },
    {
      id: 5,
      title: 'Invite team members',
      description: 'Add colleagues to collaborate on listings',
      completed: false,
    },
  ]

  const completedSteps = steps.filter(step => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {completedSteps}/{steps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                step.completed ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {step.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {step.description}
              </p>
            </div>
            {!step.completed && (
              <ArrowRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Button variant="outline" className="w-full" size="sm">
        Continue Setup
      </Button>
    </div>
  )
}