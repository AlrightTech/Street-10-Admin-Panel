import { AlertTriangle, X, Trash2 } from 'lucide-react'
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
  const isDeleteAction = confirmButtonColor === 'red'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 border border-gray-200/50 animate-scaleIn overflow-hidden">
        {/* Decorative gradient top bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`}></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 text-gray-400 hover:text-gray-600 z-10 group"
          aria-label="Close modal"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>

        <div className="p-6 sm:p-8 pt-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon with Enhanced Animation - Different for delete vs other actions */}
            <div className="relative mb-6">
              {isDeleteAction ? (
                // Delete Icon (Red)
                <>
                  <div className="w-28 h-28 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-full flex items-center justify-center shadow-xl shadow-red-100/50">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 via-rose-100 to-pink-100 rounded-full flex items-center justify-center animate-pulse-slow">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                        <Trash2 className="text-white" size={44} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  {/* Animated rings for delete */}
                  <div className="absolute inset-0 rounded-full border-4 border-red-200/40 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border-2 border-rose-200/30 animate-pulse" style={{ animationDuration: '2s' }}></div>
                </>
              ) : (
                // Warning Icon (Yellow/Orange)
                <>
                  <div className="w-28 h-28 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-full flex items-center justify-center shadow-xl shadow-yellow-100/50">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse-slow">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <AlertTriangle className="text-white" size={44} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  {/* Animated rings for warning */}
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-200/40 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full border-2 border-amber-200/30 animate-pulse" style={{ animationDuration: '2s' }}></div>
                </>
              )}
            </div>
            
            {/* Title */}
            <h3 className={`text-2xl sm:text-3xl font-bold mb-4 tracking-tight ${
              isDeleteAction ? 'text-red-600' : 'text-gray-900'
            }`}>
              {title || 'Confirm Action'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto px-2">
              {message || 'Are you sure you want to proceed with this action?'}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 active:scale-[0.97] transition-all duration-200 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow-sm hover:shadow-md"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3.5 bg-gradient-to-r ${config.gradient} ${config.hover} text-white rounded-xl active:scale-[0.97] transition-all duration-200 font-semibold text-base shadow-lg ${config.shadow} hover:shadow-xl focus:outline-none focus:ring-2 ${config.ring} focus:ring-offset-2 transform hover:scale-[1.02] flex items-center justify-center gap-2`}
              >
                {isDeleteAction && <Trash2 size={18} />}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

