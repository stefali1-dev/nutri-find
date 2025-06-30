import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { useNutritionist } from '@/lib/hooks/useNutritionist'
import { NutritionistService } from '@/lib/services/nutritionistService'
import type { User } from '@supabase/supabase-js'
import type { NutritionistData } from '@/lib/types/nutritionist'
import Footer from '@/components/Footer'
import LocationSearch from '@/components/LocationSearch'
import { consultationTypes, specializations } from '@/lib/utils'

export default function EditNutritionistProfile() {
  const router = useRouter()
  const { id } = router.query
  const {
    nutritionist,
    loading: hookLoading,
    error: hookError,
    loadNutritionistByUserId,
    updateNutritionist,
    setError: setHookError
  } = useNutritionist()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'services' | 'availability' | 'documents'>('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [errorFields, setErrorFields] = useState<Record<string, string>>({})
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'error' | 'success' }[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [nutritionistData, setNutritionistData] = useState<NutritionistData>({
    email: '',
    full_name: '',
    phone: '',
    birth_date: '',
    gender: '',
    years_experience: '',
    work_types: [],
    specializations: [],
    education: [],
    certifications: [],
    consultation_types: [],
    services: [],
    work_days: [],
    work_hours: { start: '09:00', end: '17:00' },
    consultation_duration: 60,
    bio: '',
    profile_photo_url: '',
    languages: ['Română'],
    location: '',
    documents_uploaded: { cdr_certificate: false, course_certificate: false, practice_notice: false },
    verification_status: 'pending'
  })

  // Toast management
  const addToast = useCallback((message: string, type: 'error' | 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Field to tab mapping for error navigation
  const fieldToTabMap: Record<string, 'personal' | 'professional' | 'services' | 'availability' | 'documents'> = {
    full_name: 'personal',
    email: 'personal',
    phone: 'personal',
    birth_date: 'personal',
    gender: 'personal',
    location: 'personal',
    bio: 'personal',
    license_number: 'professional',
    years_experience: 'professional',
    specializations: 'professional',
    education: 'professional',
    consultation_types: 'services',
    services: 'services',
    work_days: 'availability',
    work_hours: 'availability',
    consultation_duration: 'availability',
    documents_uploaded: 'documents'
  }

  // Mobile tab navigation
  const tabs = [
    { id: 'personal', label: 'Date personale', icon: '👤' },
    { id: 'professional', label: 'Date profesionale', icon: '🎓' },
    { id: 'services', label: 'Servicii și prețuri', icon: '💼' },
    { id: 'documents', label: 'Documente', icon: '📄' }
  ]

  // Update local state when hook loads data
  useEffect(() => {
    if (nutritionist) {
      setNutritionistData(nutritionist)
    }
  }, [nutritionist])

  // Handle hook errors as toasts
  useEffect(() => {
    if (hookError) {
      addToast(hookError, 'error')
      setHookError(null)
    }
  }, [hookError, addToast, setHookError])

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      if (!router.isReady) return

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/nutritionisti/login')
        return
      }

      setUser(user)

      if (id && id !== 'new') {
        const { data: nutritionist, error } = await NutritionistService.getNutritionistById(id as string)

        if (error || !nutritionist || nutritionist.user_id !== user.id) {
          router.push('/')
          return
        }

        setNutritionistData(nutritionist)
      } else {
        setNutritionistData(prev => ({
          ...prev,
          email: user.email!,
          user_id: user.id
        }))
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [id, router.isReady])

  const updateData = (field: keyof NutritionistData, value: any) => {
    setNutritionistData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)

    if (errorFields[field]) {
      setErrorFields(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addEducation = () => {
    updateData('education', [
      ...nutritionistData.education,
      { degree: '', university: '', graduation_year: '' }
    ])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...nutritionistData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    updateData('education', newEducation)
  }

  const removeEducation = (index: number) => {
    updateData('education', nutritionistData.education.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    updateData('certifications', [
      ...nutritionistData.certifications,
      { name: '', issuer: '', year: '' }
    ])
  }

  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = [...nutritionistData.certifications]
    newCertifications[index] = { ...newCertifications[index], [field]: value }
    updateData('certifications', newCertifications)
  }

  const removeCertification = (index: number) => {
    updateData('certifications', nutritionistData.certifications.filter((_, i) => i !== index))
  }

  const addService = () => {
    updateData('services', [
      ...nutritionistData.services,
      { name: '', duration: '60', price: '', description: '' }
    ])
  }

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...nutritionistData.services]
    newServices[index] = { ...newServices[index], [field]: value }
    updateData('services', newServices)
  }

  const removeService = (index: number) => {
    updateData('services', nutritionistData.services.filter((_, i) => i !== index))
  }

  const validateData = () => {
    const errors: Record<string, string> = {}
    const requiredFields = {
      full_name: 'Numele complet',
      email: 'Email',
      phone: 'Telefon',
      birth_date: 'Data nașterii',
      gender: 'Gen',
      years_experience: 'Ani de experiență',
      location: 'Locația',
      bio: 'Descrierea profilului'
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!nutritionistData[field as keyof NutritionistData]) {
        errors[field] = `${label} este obligatoriu.`
      }
    }

    if (nutritionistData.specializations.length === 0) {
      errors['specializations'] = 'Selectează cel puțin o specializare.'
    }

    if (nutritionistData.education.length === 0) {
      errors['education'] = 'Adaugă cel puțin o educație.'
    }

    if (nutritionistData.consultation_types.length === 0) {
      errors['consultation_types'] = 'Selectează cel puțin un tip de consultație.'
    }

    if (nutritionistData.services.length === 0) {
      errors['services'] = 'Adaugă cel puțin un serviciu.'
    }

    if (!nutritionistData.professional_type) {
      errors['professional_type'] = 'Selectează tipul de calificare profesională.'
    }

    if (nutritionistData.professional_type === 'dietician') {
      if (!nutritionistData.documents_uploaded.cdr_certificate) {
        errors['documents_uploaded'] = 'Certificatul CDR este obligatoriu.'
      }
    } else if (nutritionistData.professional_type === 'technician') {
      if (!nutritionistData.documents_uploaded.course_certificate ||
        !nutritionistData.documents_uploaded.practice_notice) {
        errors['documents_uploaded'] = 'Ambele documente sunt obligatorii pentru tehnicieni.'
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }

  const handleSave = async () => {
    const validation = validateData()
    if (!validation.valid) {
      setErrorFields(validation.errors)

      const firstErrorField = Object.keys(validation.errors)[0]
      if (firstErrorField && fieldToTabMap[firstErrorField]) {
        setActiveTab(fieldToTabMap[firstErrorField])
      }

      const firstErrorMessage = validation.errors[firstErrorField]
      if (firstErrorMessage) {
        addToast(firstErrorMessage, 'error')
      }

      return
    }

    setIsLoading(true)

    try {
      if (id === 'new') {
        const { data, error } = await NutritionistService.createNutritionist({
          ...nutritionistData,
          user_id: user?.id!
        })

        if (error) throw error

        router.push(`/nutritionisti/${data!.id}/edit`)
        addToast('Profilul a fost creat cu succes!', 'success')
      } else {
        const { data, error } = await NutritionistService.updateNutritionist({
          ...nutritionistData,
          id: nutritionistData.id!
        })

        if (error) throw error

        if (data) {
          setNutritionistData(data)
        }

        addToast('Profilul a fost salvat cu succes!', 'success')
      }

      setHasUnsavedChanges(false)
      setErrorFields({})
    } catch (error: any) {
      console.error('Error saving nutritionist data:', error)
      addToast(error.message || 'A apărut o eroare la salvare.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (field: 'cdr_certificate' | 'course_certificate' | 'practice_notice', file: File | null) => {
    if (!file) {
      updateData('documents_uploaded', {
        ...nutritionistData.documents_uploaded,
        [field]: false
      })
      return
    }

    if (!user?.id || !nutritionistData.id) {
      addToast('Profilul trebuie salvat înainte de a încărca documente.', 'error')
      return
    }

    try {
      const { success, error } = await NutritionistService.uploadDocument(
        user.id,
        nutritionistData.id,
        field,
        file
      )

      if (!success) {
        throw error
      }

      updateData('documents_uploaded', {
        ...nutritionistData.documents_uploaded,
        [field]: true
      })

      addToast('Document încărcat cu succes!', 'success')

    } catch (error: any) {
      console.error('Error uploading file:', error)
      addToast(`Eroare la încărcarea fișierului: ${error.message}`, 'error')
    }
  }

  const handleProfilePhotoUpload = async (file: File) => {
    if (!user) return
    setPhotoUploading(true)
    const { url, error } = await NutritionistService.uploadProfilePhoto(
      user.id,
      file
    )
    if (error || !url) {
      addToast('Eroare la încărcarea fotografiei.', 'error')
    } else {
      await NutritionistService.updateNutritionist({
        id: nutritionistData.id!,
        profile_photo_url: url
      })
      setNutritionistData(prev => ({ ...prev, profile_photo_url: url }))
      addToast('Fotografia a fost actualizată!', 'success')
    }
    setPhotoUploading(false)
  }

  const addLanguage = (language: string) => {
    if (language.trim() && !nutritionistData.languages.includes(language.trim())) {
      updateData('languages', [...nutritionistData.languages, language.trim()])
    }
  }

  const documentsValid = nutritionistData.professional_type && (
    nutritionistData.professional_type === 'dietician'
      ? nutritionistData.documents_uploaded.cdr_certificate
      : (nutritionistData.documents_uploaded.course_certificate &&
        nutritionistData.documents_uploaded.practice_notice)
  );

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Se încarcă profilul...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{id === 'new' ? 'Profil nou' : 'Editare profil'} - {nutritionistData.full_name || 'Nutriționist'} | NutriFind</title>
        <meta name="description" content="Editează profilul tău de nutriționist" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        @media (max-width: 640px) {
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          input[type="password"],
          input[type="date"],
          input[type="time"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Toast Notifications */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 space-y-2 sm:bottom-4 sm:right-4 sm:left-auto sm:p-0 sm:max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`w-full p-4 rounded-lg shadow-lg text-white transition-all duration-300 transform ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex-1 pr-2">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 ml-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-12">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/">
                  <span className="text-xl sm:text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                </Link>
                <span className="text-gray-400 hidden sm:inline">/</span>
                <span className="text-gray-600 text-sm sm:text-base hidden sm:inline">
                  {id === 'new' ? 'Profil nou' : 'Editare profil'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {hasUnsavedChanges && (
                  <span className="text-orange-600 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Modificări nesalvate</span>
                    <span className="sm:hidden">•</span>
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${isLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  {isLoading ? 'Se salvează...' : 'Salvează'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-center justify-center sm:justify-start">
              <div className="relative mx-auto sm:mx-0">
                {nutritionistData.profile_photo_url ? (
                  <img
                    src={nutritionistData.profile_photo_url}
                    alt="Avatar"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                    {nutritionistData.full_name
                      ? nutritionistData.full_name.split(' ').map(n => n[0]).join('')
                      : 'NN'}
                  </div>
                )}

                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 cursor-pointer shadow-lg">
                  {photoUploading ? (
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => e.target.files && handleProfilePhotoUpload(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {id === 'new' ? 'Creează profil nou' : nutritionistData.full_name || 'Editare profil'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {id === 'new'
                    ? 'Completează informațiile pentru a-ți crea profilul.'
                    : 'Menține-ți profilul actualizat pentru mai mulți clienți.'
                  }
                </p>

                {!documentsValid && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-sm">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-orange-800">Documente lipsă</h3>
                        <p className="text-orange-700 text-xs sm:text-sm">
                          {!nutritionistData.professional_type ? (
                            'Selectează tipul tău de calificare și încarcă documentele necesare pentru activare.'
                          ) : nutritionistData.professional_type === 'dietician' ? (
                            'Încarcă certificatul de membru activ CDR pentru activare.'
                          ) : (
                            'Încarcă certificatul de curs și avizul de liberă practică pentru activare.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mx-auto sm:mx-0">
                    <div
                      className={`w-2 h-2 rounded-full ${nutritionistData.verification_status === 'verified'
                        ? 'bg-green-500'
                        : 'bg-orange-500'
                        }`}
                    ></div>
                    <span>
                      Status profil:{' '}
                      {nutritionistData.verification_status === 'verified'
                        ? 'Activ'
                        : 'În așteptare verificare'}
                    </span>
                  </div>
                  {nutritionistData.average_rating !== undefined &&
                    nutritionistData.average_rating !== null &&
                    nutritionistData.average_rating !== 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>
                          {nutritionistData.average_rating}
                          {nutritionistData.total_consultations !== undefined &&
                            nutritionistData.total_consultations !== 0
                            ? ` (${nutritionistData.total_consultations} consultații)`
                            : ''}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="sm:hidden bg-white border-b sticky top-16 z-30">
          <div className="px-4 py-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.icon} {tab.label}
                  {tab.id === 'documents' && !documentsValid ? ' ⚠️' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Tabs Navigation */}
        <div className="hidden sm:block bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'documents' && !documentsValid && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">

            {/* Personal Data Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Date personale și de contact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nume complet *
                    </label>
                    <input
                      type="text"
                      value={nutritionistData.full_name}
                      onChange={(e) => updateData('full_name', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.full_name ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                      placeholder="ex: Dr. Maria Popescu"
                    />
                    {errorFields.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={nutritionistData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.email ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                      placeholder="email@exemplu.com"
                    />
                    {errorFields.email && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      value={nutritionistData.phone}
                      onChange={(e) => updateData('phone', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.phone ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                      placeholder="07XX XXX XXX"
                    />
                    {errorFields.phone && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data nașterii *
                    </label>
                    <input
                      type="date"
                      value={nutritionistData.birth_date}
                      onChange={(e) => updateData('birth_date', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.birth_date ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                    />
                    {errorFields.birth_date && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.birth_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gen *</label>
                    <select
                      value={nutritionistData.gender}
                      onChange={(e) => updateData('gender', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.gender ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                    >
                      <option value="">Selectează...</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                      <option value="Altul">Altul</option>
                    </select>
                    {errorFields.gender && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Locație *
                    </label>
                    <LocationSearch
                      value={nutritionistData.location}
                      onChange={(value) => updateData('location', value)}
                      error={!!errorFields.location}
                      placeholder="Caută localitatea..."
                    />
                    {errorFields.location && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.location}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limbi vorbite *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {nutritionistData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {lang}
                        <button
                          onClick={() =>
                            updateData(
                              'languages',
                              nutritionistData.languages.filter((_, i) => i !== index)
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Adaugă limbă"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addLanguage(e.currentTarget.value.trim())
                          e.currentTarget.value = ''
                        }
                      }}
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input.value.trim()) {
                          addLanguage(input.value.trim())
                          input.value = ''
                        }
                      }}
                      className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <span className="hidden sm:inline">Adaugă</span>
                      <span className="sm:hidden">+</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere profil (Bio) *
                  </label>
                  <textarea
                    value={nutritionistData.bio}
                    onChange={(e) => updateData('bio', e.target.value)}
                    rows={6}
                    className={`w-full p-3 border-2 ${errorFields.bio ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                    placeholder="Scrie o descriere detaliată despre tine, experiența ta și abordarea ta în nutriție..."
                  />
                  {errorFields.bio && (
                    <p className="text-red-500 text-sm mt-1">{errorFields.bio}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {nutritionistData.bio.length}/1000 caractere
                  </p>
                </div>
              </div>
            )}

            {/* Professional Data Tab */}
            {activeTab === 'professional' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  Date profesionale
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numărul de licență CDR *
                    </label>
                    <input
                      type="text"
                      value={nutritionistData.c}
                      onChange={(e) => updateData('license_number', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.license_number ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                      placeholder="ex: CDR12345"
                    />
                    {errorFields.license_number && (
                      <p className="text-red-500 text-sm mt-1">{errorFields.license_number}</p>
                    )}
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ani de experiență *
                    </label>
                    <select
                      value={nutritionistData.years_experience}
                      onChange={(e) => updateData('years_experience', e.target.value)}
                      className={`w-full p-3 border-2 ${errorFields.years_experience ? 'border-red-500' : 'border-gray-200'
                        } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
                    >
                      <option value="">Selectează...</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} {i === 0 ? 'an' : 'ani'}
                        </option>
                      ))}
                      <option value="20+">20+ ani</option>
                    </select>
                    {errorFields.years_experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorFields.years_experience}
                      </p>
                    )}
                  </div>
                </div>

                {/* Specializări Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Specializări *
                  </label>
                  {errorFields.specializations && (
                    <p className="text-red-500 text-sm mb-2">{errorFields.specializations}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {specializations.map((spec) => (
                      <label
                        key={spec.value}
                        className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={nutritionistData.specializations.includes(spec.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('specializations', [
                                ...nutritionistData.specializations,
                                spec.value
                              ])
                            } else {
                              updateData(
                                'specializations',
                                nutritionistData.specializations.filter((s) => s !== spec.value)
                              )
                            }
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center flex-shrink-0 ${nutritionistData.specializations.includes(spec.value)
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300'
                            }`}
                        >
                          {nutritionistData.specializations.includes(spec.value) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{spec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Educație *</h3>
                    {errorFields.education && (
                      <p className="text-red-500 text-sm">{errorFields.education}</p>
                    )}
                  </div>
                  <button
                    onClick={addEducation}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Adaugă educație
                  </button>
                  <div className="space-y-4">
                    {nutritionistData.education.map((edu, index) => (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Grad/Diploma"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.university}
                            onChange={(e) =>
                              updateEducation(index, 'university', e.target.value)
                            }
                            placeholder="Universitate"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.graduation_year}
                            onChange={(e) =>
                              updateEducation(index, 'graduation_year', e.target.value)
                            }
                            placeholder="Anul absolvirii"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Șterge
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Certificări suplimentare
                    </h3>
                  </div>
                  <button
                    onClick={addCertification}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Adaugă certificare
                  </button>
                  <div className="space-y-4">
                    {nutritionistData.certifications.map((cert, index) => (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) =>
                              updateCertification(index, 'name', e.target.value)
                            }
                            placeholder="Numele certificării"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) =>
                              updateCertification(index, 'issuer', e.target.value)
                            }
                            placeholder="Emitent"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) =>
                              updateCertification(index, 'year', e.target.value)
                            }
                            placeholder="Anul obținerii"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Șterge
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Schedule Section */}
                {/* <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Program de lucru
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Zilele în care lucrezi *
                      </label>
                      {errorFields.work_days && (
                        <p className="text-red-500 text-sm mb-2">{errorFields.work_days}</p>
                      )}
                      <div className="space-y-2">
                        {['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'].map(
                          (day) => (
                            <label
                              key={day}
                              className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={nutritionistData.work_days.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateData('work_days', [...nutritionistData.work_days, day])
                                  } else {
                                    updateData(
                                      'work_days',
                                      nutritionistData.work_days.filter((d) => d !== day)
                                    )
                                  }
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                                  nutritionistData.work_days.includes(day)
                                    ? 'bg-green-600 border-green-600'
                                    : 'border-gray-300'
                                }`}
                              >
                                {nutritionistData.work_days.includes(day) && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium">{day}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Intervalul orar *
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Ora de început
                          </label>
                          <input
                            type="time"
                            value={nutritionistData.work_hours.start}
                            onChange={(e) =>
                              updateData('work_hours', {
                                ...nutritionistData.work_hours,
                                start: e.target.value
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Ora de sfârșit
                          </label>
                          <input
                            type="time"
                            value={nutritionistData.work_hours.end}
                            onChange={(e) =>
                              updateData('work_hours', {
                                ...nutritionistData.work_hours,
                                end: e.target.value
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Sfat</h4>
                        <p className="text-blue-700 text-sm">
                          Nutriționiștii cu disponibilitate flexibilă primesc cu 40% mai multe
                          programări.
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  Servicii și prețuri
                </h2>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipuri de consultații oferite *
                  </label>
                  {errorFields.specializations && (
                    <p className="text-red-500 text-sm mb-2">{errorFields.specializations}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consultationTypes.map((type) => (
                      <label
                        key={type.value}
                        className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={nutritionistData.consultation_types.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('consultation_types', [
                                ...nutritionistData.consultation_types,
                                type.value
                              ])
                            } else {
                              updateData(
                                'consultation_types',
                                nutritionistData.consultation_types.filter((t) => t !== type.value)
                              )
                            }
                          }}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center flex-shrink-0 ${nutritionistData.consultation_types.includes(type.value)
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300'
                            }`}
                        >
                          {nutritionistData.consultation_types.includes(type.value) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span className="text-lg mr-2">{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Serviciile tale *</h3>
                    {errorFields.services && (
                      <p className="text-red-500 text-sm">{errorFields.services}</p>
                    )}
                  </div>
                  <button
                    onClick={addService}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-6"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Adaugă serviciu
                  </button>

                  <div className="space-y-6">
                    {nutritionistData.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-4 sm:p-6 border-2 border-gray-200 rounded-xl bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numele serviciului *
                            </label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateService(index, 'name', e.target.value)}
                              placeholder="ex: Consultație inițială"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Durata (minute) *
                            </label>
                            <select
                              value={service.duration}
                              onChange={(e) => updateService(index, 'duration', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                            >
                              <option value="30">30 minute</option>
                              <option value="45">45 minute</option>
                              <option value="60">60 minute</option>
                              <option value="90">90 minute</option>
                              <option value="120">120 minute</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preț (RON) *
                            </label>
                            <input
                              type="number"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', e.target.value)}
                              placeholder="250"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrierea serviciului *
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              updateService(index, 'description', e.target.value)
                            }
                            rows={3}
                            placeholder="Descrie ce include acest serviciu..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Șterge serviciu
                        </button>
                      </div>
                    ))}
                  </div>

                  {nutritionistData.services.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p>Nu ai adăugat încă niciun serviciu</p>
                      <p className="text-sm">
                        Adaugă primul tău serviciu pentru a începe să primești clienți
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  Documente obligatorii
                </h2>

                {/* Professional Type Selection */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selectează tipul tău de calificare profesională
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    În România, doar aceste două categorii pot practica legal nutriția:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${nutritionistData.professional_type === 'dietician'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                      }`}>
                      <input
                        type="radio"
                        name="professional_type"
                        value="dietician"
                        checked={nutritionistData.professional_type === 'dietician'}
                        onChange={(e) => updateData('professional_type', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${nutritionistData.professional_type === 'dietician'
                          ? 'border-green-600 bg-green-600'
                          : 'border-gray-300'
                          }`}>
                          {nutritionistData.professional_type === 'dietician' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800">Dietetician licențiat</span>
                          <p className="text-sm text-gray-600 mt-1">
                            Absolvent de studii universitare în nutriție și dietetică, membru CDR
                          </p>
                          <div className="mt-2 flex items-center text-xs text-green-700">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Poate trata și persoane cu afecțiuni medicale
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${nutritionistData.professional_type === 'technician'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                      }`}>
                      <input
                        type="radio"
                        name="professional_type"
                        value="technician"
                        checked={nutritionistData.professional_type === 'technician'}
                        onChange={(e) => updateData('professional_type', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${nutritionistData.professional_type === 'technician'
                          ? 'border-green-600 bg-green-600'
                          : 'border-gray-300'
                          }`}>
                          {nutritionistData.professional_type === 'technician' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800">Tehnician Nutriționist (nivel 5+)</span>
                          <p className="text-sm text-gray-600 mt-1">
                            Absolvent de curs acreditat nivel 5+, cu aviz de liberă practică
                          </p>
                          <div className="mt-2 flex items-center text-xs text-orange-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>

                            Poate lucra doar cu persoane sănătoase
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {!nutritionistData.professional_type && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-red-600 font-medium">
                        Te rugăm să selectezi tipul tău de calificare pentru a continua
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents based on professional type */}
                {nutritionistData.professional_type && (
                  <>
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <h3 className="font-semibold text-orange-800 mb-2">
                        📋 Documente necesare pentru {nutritionistData.professional_type === 'dietician' ? 'Dietetician licențiat' : 'Tehnician Nutriționist'}
                      </h3>
                      <p className="text-orange-700 text-sm">
                        Pentru a-ți activa profilul și a putea primi clienți, trebuie să încarci documentele specifice calificării tale.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Dietician Documents */}
                      {nutritionistData.professional_type === 'dietician' && (
                        <div className="p-4 sm:p-6 border-2 border-gray-200 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Certificat de membru activ CDR *
                              </h3>
                              <p className="text-gray-600 text-sm mb-4">
                                Certificatul de membru activ al Colegiului Dieteticienilor din România (CDR) este obligatoriu pentru a practica legal ca dietetician.
                              </p>

                              {nutritionistData.documents_uploaded.cdr_certificate ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                      <p className="font-medium text-green-800">Certificat CDR încărcat</p>
                                      <p className="text-sm text-green-600">Document încărcat</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleFileUpload('cdr_certificate', null)}
                                    className="text-red-600 hover:text-red-700 p-2"
                                    title="Șterge document"
                                  >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="text-gray-600 mb-2">Încarcă certificatul CDR</p>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => e.target.files && handleFileUpload('cdr_certificate', e.target.files[0])}
                                    className="hidden"
                                    id="cdr-certificate-upload"
                                  />
                                  <label
                                    htmlFor="cdr-certificate-upload"
                                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                                  >
                                    Selectează fișier
                                  </label>
                                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB)</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Technician Documents */}
                      {nutritionistData.professional_type === 'technician' && (
                        <>
                          {/* Course Certificate */}
                          <div className="p-4 sm:p-6 border-2 border-gray-200 rounded-xl">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                              </div>
                              <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  Certificat de absolvire curs acreditat nivel 5+ *
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                  Certificatul de absolvire a unui curs de nutriție acreditat ANC/CNFPA nivel 5 sau superior.
                                </p>

                                {nutritionistData.documents_uploaded.course_certificate ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div>
                                        <p className="font-medium text-green-800">Certificat curs încărcat</p>
                                        <p className="text-sm text-green-600">Document încărcat</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleFileUpload('course_certificate', null)}
                                      className="text-red-600 hover:text-red-700 p-2"
                                      title="Șterge document"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Încarcă certificatul de curs</p>
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => e.target.files && handleFileUpload('course_certificate', e.target.files[0])}
                                      className="hidden"
                                      id="course-certificate-upload"
                                    />
                                    <label
                                      htmlFor="course-certificate-upload"
                                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                                    >
                                      Selectează fișier
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB)</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Practice Notice */}
                          <div className="p-4 sm:p-6 border-2 border-gray-200 rounded-xl">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  Aviz de liberă practică *
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                  Avizul de liberă practică emis de o asociație profesională recunoscută (ex: UPMCA).
                                </p>

                                {nutritionistData.documents_uploaded.practice_notice ? (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <div>
                                        <p className="font-medium text-green-800">Aviz de practică încărcat</p>
                                        <p className="text-sm text-green-600">Document încărcat</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleFileUpload('practice_notice', null)}
                                      className="text-red-600 hover:text-red-700 p-2"
                                      title="Șterge document"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-gray-600 mb-2">Încarcă avizul de practică</p>
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => e.target.files && handleFileUpload('practice_notice', e.target.files[0])}
                                      className="hidden"
                                      id="practice-notice-upload"
                                    />
                                    <label
                                      htmlFor="practice-notice-upload"
                                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                                    >
                                      Selectează fișier
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (max 5MB)</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">🔒 Securitatea documentelor</h4>
                      <p className="text-blue-700 text-sm">
                        Toate documentele sunt stocate în siguranță și vor fi verificate de echipa noastră în maximum 24 de ore.
                        După verificare, vei primi o confirmare prin email și profilul tău va fi activat.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Save Button */}
          <div className="mt-6 sm:hidden">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {isLoading ? 'Se salvează...' : id === 'new' ? 'Creează profil' : 'Salvează modificările'}
            </button>
          </div>
        </div>

        {/* Bottom Info Panel */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Profilul tău</h3>
              </div>
              <p className="text-sm text-gray-600">
                Un profil complet crește șansele de a primi mai multe programări cu până la 75%.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Securitate</h3>
              </div>
              <p className="text-sm text-gray-600">
                Toate datele tale sunt protejate și nu vor fi împărtășite fără acordul tău.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 010 19 9.5 9.5 0 010-19z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Suport</h3>
              </div>
              <p className="text-sm text-gray-600">
                Ai nevoie de ajutor? Echipa noastră este disponibilă să te sprijine.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}