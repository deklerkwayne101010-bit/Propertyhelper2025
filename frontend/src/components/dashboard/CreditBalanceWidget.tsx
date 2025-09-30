'use client'

import { CreditCard, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CreditBalanceWidget() {
  const currentCredits = 247
  const usedThisMonth = 153
  const totalThisMonth = 400

  const usagePercentage = (usedThisMonth / totalThisMonth) * 100

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Credit Balance</h3>
        <CreditCard className="h-5 w-5 text-blue-600" />
      </div>

      {/* Current Balance */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {currentCredits.toLocaleString()}
        </div>
        <p className="text-sm text-gray-600">Available Credits</p>
      </div>

      {/* Usage Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Monthly Usage</span>
          <span className="text-sm text-gray-500">
            {usedThisMonth}/{totalThisMonth}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {usagePercentage.toFixed(0)}% used this month
        </p>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Transactions</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">Photo Enhancement</span>
            </div>
            <span className="text-gray-900 font-medium">-25 credits</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">Template Creation</span>
            </div>
            <span className="text-gray-900 font-medium">-15 credits</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Plus className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-gray-600">Credits Purchased</span>
            </div>
            <span className="text-green-600 font-medium">+200 credits</span>
          </div>
        </div>
      </div>

      {/* Top Up Button */}
      <Button className="w-full" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Top Up Credits
      </Button>
    </div>
  )
}