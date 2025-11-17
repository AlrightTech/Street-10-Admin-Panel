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
          className="fixed inset-0 z-[45] bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          {!sidebarCollapsed && (
            <div className="w-64 flex-shrink-0 bg-primary-500 min-h-screen overflow-y-auto">
              <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="subAdminUsers" />
            </div>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="hidden lg:flex fixed left-0 top-4 z-40 bg-primary-500 text-white p-2 rounded-r-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-[60] w-64 transform border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} currentPage="subAdminUsers" />
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="sticky top-0 z-30 lg:static">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
          </div>

          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pt-6">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <div>
                <button
                  onClick={() => router.push('/sub-admin/users')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Users</span>
                </button>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Dashboard &gt; Users</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-6 border-b border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={mockUserData.profileImage}
                          alt={mockUserData.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-orange-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                          {mockUserData.name}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 break-all">@{mockUserData.username}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 break-all">{mockUserData.email}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{mockUserData.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:ml-8 lg:gap-6 lg:flex-shrink-0 w-full lg:w-auto">
                      <div className="flex flex-col text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">Interests</h3>
                        {mockUserData.interests.map((interest, idx) => (
                          <span key={idx} className="text-sm sm:text-base lg:text-lg text-gray-900">
                            {interest.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-center sm:justify-start w-full sm:w-auto">
                        {mockUserData.interests.map(
                          (interest, idx) =>
                            interest.image && (
                              <img
                                key={idx}
                                src={interest.image}
                                alt={interest.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg object-cover"
                              />
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Orders Made</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">{mockUserData.orders}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Account Status</div>
                      <span className="mt-1 inline-flex items-center rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        {mockUserData.status}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Bidding Wins</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">{mockUserData.biddingWins}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Action</div>
                      <button
                        className="mt-1 text-gray-400 transition-colors hover:text-gray-600"
                        aria-label="Open actions menu"
                        title="Open actions menu"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:justify-end sm:p-6">
                <button
                  onClick={() => setShowAssignRoleModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:w-auto"
                >
                  <UserPlus size={18} />
                  <span>Assign Role</span>
                </button>
              </div>
            </div>
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

