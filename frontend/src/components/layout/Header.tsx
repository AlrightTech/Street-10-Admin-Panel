'use client'

import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export default function Header({ onToggleSidebar, isSidebarOpen = false }: HeaderProps) {
  const { language, changeLanguage, t } = useLanguage()
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const languages = [
    { code: 'ar', name: 'Arabic', flag: '🇶🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]

  type Language = typeof languages[number]

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang.code)
    setShowLangDropdown(false)
  }

  return (
    <header className={`bg-gray-100 px-4 lg:px-6 py-3 fixed lg:static top-0 left-0 right-0 ${onToggleSidebar ? 'z-40' : 'z-50'}`}>
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left side - Mobile Toggle Button and Search Bar */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          )}
          
          {/* Search Bar - Responsive */}
          {searchExpanded || !onToggleSidebar ? (
            <div className={`w-80 ${onToggleSidebar ? 'ml-3 lg:ml-0' : ''}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="w-full pl-3 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
                <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSearchExpanded(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 flex-shrink-0"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language Selector - Hidden on very small screens */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{languages.find(l => l.code === language)?.flag || '🇶🇦'}</span>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{languages.find(l => l.code === language)?.name || 'Arabic'}</span>
              <ChevronDown size={16} className="hidden md:inline text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showLangDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-primary-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer">
            <button className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm" aria-label="Notifications">
              <Bell size={20} className="text-gray-600" />
            </button>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-white text-xs font-bold">34</span>
            </span>
          </div>

          {/* User Profile */}
          <div className="cursor-pointer">
            <img 
              src="https://ui-avatars.com/api/?name=abdulamin&size=40&background=random" 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
