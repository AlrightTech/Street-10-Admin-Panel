
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${size === 'full' ? 'p-0' : 'p-4 sm:p-6'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white ${size === 'full' ? 'rounded-none' : 'rounded-xl'} shadow-2xl w-full ${sizeClasses[size]} ${size === 'full' ? 'h-screen' : 'max-h-[90vh]'} overflow-hidden flex flex-col transform transition-all duration-300`}
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between ${size === 'full' ? 'px-6' : 'px-4 sm:px-6'} py-4 border-b border-gray-200 bg-gray-50`}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${size === 'full' ? 'p-0' : title ? 'p-4 sm:p-6' : 'p-4 sm:p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

