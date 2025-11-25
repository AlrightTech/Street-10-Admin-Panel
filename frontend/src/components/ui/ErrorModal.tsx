import { X, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
}

export default function ErrorModal({ isOpen, onClose, title, message }: ErrorModalProps) {
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
            {/* Error Icon with Animation */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-rose-50 rounded-full flex items-center justify-center shadow-lg shadow-red-100/50">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-inner animate-pulse-slow">
                    <AlertCircle className="text-white" size={40} strokeWidth={3} />
                  </div>
                </div>
              </div>
              {/* Subtle shake animation on mount */}
              <div className="absolute inset-0 rounded-full border-4 border-red-200/30"></div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              {title || 'Error'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
            
            {/* OK Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all duration-200 font-semibold text-base shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

