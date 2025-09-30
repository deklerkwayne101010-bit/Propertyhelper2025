'use client'

import { Building, Camera, FileText, User, Clock } from 'lucide-react'

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: 'listing',
      title: 'New listing published',
      description: 'Modern Apartment in Sandton',
      time: '2 hours ago',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      type: 'enhancement',
      title: 'Photo enhancement completed',
      description: 'Living room photos enhanced with AI',
      time: '4 hours ago',
      icon: Camera,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 3,
      type: 'template',
      title: 'Template created',
      description: 'Luxury Home Brochure Template v2',
      time: '1 day ago',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      type: 'user',
      title: 'New team member added',
      description: 'Sarah Johnson joined the team',
      time: '2 days ago',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 5,
      type: 'listing',
      title: 'Property marked as sold',
      description: 'Cape Town Villa - Sold for R4.2M',
      time: '3 days ago',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center`}>
              <activity.icon className={`h-4 w-4 ${activity.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}