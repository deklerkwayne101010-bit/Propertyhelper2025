'use client'

import { Building, Eye, Sparkles, TrendingUp } from 'lucide-react'

export function QuickStats() {
  const stats = [
    {
      name: 'Active Listings',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Views',
      value: '1,429',
      change: '+23%',
      changeType: 'positive',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Photo Enhancements',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Templates Used',
      value: '12',
      change: '+4',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>

            <div className="text-sm text-gray-600 mb-2">
              {stat.name}
            </div>

            <div className={`text-xs font-medium ${
              stat.changeType === 'positive'
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}