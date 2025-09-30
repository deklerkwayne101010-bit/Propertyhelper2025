'use client'

import Link from 'next/link'
import { Plus, Camera, FileText, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const actions = [
    {
      name: 'Create Listing',
      href: '/dashboard/listings/new',
      icon: Plus,
      description: 'Add a new property listing',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Enhance Photos',
      href: '/dashboard/photos/enhance',
      icon: Camera,
      description: 'AI-powered photo enhancement',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: FileText,
      description: 'Create custom property templates',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      name: 'Buy Credits',
      href: '/dashboard/credits',
      icon: CreditCard,
      description: 'Purchase additional credits',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link key={action.name} href={action.href}>
            <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
              <div className={`p-3 rounded-full ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-900 text-center mb-1">
                {action.name}
              </h3>
              <p className="text-xs text-gray-500 text-center">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}