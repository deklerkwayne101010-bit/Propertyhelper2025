'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { CreditBalanceWidget } from '@/components/dashboard/CreditBalanceWidget'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivities } from '@/components/dashboard/RecentActivities'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { GettingStartedGuide } from '@/components/dashboard/GettingStartedGuide'

export default function DashboardPage() {
  const [showGettingStarted, setShowGettingStarted] = useState(true)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">
            Here's what's happening with your properties today.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Balance Widget */}
            <CreditBalanceWidget />

            {/* Quick Stats */}
            <QuickStats />

            {/* Recent Activities */}
            <RecentActivities />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Getting Started Guide */}
            {showGettingStarted && (
              <GettingStartedGuide onClose={() => setShowGettingStarted(false)} />
            )}

            {/* Additional widgets can go here */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}