"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  LogOut, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'

interface User {
  id: number
  email: string
  cin_number: string
  first_name: string | null
  last_name: string | null
  full_name: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface Stats {
  total_users: number
  active_users: number
  inactive_users: number
  admin_users: number
  regular_users: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      // Check for token in localStorage first, then cookies
      let token = localStorage.getItem('authToken')
      
      if (!token) {
        // Try to get from cookies (for SSR compatibility)
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
        if (authCookie) {
          token = authCookie.split('=')[1]
        }
      }

      if (!token) {
        router.push(`/${lang}/signin?redirect=/${lang}/admin`)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          if (userData.role !== 'admin') {
            router.push(`/${lang}/chat`)
            return
          }
        } else {
          router.push(`/${lang}/signin?redirect=/${lang}/admin`)
          return
        }
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push(`/${lang}/signin?redirect=/${lang}/admin`)
        return
      }
    }

    checkAdminAccess()
  }, [router, API_URL, lang])

  // Fetch users and stats
  useEffect(() => {
    const fetchData = async () => {
      // Check for token in localStorage first, then cookies
      let token = localStorage.getItem('authToken')
      
      if (!token) {
        // Try to get from cookies (for SSR compatibility)
        const cookies = document.cookie.split(';')
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
        if (authCookie) {
          token = authCookie.split('=')[1]
        }
      }

      if (!token) return

      try {
        setLoading(true)
        
        // Fetch users
        const usersResponse = await fetch(`${API_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }

        // Fetch stats
        const statsResponse = await fetch(`${API_URL}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [API_URL])

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cin_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Handle user actions
  const handleToggleUserStatus = async (userId: number, newStatus: boolean) => {
    // Check for token in localStorage first, then cookies
    let token = localStorage.getItem('authToken')
    
    if (!token) {
      // Try to get from cookies (for SSR compatibility)
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
      if (authCookie) {
        token = authCookie.split('=')[1]
      }
    }

    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, is_active: newStatus })
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_active: newStatus } : user
        ))
        
        // Update stats
        if (stats) {
          if (newStatus) {
            setStats({
              ...stats,
              active_users: stats.active_users + 1,
              inactive_users: stats.inactive_users - 1
            })
          } else {
            setStats({
              ...stats,
              active_users: stats.active_users - 1,
              inactive_users: stats.inactive_users + 1
            })
          }
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleChangeUserRole = async (userId: number, newRole: string) => {
    // Check for token in localStorage first, then cookies
    let token = localStorage.getItem('authToken')
    
    if (!token) {
      // Try to get from cookies (for SSR compatibility)
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
      if (authCookie) {
        token = authCookie.split('=')[1]
      }
    }

    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole })
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        
        // Update stats
        if (stats) {
          if (newRole === 'admin') {
            setStats({
              ...stats,
              admin_users: stats.admin_users + 1,
              regular_users: stats.regular_users - 1
            })
          } else {
            setStats({
              ...stats,
              admin_users: stats.admin_users - 1,
              regular_users: stats.regular_users + 1
            })
          }
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear cookies
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    router.push(`/${lang}/signin`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 mx-auto mb-6"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Admin Dashboard</h2>
          <p className="text-slate-600 text-lg">Please wait while we fetch your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 animate-in slide-in-from-top-2 duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">BH Assurance</h1>
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200 shadow-sm">Admin Panel</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/${lang}/chat`)}
                className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 shadow-sm"
              >
                <Users className="h-4 w-4" />
                <span>Go to Chat</span>
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-600 transition-all duration-200 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-top-4 hover:shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{stats.total_users}</span>
                  <Users className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-top-4 hover:shadow-xl" style={{ animationDelay: '100ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{stats.active_users}</span>
                  <CheckCircle className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-top-4 hover:shadow-xl" style={{ animationDelay: '200ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Admin Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{stats.admin_users}</span>
                  <Shield className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 animate-in slide-in-from-top-4 hover:shadow-xl" style={{ animationDelay: '300ms' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Regular Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{stats.regular_users}</span>
                  <UserPlus className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by email, name, or CIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
              <Badge variant="secondary">{filteredUsers.length} users</Badge>
            </CardTitle>
            <CardDescription>
              Manage user accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">CIN Number</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">Created</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-300 animate-in slide-in-from-left-4 group"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-900">{user.full_name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                          {user.cin_number}
                        </code>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}
                        >
                          {user.role === 'admin' ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <Users className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Badge 
                          variant={user.is_active ? 'default' : 'destructive'}
                          className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {user.is_active ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-4 text-sm text-slate-500">
                        {formatDate(user.created_at)}
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                title="View user details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                      {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>User Details</span>
                                </DialogTitle>
                                <DialogDescription>
                                  Detailed information about {user.full_name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                                  <p className="text-slate-900">{user.full_name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Email</label>
                                  <p className="text-slate-900">{user.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">CIN Number</label>
                                  <p className="text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded">{user.cin_number}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Role</label>
                                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                                    {user.role === 'admin' ? (
                                      <Shield className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Users className="h-3 w-3 mr-1" />
                                    )}
                                    {user.role}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Status</label>
                                  <Badge variant={user.is_active ? 'default' : 'destructive'} className="mt-1">
                                    {user.is_active ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {user.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Created</label>
                                  <p className="text-slate-900">{formatDate(user.created_at)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-700">Last Updated</label>
                                  <p className="text-slate-900">{formatDate(user.updated_at)}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200"
                                title="More actions"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user.id, !user.is_active)}
                                className="cursor-pointer hover:bg-slate-50"
                              >
                                {user.is_active ? (
                                  <>
                                    <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                                    <span>Deactivate User</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    <span>Activate User</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              {user.role === 'user' ? (
                                <DropdownMenuItem
                                  onClick={() => handleChangeUserRole(user.id, 'admin')}
                                  className="cursor-pointer hover:bg-slate-50"
                                >
                                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                  <span>Make Admin</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleChangeUserRole(user.id, 'user')}
                                  className="cursor-pointer hover:bg-slate-50"
                                >
                                  <Users className="h-4 w-4 mr-2 text-slate-600" />
                                  <span>Make User</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-16 animate-in fade-in duration-500">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No users found</h3>
                  <p className="text-slate-500 mb-4 max-w-md mx-auto">
                    {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria to find more users.'
                      : 'There are currently no users in the system.'
                    }
                  </p>
                  {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('')
                        setFilterRole('all')
                        setFilterStatus('all')
                      }}
                      className="hover:bg-slate-50"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 