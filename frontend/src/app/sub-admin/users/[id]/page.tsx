'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, ArrowLeft, UserPlus, MoreVertical, Megaphone, Settings, DollarSign, Headphones, Check, CheckCircle } from 'lucide-react'

// Mock user data - in real app, fetch from API based on ID
const mockUserData = {
  id: 1,
  name: 'Touseef Ahmed',
  username: 'Touseeef',
  email: 'alice.johnson@example.com',
  phone: '+1 234 567 8900',
  status: 'Verified',
  orders: 12,
  biddingWins: 22,
  interests: [
    { name: 'Cars', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' }
  ],
  profileImage: 'https://i.pravatar.cc/150?img=33'
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roleOptions = [
    {
      id: 'marketing-admin',
      title: 'Marketing Admin',
      description: 'Manages campaigns, content, and marketing analytics.',
      icon: Megaphone,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'operation-admin',
      title: 'Operation Admin',
      description: 'Handles products, orders, and operational tasks.',
      icon: Settings,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'finance-admin',
      title: 'Finance Admin',
      description: 'Access to financial reports and budget management.',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'support-admin',
      title: 'Support Admin',
      description: 'Manages customer support and ticket resolution.',
      icon: Headphones,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleAssignRole = () => {
    if (selectedRole) {
      // Handle role assignment
      setShowAssignRoleModal(false)
      setShowSuccessModal(true)
      setSelectedRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="subAdminUsers" />
          </div>
        )}
        
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className={`flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 ${sidebarCollapsed ? 'w-full' : ''}`}>
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            {/* Breadcrumb */}
            <div className="mb-4">
              <button
                onClick={() => router.push('/sub-admin/users')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft size={16} />
                <span>Back to Users</span>
              </button>
              <p className="text-sm text-gray-500">Dashboard &gt; Users</p>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              {/* Top Section - Profile and Interests */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  {/* Left Side - Profile Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Profile Picture */}
                    <div className="relative">
                      <img 
                        src={mockUserData.profileImage} 
                        alt={mockUserData.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
                      />
                    </div>
                    {/* User Info */}
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{mockUserData.name}</h1>
                      <p className="text-sm text-gray-600 mb-1">@{mockUserData.username}</p>
                      <p className="text-sm text-gray-600 mb-1">{mockUserData.email}</p>
                      <p className="text-sm text-gray-600">{mockUserData.phone}</p>
                    </div>
                  </div>
                  
                  {/* Right Side - Interests */}
                  <div className="ml-8 flex items-center gap-6">
                    {/* Left - Text Content */}
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Interests</h3>
                      {mockUserData.interests.map((interest, idx) => (
                        <span key={idx} className="text-lg text-gray-900 font-normal">
                          {interest.name}
                        </span>
                      ))}
                    </div>
                    {/* Right - Visual Content */}
                    <div className="flex-shrink-0">
                      {mockUserData.interests.map((interest, idx) => (
                        interest.image && (
                          <img 
                            key={idx}
                            src={interest.image} 
                            alt={interest.name}
                            className="w-28 h-28 rounded-lg object-cover"
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Statistics Table */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6">
                  {/* Orders Made */}
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Orders Made</div>
                    <div className="text-lg font-semibold text-gray-900">{mockUserData.orders}</div>
                  </div>
                  
                  {/* Account Status */}
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Account Status</div>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                        {mockUserData.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Number of bidding wins */}
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Number of bidding wins</div>
                    <div className="text-lg font-semibold text-gray-900">{mockUserData.biddingWins}</div>
                  </div>
                  
                  {/* Action */}
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Action</div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Assign Role Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAssignRoleModal(true)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <UserPlus size={18} />
                <span>Assign Role</span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[45] bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`
          fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="subAdminUsers" />
        </div>

        <div className="flex-1 flex flex-col min-h-screen bg-gray-50 pt-20 lg:pt-0">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
            <button
              onClick={() => router.push('/sub-admin/users')}
              className="flex items-center gap-2 text-xs text-gray-600 mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Users</span>
            </button>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <img 
                    src={mockUserData.profileImage} 
                    alt={mockUserData.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-orange-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 mb-1">{mockUserData.name}</h1>
                    <p className="text-xs text-gray-600 mb-1">@{mockUserData.username}</p>
                    <p className="text-xs text-gray-600 mb-1">{mockUserData.email}</p>
                    <p className="text-xs text-gray-600">{mockUserData.phone}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Interests</h3>
                      {mockUserData.interests.map((interest, idx) => (
                        <span key={idx} className="text-sm text-gray-900">
                          {interest.name}
                        </span>
                      ))}
                    </div>
                    {mockUserData.interests.map((interest, idx) => (
                      interest.image && (
                        <img 
                          key={idx}
                          src={interest.image} 
                          alt={interest.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Orders Made</div>
                    <div className="text-base font-semibold">{mockUserData.orders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                      {mockUserData.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Bidding Wins</div>
                    <div className="text-base font-semibold">{mockUserData.biddingWins}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Action</div>
                    <button className="text-gray-400">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAssignRoleModal(true)}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              <span>Assign Role</span>
            </button>
          </main>
        </div>
      </div>

      {/* Assign Role Modal */}
      <Modal
        isOpen={showAssignRoleModal}
        onClose={() => {
          setShowAssignRoleModal(false)
          setSelectedRole(null)
        }}
        title="Assign Role"
        size="lg"
      >
        <div>
          <p className="text-sm text-gray-600 mb-6">
            Select a role to assign to <span className="font-semibold text-gray-900">{mockUserData.name}</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roleOptions.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{role.title}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setShowAssignRoleModal(false)
                setSelectedRole(null)
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignRole}
              disabled={!selectedRole}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Role
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Assigned Successfully!</h3>
          <p className="text-sm text-gray-600 mb-6">
            The role has been assigned to {mockUserData.name} successfully.
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

