import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings, 
  RefreshCw, 
  Search,
  Edit,
  Trash2,
  Plus
} from "lucide-react"

interface User {
  id: number
  email: string
  cin_number: string
  first_name?: string
  last_name?: string
  full_name: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface AdminStats {
  total_users: number
  active_users: number
  admin_users: number
  inactive_users: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }
    return null
  }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) {
        setError("No authentication token found")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  // Update user role
  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, new_role: newRole })
      })

      if (response.ok) {
        setSuccess(`User role updated to ${newRole}`)
        fetchUsers() // Refresh user list
        fetchStats() // Refresh stats
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error('Failed to update user role')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role')
      setTimeout(() => setError(null), 3000)
    }
  }

  // Update user status
  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, is_active: isActive })
      })

      if (response.ok) {
        setSuccess(`User status updated to ${isActive ? 'active' : 'inactive'}`)
        fetchUsers() // Refresh user list
        fetchStats() // Refresh stats
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error('Failed to update user status')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status')
      setTimeout(() => setError(null), 3000)
    }
  }

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cin_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    
    return matchesSearch && matchesRole
  })

  // Load data on component mount
  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>
        <Button onClick={() => { fetchUsers(); fetchStats(); }} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.admin_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive_users}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by email, name, or CIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">CIN</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-2">{user.cin_number}</td>
                    <td className="p-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={(checked) => updateUserStatus(user.id, checked)}
                        />
                        <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 