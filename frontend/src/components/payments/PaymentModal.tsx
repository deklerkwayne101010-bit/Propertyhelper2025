'use client'

import React, { useState, useEffect } from 'react'
import { X, CreditCard, Shield, CheckCircle } from 'lucide-react'

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

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  creditPackage: CreditPackage | null
  onPaymentSuccess: (transactionId: string) => void
}

type PaymentMethod = 'STRIPE' | 'PAYFAST'

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  creditPackage,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('STRIPE')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'method' | 'processing' | 'success' | 'error'>('method')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setStep('method')
      setError('')
      setIsProcessing(false)
    }
  }, [isOpen])

  const handlePayment = async () => {
    if (!creditPackage) return

    setIsProcessing(true)
    setStep('processing')
    setError('')

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: creditPackage.price,
          paymentMethod,
          creditPackageId: creditPackage.id,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment creation failed')
      }

      const result = await response.json()

      if (paymentMethod === 'STRIPE' && result.paymentData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.paymentData.url
      } else if (paymentMethod === 'PAYFAST' && result.paymentData?.formData) {
        // Create and submit PayFast form
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = result.paymentData.url

        Object.entries(result.paymentData.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)
      } else {
        throw new Error('Invalid payment response')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setStep('error')
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
    }
  }

  if (!isOpen || !creditPackage) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          {!isProcessing && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {step === 'method' && (
          <>
            {/* Package Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">{creditPackage.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {creditPackage.credits} Credits
                </span>
                <span className="text-xl font-bold">
                  {creditPackage.currency} {creditPackage.price}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium">Choose Payment Method</h3>

              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={paymentMethod === 'STRIPE'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Pay securely with Visa, Mastercard, or Amex
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">SSL Encrypted</span>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYFAST"
                    checked={paymentMethod === 'PAYFAST'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">PayFast</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Popular South African payment methods
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600">SA Payment Gateway</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay {creditPackage.currency} {creditPackage.price}
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Processing Payment...</h3>
            <p className="text-gray-600">
              Please wait while we redirect you to complete your payment.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your credits have been added to your account.
            </p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center py-8">
            <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => setStep('method')}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mr-2"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentModal