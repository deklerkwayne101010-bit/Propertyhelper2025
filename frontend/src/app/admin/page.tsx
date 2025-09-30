'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Building,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProperties: number;
    totalTemplates: number;
    totalTransactions: number;
  };
  recentActivity: any[];
  systemHealth: {
    status: string;
    database: string;
    api: string;
    responseTime: number;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down';
  trendValue?: string;
}) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && trendValue && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend === 'up' ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                  )}
                  <span className="ml-1">{trendValue}</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to the RealEstate Pro admin panel. Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.overview.totalUsers}
          icon={Users}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Active Users"
          value={data.overview.activeUsers}
          icon={Activity}
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Properties"
          value={data.overview.totalProperties}
          icon={Building}
          trend="up"
          trendValue="+23%"
        />
        <StatCard
          title="Templates"
          value={data.overview.totalTemplates}
          icon={FileText}
          trend="up"
          trendValue="+15%"
        />
      </div>

      {/* System Health and Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* System Health */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {data.systemHealth.status === 'healthy' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
                  <dd className="flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900 capitalize">
                      {data.systemHealth.status}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Database:</span>
                <span className={`font-medium ${
                  data.systemHealth.database === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.systemHealth.database}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">API:</span>
                <span className={`font-medium ${
                  data.systemHealth.api === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.systemHealth.api}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Response Time:</span>
                <span className="font-medium text-gray-900">
                  {data.systemHealth.responseTime}ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {data.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">
                            {activity.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.type} - ${activity.amount}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Add New User
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              View Reports
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              System Settings
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}