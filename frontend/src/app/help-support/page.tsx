import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import { Menu, HelpCircle, Mail, Phone, MessageCircle, FileText, BookOpen, Video, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HelpSupportPage() {
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const supportOptions = [
    {
      icon: MessageCircle,
      title: language === 'ar' ? 'الدردشة المباشرة' : 'Live Chat',
      description: language === 'ar' ? 'تحدث مع فريق الدعم مباشرة' : 'Chat with our support team in real-time',
      action: () => navigate('/chat')
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'البريد الإلكتروني' : 'Email Support',
      description: language === 'ar' ? 'أرسل بريدًا إلكترونيًا إلى فريق الدعم' : 'Send an email to our support team',
      action: () => window.location.href = 'mailto:support@street10.com'
    },
    {
      icon: Phone,
      title: language === 'ar' ? 'دعم الهاتف' : 'Phone Support',
      description: language === 'ar' ? 'اتصل بنا على الرقم المجاني' : 'Call us on our toll-free number',
      action: () => window.location.href = 'tel:+1234567890'
    },
    {
      icon: FileText,
      title: language === 'ar' ? 'مقالات المساعدة' : 'Help Articles',
      description: language === 'ar' ? 'تصفح قاعدة المعرفة الخاصة بنا' : 'Browse our knowledge base',
      action: () => {}
    },
    {
      icon: BookOpen,
      title: language === 'ar' ? 'دليل المستخدم' : 'User Guide',
      description: language === 'ar' ? 'تعرف على كيفية استخدام النظام' : 'Learn how to use the system',
      action: () => {}
    },
    {
      icon: Video,
      title: language === 'ar' ? 'فيديوهات تعليمية' : 'Video Tutorials',
      description: language === 'ar' ? 'شاهد مقاطع فيديو تعليمية' : 'Watch instructional videos',
      action: () => {}
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {!sidebarCollapsed && (
          <div className="w-64 flex-shrink-0 bg-primary-500 h-screen overflow-y-auto">
            <Sidebar onClose={() => setSidebarCollapsed(true)} currentPage="help" />
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

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
            <Header />
          </div>
          
          <main className="flex-1 overflow-y-auto p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft size={16} />
                <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
              </button>
              <p className="text-xs text-gray-500">{t('dashboard')} - {language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}</p>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="text-blue-600" size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}
                </h1>
              </div>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'نحن هنا لمساعدتك. اختر طريقة الاتصال التي تناسبك.' 
                  : 'We\'re here to help. Choose the contact method that works best for you.'}
              </p>
            </div>

            {/* Support Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <button
                    key={index}
                    onClick={option.action}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-300 transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                        <Icon className="text-orange-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'ar' ? 'كيف يمكنني إعادة تعيين كلمة المرور؟' : 'How can I reset my password?'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'انتقل إلى الإعدادات > الملف الشخصي > تغيير كلمة المرور' 
                      : 'Go to Settings > Profile > Change Password'}
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'ar' ? 'كيف أضيف منتجًا جديدًا؟' : 'How do I add a new product?'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'انتقل إلى إدارة المنتجات > إضافة منتج جديد' 
                      : 'Go to Product Management > Add New Product'}
                  </p>
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === 'ar' ? 'كيف يمكنني تتبع الطلب؟' : 'How can I track an order?'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'انتقل إلى الطلبات وحدد الطلب الذي تريد تتبعه' 
                      : 'Go to Orders and select the order you want to track'}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-primary-500">
              <Sidebar onClose={() => setSidebarOpen(false)} currentPage="help" />
            </div>
          </div>
        )}
        
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <Header onToggleSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />
        </div>
        
        <main className="p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="text-blue-600" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'ar' 
                ? 'نحن هنا لمساعدتك' 
                : 'We\'re here to help'}
            </p>
          </div>

          <div className="space-y-4">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-orange-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-orange-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'كيف يمكنني إعادة تعيين كلمة المرور؟' : 'How can I reset my password?'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ar' 
                    ? 'انتقل إلى الإعدادات > الملف الشخصي' 
                    : 'Go to Settings > Profile'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

