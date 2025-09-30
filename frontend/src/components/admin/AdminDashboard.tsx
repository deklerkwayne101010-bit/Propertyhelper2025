'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  Package,
  CreditCard,
  FileText,
  Monitor,
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Upload,
  Download
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProperties: number
  activeProperties: number
  totalTemplates: number
  aiGenerations: number
  totalCredits: number
  revenue: number
}

interface RecentActivity {
  id: string
  action: string
  entityType: string
  user: string
  timestamp: string
  severity: 'info' | 'warning' | 'success'
}

interface SystemHealth {
  database: { status: string; uptime: string; responseTime: string }
  api: { status: string; responseTime: string }
  storage: { status: string; usage: string }
  ai: { status: string; message: string }
}

interface DashboardData {
  stats: AdminStats
  recentActivities: RecentActivity[]
  systemHealth: SystemHealth
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  isVerified: boolean
  lastLogin: string | null
  createdAt: string
  _count: {
    properties: number
    templates: number
    credits: number
  }
}

interface AdminDashboardProps {
  initialStats?: AdminStats
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialStats
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'assets', label: 'Assets', icon: Upload },
    { id: 'pricing', label: 'Pricing', icon: Package },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'portals', label: 'Portals', icon: MapPin },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor },
  ]

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Fetch users data when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        try {
          const response = await fetch('/api/admin/users')
          if (!response.ok) {
            throw new Error('Failed to fetch users')
          }
          const data = await response.json()
          setUsers(data.users)
        } catch (err) {
          console.error('Failed to fetch users:', err)
        }
      }
      fetchUsers()
    }
  }, [activeTab])

  const recentActivities = [
    {
      id: '1',
      type: 'user_signup',
      message: 'New user registered: john.doe@example.com',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment received: $29.99 for 150 credits',
      timestamp: '5 minutes ago',
      severity: 'success'
    },
    {
      id: '3',
      type: 'system',
      message: 'Database backup completed successfully',
      timestamp: '1 hour ago',
      severity: 'info'
    },
    {
      id: '4',
      type: 'security',
      message: 'Failed login attempts detected from IP 192.168.1.100',
      timestamp: '2 hours ago',
      severity: 'warning'
    }
  ]

  const systemHealth = {
    database: { status: 'healthy', uptime: '99.9%' },
    api: { status: 'healthy', responseTime: '120ms' },
    storage: { status: 'healthy', usage: '67%' },
    ai: { status: 'warning', message: 'High latency detected' }
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
          <p className="mt-4 text-red-600">Error loading dashboard: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform management and analytics</p>
      </div>

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r p-6">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && dashboardData && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-600 ml-2">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.activeUsers.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-600 ml-2">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalProperties.toLocaleString()}</p>
                    </div>
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+15%</span>
                    <span className="text-gray-600 ml-2">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">${dashboardData.stats.revenue.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+23%</span>
                    <span className="text-gray-600 ml-2">from last month</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* System Health */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">System Health</h3>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.systemHealth).map(([key, health]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            health.status === 'healthy' ? 'bg-green-500' :
                            health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {'usage' in health && <div>Usage: {health.usage}</div>}
                          {'responseTime' in health && <div>Response: {health.responseTime}</div>}
                          {'uptime' in health && <div>Uptime: {health.uptime}</div>}
                          {'message' in health && <div className="text-yellow-600">{health.message}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {dashboardData.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.severity === 'warning' ? 'bg-yellow-500' :
                          activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action} - {activity.entityType}</p>
                          <p className="text-xs text-gray-500 mt-1">by {activity.user} • {new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Usage Stats */}
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">AI Service Usage</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardData.stats.aiGenerations.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total AI Generations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardData.stats.totalTemplates}
                    </div>
                    <div className="text-sm text-gray-600">Templates Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      94.2%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* User Management Header */}
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Roles</option>
                      <option value="USER">User</option>
                      <option value="AGENT">Agent</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    <select className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'AGENT' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user._count.properties}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user._count.credits}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bulk Actions */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Activate Selected
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      Deactivate Selected
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                      Delete Selected
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Showing {users.length} users
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Security Center</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>SSL Certificate</span>
                    </div>
                    <span className="text-green-600 font-medium">Valid</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span>Failed Login Attempts</span>
                    </div>
                    <span className="text-yellow-600 font-medium">3 today</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Asset Library Management</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Upload className="w-4 h-4" />
                    <span>Upload Asset</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Asset Categories */}
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900">Graphics</h4>
                      <p className="text-xs text-gray-500 mt-1">Upload logos, icons, backgrounds</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900">Stickers</h4>
                      <p className="text-xs text-gray-500 mt-1">Upload property stickers, badges</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-gray-900">Templates</h4>
                      <p className="text-xs text-gray-500 mt-1">Upload property listing templates</p>
                    </div>
                  </div>
                </div>

                {/* Asset Grid */}
                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Recent Assets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Mock asset items */}
                    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs font-medium truncate">Modern House Template</p>
                      <p className="text-xs text-gray-500">Template</p>
                    </div>

                    <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs font-medium truncate">For Sale Sticker</p>
                      <p className="text-xs text-gray-500">Sticker</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Pricing & Packages</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                    <span>Add Package</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Credit Packages */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Starter Package</h4>
                        <p className="text-sm text-gray-600">100 credits for basic users</p>
                        <p className="text-lg font-bold text-green-600 mt-1">R 99.00</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Professional Package</h4>
                        <p className="text-sm text-gray-600">500 credits for agents</p>
                        <p className="text-lg font-bold text-green-600 mt-1">R 399.00</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Codes Section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Promotional Codes</h4>
                    <button className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                      <Plus className="w-3 h-3" />
                      <span>Add Promo</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">WELCOME20</p>
                        <p className="text-sm text-gray-600">20% off first purchase</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Billing & Transactions</h3>
                  <div className="flex space-x-3">
                    <select className="px-3 py-2 border rounded-lg text-sm">
                      <option>All Status</option>
                      <option>Completed</option>
                      <option>Pending</option>
                      <option>Failed</option>
                    </select>
                    <input
                      type="date"
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="From date"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="To date"
                    />
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800">Total Revenue</h4>
                    <p className="text-2xl font-bold text-green-900">R 45,678.90</p>
                    <p className="text-sm text-green-600">+23% from last month</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Transactions</h4>
                    <p className="text-2xl font-bold text-blue-900">1,247</p>
                    <p className="text-sm text-blue-600">+15% from last month</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800">Avg Transaction</h4>
                    <p className="text-2xl font-bold text-yellow-900">R 36.60</p>
                    <p className="text-sm text-yellow-600">+5% from last month</p>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono">#TXN-001</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">john.doe@example.com</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">R 99.00</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Portal Integration</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <MapPin className="w-4 h-4" />
                    <span>Configure Portal</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                          Property24 Integration
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Field mapping for Property24 listings</p>
                        <div className="mt-3 space-y-2">
                          <div className="text-xs">
                            <span className="font-medium">Title:</span> property.title → listing_title
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Description:</span> property.description → listing_description
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Price:</span> property.price → listing_price
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">Configure</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Audit Logs</h3>
                  <div className="flex space-x-3">
                    <select className="px-3 py-2 border rounded-lg text-sm">
                      <option>All Actions</option>
                      <option>USER_CREATE</option>
                      <option>USER_UPDATE</option>
                      <option>USER_DELETE</option>
                      <option>PAYMENT</option>
                    </select>
                    <input
                      type="date"
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="From date"
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border rounded-lg text-sm"
                      placeholder="To date"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">User login</p>
                        <p className="text-xs text-gray-500">john.doe@example.com • 2 minutes ago</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">INFO</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">User account deleted</p>
                        <p className="text-xs text-gray-500">admin@example.com • 1 hour ago</p>
                      </div>
                    </div>
                    <span className="text-xs text-red-600">WARNING</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment processed</p>
                        <p className="text-xs text-gray-500">R 99.00 • jane.smith@example.com • 3 hours ago</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-600">SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-6">System Monitoring</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">245</div>
                    <div className="text-sm text-gray-600">Requests/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">45ms</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">67%</div>
                    <div className="text-sm text-gray-600">Storage Used</div>
                  </div>
                </div>

                {/* System Services */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium">Service Status</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Database</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900">Healthy</div>
                        <div className="text-gray-500">12 connections</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">API Server</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900">Healthy</div>
                        <div className="text-gray-500">120ms response</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">AI Service</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-yellow-600">Warning</div>
                        <div className="text-gray-500">High latency</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Storage</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900">Healthy</div>
                        <div className="text-gray-500">67% used</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard