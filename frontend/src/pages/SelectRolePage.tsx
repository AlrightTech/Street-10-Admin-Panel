import { useRole } from '@/contexts/RoleContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Store } from 'lucide-react'

type RoleOption = {
  value: 'vendor' | 'sub-admin' | 'super-admin'
  labelKey: string
  descriptionKey: string
  icon: any
  color: string
}

export default function SelectRolePage() {
  const { role, setRole } = useRole()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const roleOptions: RoleOption[] = [
    { 
      value: 'super-admin', 
      labelKey: 'superAdminLabel', 
      descriptionKey: 'fullSystemAccess',
      icon: Shield,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    { 
      value: 'sub-admin', 
      labelKey: 'subAdminLabel', 
      descriptionKey: 'limitedAccess',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      value: 'vendor', 
      labelKey: 'vendorDashboardLabel', 
      descriptionKey: 'manageProductsOrders',
      icon: Store,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
  ]

  const handleRoleSelect = (selectedRole: 'vendor' | 'sub-admin' | 'super-admin') => {
    setRole(selectedRole)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('welcomeToMazad')}</h1>
          <p className="text-lg text-gray-600">
            {role ? t('changeRoleOrContinue') : t('selectRoleToContinue')}
          </p>
          {role && (
            <p className="text-sm text-blue-600 mt-2">
              {t('currentRole')}: <span className="font-semibold capitalize">{role.replace('-', ' ')}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleOptions.map((option) => {
            const Icon = option.icon
            return (
              <div
                key={option.value}
                onClick={() => handleRoleSelect(option.value)}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 ${
                  role === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <div className={`w-16 h-16 ${option.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  {t(option.labelKey)}
                  {role === option.value && (
                    <span className="ml-2 text-sm text-blue-600">{t('current')}</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {t(option.descriptionKey)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-500">
            {t('yourSelectionSaved')}
          </p>
          {role && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('continueToDashboard')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

