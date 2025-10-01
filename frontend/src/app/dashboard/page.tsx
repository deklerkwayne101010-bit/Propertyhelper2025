'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Force dynamic rendering - don't statically generate this page
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    credits: 0,
    templates: 0
  });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push('/auth/signin');
          return;
        }

        setUser(user);

        // Fetch user stats
        try {
          const [propertiesRes, creditsRes, templatesRes] = await Promise.all([
            supabase.from('properties').select('id', { count: 'exact' }).eq('user_id', user.id),
            supabase.from('credits').select('amount, type').eq('user_id', user.id),
            supabase.from('templates').select('id', { count: 'exact' }).eq('user_id', user.id)
          ]);

          // Calculate credit balance
          let creditBalance = 0;
          if (creditsRes.data) {
            creditBalance = creditsRes.data.reduce((total: number, credit: any) => {
              return credit.type === 'USAGE' ? total - credit.amount : total + credit.amount;
            }, 0);
          }

          setStats({
            properties: propertiesRes.count || 0,
            credits: Math.max(0, creditBalance),
            templates: templatesRes.count || 0
          });
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          // Continue with default stats
        }
      } catch (authError) {
        console.error('Auth error:', authError);
        router.push('/auth/signin');
        return;
      }

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
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                Property Helper 2025
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of your real estate activities.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🏠</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Properties
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.properties}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Credit Balance
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.credits}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🎨</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Templates Created
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.templates}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/property-listing"
              className="relative block w-full bg-white rounded-lg p-6 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">+</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    Add Property
                  </p>
                  <p className="text-sm text-gray-500">
                    Create new property listing
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/template-editor"
              className="relative block w-full bg-white rounded-lg p-6 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-200 hover:border-green-300 transition-colors"
            >
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">🎨</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    Template Editor
                  </p>
                  <p className="text-sm text-gray-500">
                    Design marketing materials
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin"
              className="relative block w-full bg-white rounded-lg p-6 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    Admin Panel
                  </p>
                  <p className="text-sm text-gray-500">
                    Manage users & credits
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-500 mb-2">No recent activity yet</p>
                <p className="text-sm text-gray-400">
                  Your property activities will appear here
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">🚀</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Getting Started
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>1. <strong>Add your first property</strong> - Click "Add Property" to create a listing</p>
                  <p>2. <strong>Design marketing materials</strong> - Use the Template Editor for flyers and social posts</p>
                  <p>3. <strong>Purchase credits</strong> - Get credits for AI photo enhancement and premium features</p>
                  <p>4. <strong>Explore admin features</strong> - Manage users and monitor platform activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}