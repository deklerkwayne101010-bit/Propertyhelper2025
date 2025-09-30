'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, Plus, Minus, History, Package, Loader2 } from 'lucide-react'

interface CreditPackage {
  id: string
  name: string
  description?: string
  credits: number
  price: number
  currency: string
  isActive: boolean
  isPopular: boolean
  sortOrder: number
}

interface CreditSystemProps {
  currentCredits?: number
  onPurchaseCredits?: (packageData: CreditPackage) => void
  onUseCredits?: (amount: number) => void
}

export const CreditSystem: React.FC<CreditSystemProps> = ({
  currentCredits = 150,
  onPurchaseCredits,
  onUseCredits
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchCreditPackages()
  }, [])

  const fetchCreditPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (!response.ok) throw new Error('Failed to fetch packages')

      const result = await response.json()
      if (result.success) {
        setCreditPackages(result.data.packages)
      } else {
        throw new Error(result.error?.message || 'Failed to fetch packages')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load packages')
      console.error('Error fetching credit packages:', err)
    } finally {
      setLoading(false)
    }
  }

  const transactionHistory = [
    {
      id: '1',
      type: 'purchase',
      amount: 150,
      cost: 24.99,
      date: '2024-01-15',
      description: 'Credit package purchase'
    },
    {
      id: '2',
      type: 'usage',
      amount: -5,
      cost: 0,
      date: '2024-01-14',
      description: 'AI photo enhancement'
    },
    {
      id: '3',
      type: 'usage',
      amount: -10,
      cost: 0,
      date: '2024-01-13',
      description: 'Template generation'
    }
  ]

  const handlePurchase = (pkg: CreditPackage) => {
    setSelectedPackage(pkg.id)
    if (onPurchaseCredits) {
      onPurchaseCredits(pkg)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading credit packages...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Failed to load credit packages</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCreditPackages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Credit Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Credit Balance</h2>
            <p className="text-blue-100 mt-1">Available credits for AI features</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{currentCredits}</div>
            <div className="text-blue-100">Credits</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Credit Packages */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Purchase Credits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${pkg.isPopular ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{pkg.name}</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {pkg.credits}
                    </div>
                    <div className="text-gray-500 mb-4">Credits</div>
                    <div className="text-2xl font-bold mb-4">
                      ${pkg.price}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(pkg)
                      }}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">How Credits Are Used</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>AI Photo Enhancement</span>
                </div>
                <span className="font-medium">5 credits</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Property Description Generation</span>
                </div>
                <span className="font-medium">10 credits</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Template Generation</span>
                </div>
                <span className="font-medium">15 credits</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span>Custom AI Request</span>
                </div>
                <span className="font-medium">25 credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <History className="w-4 h-4" />
                <span>{showHistory ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            {showHistory && (
              <div className="space-y-3">
                {transactionHistory.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'purchase' ? '+' : ''}{transaction.amount}
                      </div>
                      {transaction.cost > 0 && (
                        <div className="text-xs text-gray-500">
                          ${transaction.cost}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Buy Credits</p>
                  <p className="text-sm text-gray-500">Purchase additional credits</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                <Plus className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Add Credits</p>
                  <p className="text-sm text-gray-500">Manual credit adjustment</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditSystem