'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params?.id
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  })
  const [isChanging, setIsChanging] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords({ ...passwords, [name]: value })
  }

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (passwords.newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    setIsChanging(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Password changed successfully!')
      router.push(`/settings/profile/vendors/${vendorId}`)
    } catch (error) {
      alert('Failed to change password')
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#fef3e2' }}>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="settings" />
          </div>
        )}
        
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-4 z-30 bg-primary-500 text-white p-2 rounded-r-lg"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50" style={{ backgroundColor: '#fef3e2' }}>
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => router.push(`/settings/profile/vendors/${vendorId}`)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft size={16} />
                <span>Back to Sub Vendor Detail</span>
              </button>
              <p className="text-sm text-gray-500">Dashboard - Reset Password</p>
            </div>

            {/* Password Reset Card */}
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Reset Password</h2>
                
                <div className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Change Password Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChanging}
                    className={`px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition цвета disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                      isChanging ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isChanging ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden" style={{ backgroundColor: '#fef3e2' }}>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="settings" />
            </div>
          </div>
        )}
        
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        
        <main className="p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Reset Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isChanging}
                className={`w-full px-4 py-3 bg-orange-500 text-white rounded-lg text-sm font-medium ${
                  isChanging ? 'opacity-50' : ''
                }`}
              >
                {isChanging ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

