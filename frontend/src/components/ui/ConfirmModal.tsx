import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: 'orange' | 'red' | 'blue'
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'orange'
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const buttonConfig = {
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      hover: 'hover:from-orange-600 hover:to-orange-700',
      shadow: 'shadow-orange-500/25 hover:shadow-orange-500/30',
      ring: 'focus:ring-orange-500'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      hover: 'hover:from-red-600 hover:to-red-700',
      shadow: 'shadow-red-500/25 hover:shadow-red-500/30',
      ring: 'focus:ring-red-500'
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700',
      shadow: 'shadow-blue-500/25 hover:shadow-blue-500/30',
      ring: 'focus:ring-blue-500'
    }
  }

  const config = buttonConfig[confirmButtonColor]

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 border border-gray-200/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-gray-400 hover:text-gray-600 z-10 group"
          aria-label="Close modal"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon with Animation */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-full flex items-center justify-center shadow-lg shadow-yellow-100/50">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-inner">
                    <AlertTriangle className="text-white" size={40} strokeWidth={3} />
                  </div>
                </div>
              </div>
              {/* Subtle pulse animation */}
              <div className="absolute inset-0 rounded-full border-4 border-yellow-200/30 animate-pulse" style={{ animationDuration: '2s' }}></div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              {title || 'Confirm Action'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-200 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3.5 bg-gradient-to-r ${config.gradient} ${config.hover} text-white rounded-xl active:scale-[0.98] transition-all duration-200 font-semibold text-base shadow-lg ${config.shadow} focus:outline-none focus:ring-2 ${config.ring} focus:ring-offset-2`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

