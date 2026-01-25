import { useEffect, useState } from 'react'

export interface Toast {
  id: number
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
  duration?: number
}

interface ToastNotificationProps {
  toast: Toast
  onRemove: (id: number) => void
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: number) => void
  position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left' | 'top-center'
  zIndex?: number
}

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    case 'info':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    default:
      return null
  }
}

const getToastStyles = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-white border-l-4 border-green-500 shadow-lg',
        icon: 'text-green-500 bg-green-100',
        text: 'text-gray-800',
        progress: 'bg-green-500'
      }
    case 'error':
      return {
        container: 'bg-white border-l-4 border-red-500 shadow-lg',
        icon: 'text-red-500 bg-red-100',
        text: 'text-gray-800',
        progress: 'bg-red-500'
      }
    case 'warning':
      return {
        container: 'bg-white border-l-4 border-yellow-500 shadow-lg',
        icon: 'text-yellow-600 bg-yellow-100',
        text: 'text-gray-800',
        progress: 'bg-yellow-500'
      }
    case 'info':
      return {
        container: 'bg-white border-l-4 border-blue-500 shadow-lg',
        icon: 'text-blue-500 bg-blue-100',
        text: 'text-gray-800',
        progress: 'bg-blue-500'
      }
    default:
      return {
        container: 'bg-white border-l-4 border-gray-500 shadow-lg',
        icon: 'text-gray-500 bg-gray-100',
        text: 'text-gray-800',
        progress: 'bg-gray-500'
      }
  }
}

export function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const duration = toast.duration || 5000
  const styles = getToastStyles(toast.type)

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 50)
    
    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    // Auto remove timer
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(toast.id), 300) // Wait for exit animation
    }, duration)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(removeTimer)
      clearInterval(progressTimer)
    }
  }, [toast.id, onRemove, duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-all duration-300 ease-out transform ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      } ${styles.container}`}
      style={{ minWidth: '320px', maxWidth: '480px' }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${styles.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 p-4 pt-5">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.icon}`}>
          {getToastIcon(toast.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-relaxed ${styles.text}`}>
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ToastContainer({ 
  toasts, 
  onRemove, 
  position = 'top-right',
  zIndex = 50 
}: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }

  return (
    <div 
      className={`fixed ${getPositionClasses()} space-y-3 pointer-events-none`}
      style={{ zIndex }}
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastNotification toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

// Hook pentru management ușor al toast-urilor
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: 'error' | 'success' | 'info' | 'warning' = 'info', duration?: number) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const clearAllToasts = () => {
    setToasts([])
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  }
}
