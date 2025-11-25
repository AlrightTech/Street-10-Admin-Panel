import { Check, X } from 'lucide-react'
import { useEffect } from 'react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
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
            {/* Success Icon with Animation */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-pulse-slow">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-inner">
                    <Check className="text-white" size={40} strokeWidth={3} />
                  </div>
                </div>
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-green-200/30 animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              {title || 'Success!'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            
            {/* OK Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] transition-all duration-200 font-semibold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

