import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Plus, MoreVertical, UserPlus, Megaphone, Settings, DollarSign, Headphones, Check, CheckCircle } from 'lucide-react'

export default function SubAdminUsersPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [assignedUsersCount, setAssignedUsersCount] = useState(0)

  const roleOptions = [
    {
      id: 'marketing-admin',
      titleKey: 'marketingAdmin',
      descriptionKey: 'marketingAdminDesc',
      icon: Megaphone,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'operation-admin',
      titleKey: 'operationAdmin',
      descriptionKey: 'operationAdminDesc',
      icon: Settings,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'finance-admin',
      titleKey: 'financeAdmin',
      descriptionKey: 'financeAdminDesc',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'support-admin',
      titleKey: 'supportAdmin',
      descriptionKey: 'supportAdminDesc',
      icon: Headphones,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const handleAssignRole = () => {
    if (selectedRole && selectedUsers.length > 0) {
      // Handle role assignment
      setAssignedUsersCount(selectedUsers.length)
      setShowAssignRoleModal(false)
      setShowSuccessModal(true)
      setSelectedUsers([])
      setSelectedRole(null)
    }
  }

  // Mock users data - matching the image format
  const users = [
    { 
      id: 1, 
      name: 'Touseef Ahmed', 
      username: 'Touseeef', 
      email: 'alice.johnson@example.com', 
      phone: '+1 234 567 8900', 
      status: 'Verified', 
      orders: 12, 
      biddingWins: 22, 
      interests: [{ name: 'Cars', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop' }],
      profileImage: 'https://i.pravatar.cc/150?img=33'
    },
    { 
      id: 2, 
      name: 'John Doe', 
      username: 'johndoe', 
      email: 'john.doe@example.com', 
      phone: '+1 234 567 8901', 
      status: 'Verified', 
      orders: 8, 
      biddingWins: 15, 
      interests: [{ name: 'Electronics', image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=150&fit=crop' }],
      profileImage: 'https://i.pravatar.cc/150?img=12'
    },
    { 
      id: 3, 
      name: 'Jane Smith', 
      username: 'janesmith', 
      email: 'jane.smith@example.com', 
      phone: '+1 234 567 8902', 
      status: 'Pending', 
      orders: 5, 
      biddingWins: 8, 
      interests: [{ name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop' }],
      profileImage: 'https://i.pravatar.cc/150?img=47'
    },
    { 
      id: 4, 
      name: 'Mike Johnson', 
      username: 'mikejohnson', 
      email: 'mike.j@example.com', 
      phone: '+1 234 567 8903', 
      status: 'Verified', 
      orders: 20, 
      biddingWins: 35, 
      interests: [{ name: 'Sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=150&fit=crop' }],
      profileImage: 'https://i.pravatar.cc/150?img=45'
    },
  ]

  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return user.name.toLowerCase().includes(query) || 
           user.email.toLowerCase().includes(query) ||
           user.username.toLowerCase().includes(query)
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

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
            <div className="mb-6">
              <p className="text-sm text-gray-500">{t('dashboard')} &gt; {t('users')}</p>
            </div>

            {/* Header with Assign Role Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('users')}</h1>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/sub-admin/users/add')}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span>{t('addNew')}</span>
                </button>
                <button
                  onClick={() => setShowAssignRoleModal(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <UserPlus size={18} />
                  <span>{t('assignRole')}</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={t('searchByNameEmail')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Users Cards - Matching Image Style */}
            <div className="space-y-4 sm:space-y-6">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Top Section - Profile and Interests */}
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                      {/* Left Side - Profile Info */}
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0">
                          <img 
                            src={user.profileImage} 
                            alt={user.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-orange-500"
                          />
                        </div>
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{user.name}</h2>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">@{user.username}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{user.email}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{user.phone}</p>
                        </div>
                      </div>
                      
                      {/* Right Side - Interests */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:ml-8 lg:gap-6 lg:flex-shrink-0">
                        {/* Left - Text Content */}
                        <div className="flex flex-col">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{t('interests')}</h3>
                          {user.interests.map((interest, idx) => (
                            <span key={idx} className="text-sm sm:text-base lg:text-lg text-gray-900 font-normal">
                              {interest.name}
                            </span>
                          ))}
                        </div>
                        {/* Right - Visual Content */}
                        <div className="flex-shrink-0">
                          {user.interests.map((interest, idx) => (
                            interest.image && (
                              <img 
                                key={idx}
                                src={interest.image} 
                                alt={interest.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg object-cover"
                              />
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Statistics Table */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                      {/* Orders Made */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('ordersMade')}</div>
                        <div className="text-lg font-semibold text-gray-900">{user.orders}</div>
                      </div>
                      
                      {/* Account Status */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('accountStatus')}</div>
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Verified' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status === 'Verified' ? t('verified') : t('pendingStatus')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Number of bidding wins */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('numberOfBiddingWins')}</div>
                        <div className="text-lg font-semibold text-gray-900">{user.biddingWins}</div>
                      </div>
                      
                      {/* Action */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('action')}</div>
                        <button
                          onClick={() => navigate(`/sub-admin/users/${user.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="View user details"
                          title="View user details"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  {t('showingResults').replace('{start}', String(startIndex + 1)).replace('{end}', String(Math.min(startIndex + itemsPerPage, filteredUsers.length))).replace('{total}', String(filteredUsers.length))}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    {t('previous')}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    {t('nextPage')}
                  </button>
                </div>
              </div>
            )}
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
            <div className="mb-4">
              <p className="text-xs text-gray-500">{t('dashboard')} &gt; {t('users')}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl font-bold text-gray-900">{t('users')}</h1>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate('/sub-admin/users/add')}
                  className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-50"
                >
                  <Plus size={16} />
                  <span>{t('addNew')}</span>
                </button>
                <button
                  onClick={() => setShowAssignRoleModal(true)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm flex items-center justify-center gap-1"
                >
                  <UserPlus size={16} />
                  <span>{t('assignRole')}</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder={t('searchByNameEmail')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-4">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Top Section - Profile and Interests */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Profile Section */}
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <img 
                          src={user.profileImage} 
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-orange-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{user.name}</h2>
                          <p className="text-xs text-gray-600 mb-1 truncate">@{user.username}</p>
                          <p className="text-xs text-gray-600 mb-1 truncate">{user.email}</p>
                          <p className="text-xs text-gray-600 truncate">{user.phone}</p>
                        </div>
                      </div>
                      {/* Interests Section */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0">
                        {/* Text Content */}
                        <div className="flex flex-col">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{t('interests')}</h3>
                          {user.interests.map((interest, idx) => (
                            <span key={idx} className="text-sm text-gray-900 font-normal">
                              {interest.name}
                            </span>
                          ))}
                        </div>
                        {/* Visual Content */}
                        {user.interests.map((interest, idx) => (
                          interest.image && (
                            <img 
                              key={idx}
                              src={interest.image} 
                              alt={interest.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                            />
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Section - Statistics */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('ordersMade')}</div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900">{user.orders}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('accountStatus')}</div>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Verified' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status === 'Verified' ? t('verified') : t('pendingStatus')}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('numberOfBiddingWins')}</div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900">{user.biddingWins}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">{t('action')}</div>
                        <button
                          onClick={() => navigate(`/sub-admin/users/${user.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="View user details"
                          title="View user details"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Mobile */}
            {totalPages > 1 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  {t('showingResults').replace('{start}', String(startIndex + 1)).replace('{end}', String(Math.min(startIndex + itemsPerPage, filteredUsers.length))).replace('{total}', String(filteredUsers.length))}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    {t('previous')}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-lg text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    {t('nextPage')}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Assign Role Modal */}
      <Modal
        isOpen={showAssignRoleModal}
        onClose={() => {
          setShowAssignRoleModal(false)
          setSelectedUsers([])
          setSelectedRole(null)
        }}
        title={t('assignRoleToUsers')}
        size="full"
      >
        <div className="px-6">
          <p className="text-sm text-gray-600 mb-4">
            {t('selectUsersAndAssignRole')}
          </p>
          
          {/* User Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('selectUsers')}</h3>
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {users.map((user) => {
                const isSelected = selectedUsers.includes(user.id)
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      isSelected ? 'bg-orange-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('selectRole')}</h3>
            <div className="flex flex-col gap-4">
              {roleOptions.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all w-full ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${role.color}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{t(role.titleKey)}</h3>
                          <p className="text-xs text-gray-600">{t(role.descriptionKey)}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 -mx-6 px-6 pb-6">
            <button
              onClick={() => {
                setShowAssignRoleModal(false)
                setSelectedUsers([])
                setSelectedRole(null)
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleAssignRole}
              disabled={!selectedRole || selectedUsers.length === 0}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('assign')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('success')}
        size="sm"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('roleAssignedSuccessfully')}</h3>
          <p className="text-sm text-gray-600 mb-6">
            {t('roleAssignedToUsersCount').replace('{count}', String(assignedUsersCount))}
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </Modal>
    </div>
  )
}

