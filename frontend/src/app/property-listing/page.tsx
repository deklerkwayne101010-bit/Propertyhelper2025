'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PropertyListingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Property Helper 2025
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.user_metadata?.first_name || user?.email || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Property Listings
            </h1>
            <p className="text-gray-600">
              Create and manage your property listings
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Property Listing Wizard
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                The advanced property listing wizard with image uploads, validation, and multi-step forms is coming soon!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">📝</span>
                </div>
                <h3 className="font-medium text-gray-900">Basic Info</h3>
                <p className="text-sm text-gray-600">Property details & pricing</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">📸</span>
                </div>
                <h3 className="font-medium text-gray-900">Media Upload</h3>
                <p className="text-sm text-gray-600">Photos & documents</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">✅</span>
                </div>
                <h3 className="font-medium text-gray-900">Review & Publish</h3>
                <p className="text-sm text-gray-600">Final validation & listing</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                Back to Dashboard
              </Link>
              <button
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium"
                onClick={() => alert('Property listing wizard coming soon!')}
              >
                Start Listing (Coming Soon)
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Properties
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No properties listed yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Property listing functionality will be available after deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}