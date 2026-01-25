import { useState } from 'react'
import { BookingService } from '@/lib/services/bookingService'
import type { CreateBookingRequestData } from '@/lib/types/booking'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface BookingData {
  nutritionistId: string
  fullName: string
  email: string
  phone: string
  message?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: BookingData) => void
  nutritionistId: string
  nutritionistName: string
}

export default function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  nutritionistId,
  nutritionistName,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    const errors: Record<string, string> = {}

    // Validate required fields
    if (!formData.fullName.trim()) {
      errors.fullName = 'Numele este obligatoriu'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email-ul este obligatoriu'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Telefonul este obligatoriu'
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Format email invalid'
    }

    // Validate phone format (basic Romanian phone validation)
    const phoneRegex = /^(\+4|4|0)(\d{8,9})$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Format telefon invalid'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      // Create booking request data
      const requestData: CreateBookingRequestData = {
        nutritionist_id: nutritionistId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || undefined,
      }

      // Simulate realistic request time (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Save to Supabase
      const { data, error } = await BookingService.createBookingRequest(requestData)

      if (error) {
        console.error('Error saving booking request:', error)
        setSubmitError('A apărut o eroare la salvarea cererii. Te rugăm să încerci din nou.')
        setIsSubmitting(false)
        return
      }

      if (!data) {
        setSubmitError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
        setIsSubmitting(false)
        return
      }

      // Show success state
      setIsSuccess(true)
      setIsSubmitting(false)
      
    } catch (error) {
      console.error('Unexpected error:', error)
      setSubmitError('A apărut o eroare de conexiune. Te rugăm să verifici conexiunea la internet și să încerci din nou.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (isSuccess) {
      // If we're closing from success state, send the booking data to parent
      const bookingData: BookingData = {
        nutritionistId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }
      onConfirm(bookingData)
    }
    
    // Reset all state when closing
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    })
    setFieldErrors({})
    setSubmitError(null)
    setIsSuccess(false)
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  // Success state
  if (isSuccess) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Cererea a fost trimisă!</h3>
              <p className="text-gray-600 mb-2">
                Mulțumim pentru cererea de programare cu <span className="font-semibold">{nutritionistName}</span>.
              </p>
              <p className="text-gray-600 mb-6">
                Vei fi contactat în cel mai scurt timp pentru confirmarea programării și stabilirea detaliilor consultației.
              </p>
              
              {/* Close Button */}
              <Button
                onClick={handleClose}
                size="lg"
                className="cursor-pointer w-full bg-green-600 hover:bg-green-700 rounded-full"
              >
                Închide
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Trimite cererea</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 mb-2">Programare cu:</p>
            <p className="font-semibold text-gray-800 mb-2">{nutritionistName}</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Nume complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={cn(
                  fieldErrors.fullName && 'border-red-500 focus-visible:ring-red-500'
                )}
                placeholder="ex: Maria Popescu"
                required
              />
              {fieldErrors.fullName && (
                <p className="text-sm text-red-500">{fieldErrors.fullName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={cn(
                  fieldErrors.email && 'border-red-500 focus-visible:ring-red-500'
                )}
                placeholder="email@exemplu.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={cn(
                  fieldErrors.phone && 'border-red-500 focus-visible:ring-red-500'
                )}
                placeholder="07XX XXX XXX"
                required
              />
              {fieldErrors.phone && (
                <p className="text-sm text-red-500">{fieldErrors.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">
                Mesaj (opțional)
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={3}
                placeholder="Spune-i nutriționistului despre ce ai vrea să discutați..."
              />
            </div>
          </form>

          {/* Submit Error Message */}
          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Eroare la salvarea cererii</p>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outline"
              size="lg"
              className="cursor-pointer flex-1 bg-white rounded-full min-w-0"
            >
              Anulează
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 rounded-full min-w-0"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Se salvează...
                </>
              ) : (
                'Trimite cererea'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
