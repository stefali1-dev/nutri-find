import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { useNutritionist } from '@/lib/hooks/useNutritionist'
import { NutritionistService } from '@/lib/services/nutritionistService'
import type { User } from '@supabase/supabase-js'
import type { NutritionistData } from '@/lib/types/nutritionist'

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
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const [nutritionistData, setNutritionistData] = useState<NutritionistData>({
    email: '',
    full_name: '',
    phone: '',
    birth_date: '',
    gender: '',
    license_number: '',
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
    documents_uploaded: { diploma: false, certificate: false },
    verification_status: 'pending'
  })

  // Actualizează state-ul local când hook-ul încarcă datele
  useEffect(() => {
    if (nutritionist) {
      setNutritionistData(nutritionist)
    }
  }, [nutritionist])

  // Actualizează eroarea dacă există eroare în hook
  useEffect(() => {
    if (hookError) {
      setError(hookError)
    }
  }, [hookError])

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for router to be ready
      if (!router.isReady) return

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/nutritionists/login')
        return
      }

      setUser(user)

      // Check if user is authorized to edit this profile
      if (id && id !== 'new') {
        const { data: nutritionist, error } = await NutritionistService.getNutritionistById(id as string)

        if (error || !nutritionist || nutritionist.user_id !== user.id) {
          router.push('/')
          return
        }

        // Load existing nutritionist data
        setNutritionistData(nutritionist)
      } else {
        // Set default data for new profile
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
  }, [id, router.isReady]) // Simplified dependencies

  // Remove the old loadNutritionistData function since we're using the hook now

  const updateData = (field: keyof NutritionistData, value: any) => {
    setNutritionistData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
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
    const requiredFields = {
      full_name: 'Numele complet',
      email: 'Email',
      phone: 'Telefon',
      birth_date: 'Data nașterii',
      gender: 'Gen',
      license_number: 'Numărul de licență',
      years_experience: 'Ani de experiență',
      location: 'Locația',
      bio: 'Descrierea profilului'
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!nutritionistData[field as keyof NutritionistData]) {
        setError(`${label} este obligatoriu.`)
        return false
      }
    }

    if (nutritionistData.specializations.length === 0) {
      setError('Selectează cel puțin o specializare.')
      return false
    }

    if (nutritionistData.education.length === 0) {
      setError('Adaugă cel puțin o educație.')
      return false
    }

    if (nutritionistData.consultation_types.length === 0) {
      setError('Selectează cel puțin un tip de consultație.')
      return false
    }

    if (nutritionistData.services.length === 0) {
      setError('Adaugă cel puțin un serviciu.')
      return false
    }

    if (nutritionistData.work_days.length === 0) {
      setError('Selectează cel puțin o zi de lucru.')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateData()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (id === 'new') {
        // Create new profile using service
        const { data, error } = await NutritionistService.createNutritionist({
          ...nutritionistData,
          user_id: user?.id!
        })

        if (error) throw error

        // Redirect to edit page with new ID
        router.push(`/nutritionists/${data!.id}/edit`)
      } else {
        // Update existing profile using service
        const { data, error } = await NutritionistService.updateNutritionist({
          ...nutritionistData,
          id: nutritionistData.id!
        })

        if (error) throw error

        // Update local state with returned data but preserve user edits
        if (data) {
          setNutritionistData(data)
        }
      }

      setHasUnsavedChanges(false)
      setShowSaveConfirm(true)
      setTimeout(() => setShowSaveConfirm(false), 3000)
    } catch (error: any) {
      console.error('Error saving nutritionist data:', error)
      setError(error.message || 'A apărut o eroare la salvare.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (field: 'diploma' | 'certificate', file: File | null) => {
    if (!file) {
      // Remove file logic
      updateData('documents_uploaded', {
        ...nutritionistData.documents_uploaded,
        [field]: false
      })
      return
    }

    if (!user?.id || !nutritionistData.id) {
      setError('Profilul trebuie salvat înainte de a încărca documente.')
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

      // Update documents status
      updateData('documents_uploaded', {
        ...nutritionistData.documents_uploaded,
        [field]: true
      })

    } catch (error: any) {
      console.error('Error uploading file:', error)
      setError(`Eroare la încărcarea fișierului: ${error.message}`)
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
      setError('Eroare la încărcarea fotografiei.')
    } else {
      // update DB row
      await NutritionistService.updateNutritionist({
        id: nutritionistData.id!,
        profile_photo_url: url
      })
      // update local state
      setNutritionistData(prev => ({ ...prev, profile_photo_url: url }))
    }
    setPhotoUploading(false)
  }

  const addLanguage = (language: string) => {
    if (language.trim() && !nutritionistData.languages.includes(language.trim())) {
      updateData('languages', [...nutritionistData.languages, language.trim()])
    }
  }

  // Show loading while checking authentication
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

  const documentsValid = nutritionistData.documents_uploaded.diploma && nutritionistData.documents_uploaded.certificate

  return (
    <>
      <Head>
        <title>{id === 'new' ? 'Profil nou' : 'Editare profil'} - {nutritionistData.full_name || 'Nutriționist'} | NutriFind</title>
        <meta name="description" content="Editează profilul tău de nutriționist" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{id === 'new' ? 'Profil nou' : 'Editare profil'}</span>
              </div>
              <div className="flex items-center gap-4">
                {nutritionistData.id && (
                  <Link href={`/nutritionists/${nutritionistData.id}`}>
                    <button className="text-gray-600 hover:text-green-600 transition-colors">
                      Previzualizare profil
                    </button>
                  </Link>
                )}
                {hasUnsavedChanges && (
                  <span className="text-orange-600 text-sm">Modificări nesalvate</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Eroare</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSaveConfirm && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profilul a fost salvat cu succes!
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/*  */}
              <div className="relative">
                {nutritionistData.profile_photo_url ? (
                  <img
                    src={nutritionistData.profile_photo_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex
        items-center justify-center text-white text-2xl font-bold">
                    {nutritionistData.full_name
                      ? nutritionistData.full_name.split(' ').map(n => n[0]).join('')
                      : 'NN'}
                  </div>
                )}

                {/* transparent file input over the edit button */}
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full
                    flex items-center justify-center hover:bg-green-700 cursor-pointer">
                  {photoUploading ? (
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
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

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {id === 'new' ? 'Creează profil nou' : `Editare profil - ${nutritionistData.full_name || 'Nutriționist'}`}
                </h1>
                <p className="text-gray-600 mb-4">
                  {id === 'new'
                    ? 'Completează informațiile pentru a-ți crea profilul de nutriționist pe platformă.'
                    : 'Menține-ți profilul actualizat pentru a atrage mai mulți clienți și a oferi informații corecte.'
                  }
                </p>

                {!documentsValid && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-orange-800 mb-1">Documente obligatorii lipsă</h3>
                      <p className="text-orange-700 text-sm">
                        Pentru a-ți activa profilul pe platformă, trebuie să încarci diploma de licență și certificatul CDR obligatorii.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${documentsValid ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span>Status profil: {documentsValid ? 'Activ' : 'În așteptare documente'}</span>
                  </div>
                  {nutritionistData.average_rating && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{nutritionistData.average_rating} ({nutritionistData.total_consultations} consultații)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'personal', label: 'Date personale', icon: '👤' },
                { id: 'professional', label: 'Date profesionale', icon: '🎓' },
                { id: 'services', label: 'Servicii și prețuri', icon: '💼' },
                { id: 'availability', label: 'Disponibilitate', icon: '📅' },
                { id: 'documents', label: 'Documente', icon: '📄' }
              ].map((tab) => (
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            {/* Personal Data Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Date personale și de contact</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nume complet *</label>
                    <input
                      type="text"
                      value={nutritionistData.full_name}
                      onChange={(e) => updateData('full_name', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="ex: Dr. Maria Popescu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={nutritionistData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="email@exemplu.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      value={nutritionistData.phone}
                      onChange={(e) => updateData('phone', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="07XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data nașterii *</label>
                    <input
                      type="date"
                      value={nutritionistData.birth_date}
                      onChange={(e) => updateData('birth_date', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gen *</label>
                    <select
                      value={nutritionistData.gender}
                      onChange={(e) => updateData('gender', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="">Selectează...</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Feminin">Feminin</option>
                      <option value="Altul">Altul</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Locația cabinetului *</label>
                    <input
                      type="text"
                      value={nutritionistData.location}
                      onChange={(e) => updateData('location', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="ex: București, Sector 1"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Limbi vorbite *</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {nutritionistData.languages.map((lang, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {lang}
                        <button
                          onClick={() => updateData('languages', nutritionistData.languages.filter((_, i) => i !== index))}
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
                      Adaugă
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descriere profil (Bio) *</label>
                  <textarea
                    value={nutritionistData.bio}
                    onChange={(e) => updateData('bio', e.target.value)}
                    rows={6}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Scrie o descriere detaliată despre tine, experiența ta și abordarea ta în nutriție. Aceasta va fi prima impresie pe care o vor avea clienții despre tine."
                  />
                  <p className="text-sm text-gray-500 mt-2">{nutritionistData.bio.length}/1000 caractere</p>
                </div>
              </div>
            )}

            {/* Professional Data Tab */}
            {activeTab === 'professional' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Date profesionale</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numărul de licență CDR *</label>
                    <input
                      type="text"
                      value={nutritionistData.license_number}
                      onChange={(e) => updateData('license_number', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="ex: CDR12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ani de experiență *</label>
                    <select
                      value={nutritionistData.years_experience}
                      onChange={(e) => updateData('years_experience', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="">Selectează...</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'an' : 'ani'}</option>
                      ))}
                      <option value="20+">20+ ani</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Specializări *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'weight-loss', label: 'Slăbire sănătoasă' },
                      { value: 'muscle-gain', label: 'Creștere masă musculară' },
                      { value: 'health-condition', label: 'Condiții medicale' },
                      { value: 'sports-nutrition', label: 'Nutriție sportivă' },
                      { value: 'general-health', label: 'Sănătate generală' },
                      { value: 'pediatric', label: 'Nutriție pediatrică' },
                      { value: 'elderly', label: 'Nutriție vârstnici' },
                      { value: 'eating-disorders', label: 'Tulburări alimentare' },
                      { value: 'diabetes', label: 'Diabet' }
                    ].map((spec) => (
                      <label key={spec.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
                        <input
                          type="checkbox"
                          checked={nutritionistData.specializations.includes(spec.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('specializations', [...nutritionistData.specializations, spec.value])
                            } else {
                              updateData('specializations', nutritionistData.specializations.filter(s => s !== spec.value))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${nutritionistData.specializations.includes(spec.value)
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300'
                          }`}>
                          {nutritionistData.specializations.includes(spec.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                    <button
                      onClick={addEducation}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adaugă educație
                    </button>
                  </div>

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
                            onChange={(e) => updateEducation(index, 'university', e.target.value)}
                            placeholder="Universitate"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.graduation_year}
                            onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                            placeholder="Anul absolviri"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                    <h3 className="text-lg font-semibold text-gray-800">Certificări suplimentare</h3>
                    <button
                      onClick={addCertification}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adaugă certificare
                    </button>
                  </div>

                  <div className="space-y-4">
                    {nutritionistData.certifications.map((cert, index) => (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            placeholder="Numele certificării"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            placeholder="Emitent"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => updateCertification(index, 'year', e.target.value)}
                            placeholder="Anul obținerii"
                            className="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Șterge
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Servicii și prețuri</h2>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipuri de consultații oferite *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'online', label: 'Online (Video call)', icon: '💻' },
                      { value: 'in-person', label: 'La cabinet', icon: '🏢' },
                      { value: 'hybrid', label: 'Hibrid', icon: '🔄' }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
                        <input
                          type="checkbox"
                          checked={nutritionistData.consultation_types.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('consultation_types', [...nutritionistData.consultation_types, type.value])
                            } else {
                              updateData('consultation_types', nutritionistData.consultation_types.filter(t => t !== type.value))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${nutritionistData.consultation_types.includes(type.value)
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300'
                          }`}>
                          {nutritionistData.consultation_types.includes(type.value) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                    <button
                      onClick={addService}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adaugă serviciu
                    </button>
                  </div>

                  <div className="space-y-6">
                    {nutritionistData.services.map((service, index) => (
                      <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Numele serviciului *</label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateService(index, 'name', e.target.value)}
                              placeholder="ex: Consultație inițială"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Durata (minute) *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preț (RON) *</label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrierea serviciului *</label>
                          <textarea
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            rows={3}
                            placeholder="Descrie ce include acest serviciu..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Șterge serviciu
                        </button>
                      </div>
                    ))}
                  </div>

                  {nutritionistData.services.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p>Nu ai adăugat încă niciun serviciu</p>
                      <p className="text-sm">Adaugă primul tău serviciu pentru a începe să primești clienți</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Disponibilitate</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Zilele în care lucrezi *</h3>
                    <div className="space-y-3">
                      {['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'].map((day) => (
                        <label key={day} className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
                          <input
                            type="checkbox"
                            checked={nutritionistData.work_days.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateData('work_days', [...nutritionistData.work_days, day])
                              } else {
                                updateData('work_days', nutritionistData.work_days.filter(d => d !== day))
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${nutritionistData.work_days.includes(day)
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300'
                            }`}>
                            {nutritionistData.work_days.includes(day) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Intervalul orar *</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ora de început</label>
                        <input
                          type="time"
                          value={nutritionistData.work_hours.start}
                          onChange={(e) => updateData('work_hours', { ...nutritionistData.work_hours, start: e.target.value })}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ora de sfârșit</label>
                        <input
                          type="time"
                          value={nutritionistData.work_hours.end}
                          onChange={(e) => updateData('work_hours', { ...nutritionistData.work_hours, end: e.target.value })}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Durata standard consultație</label>
                        <select
                          value={nutritionistData.consultation_duration}
                          onChange={(e) => updateData('consultation_duration', parseInt(e.target.value))}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        >
                          <option value={30}>30 minute</option>
                          <option value={45}>45 minute</option>
                          <option value={60}>60 minute</option>
                          <option value={90}>90 minute</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 Sfat pentru disponibilitate</h4>
                      <p className="text-blue-700 text-sm">
                        Nutriționiștii cu disponibilitate flexibilă primesc cu 40% mai multe programări.
                        Încearcă să incluzi weekend-uri sau seara pentru mai mulți clienți.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Documente obligatorii</h2>

                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h3 className="font-semibold text-orange-800 mb-2">📋 Documente necesare pentru activare</h3>
                  <p className="text-orange-700 text-sm">
                    Pentru a-ți activa profilul pe platformă și a putea primi clienți, trebuie să încarci obligatoriu următoarele documente verificate:
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Diploma */}
                  <div className="p-6 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Diploma de licență în Nutriție și Dietetică *
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Încarcă o copie scanată sau fotografiată a diplomei tale de licență în domeniul nutriției.
                          Documentul trebuie să fie lizibil și să conțină toate informațiile relevante.
                        </p>

                        {nutritionistData.documents_uploaded.diploma ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="font-medium text-green-800">Diplomă încărcată</p>
                                <p className="text-sm text-green-600">Document verificat cu succes</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileUpload('diploma', null)}
                              className="text-red-600 hover:text-red-700"
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
                            <p className="text-gray-600 mb-2">Încarcă diploma de licență</p>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => e.target.files && handleFileUpload('diploma', e.target.files[0])}
                              className="hidden"
                              id="diploma-upload"
                            />
                            <label
                              htmlFor="diploma-upload"
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

                  {/* CDR Certificate */}
                  <div className="p-6 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Certificat de membru CDR *
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Certificatul de membru al Colegiului Dieteticienilor din România (CDR) este obligatoriu pentru a demonstra
                          că ești autorizat să practici ca nutriționist în România.
                        </p>

                        {nutritionistData.documents_uploaded.certificate ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="font-medium text-green-800">Certificat CDR încărcat</p>
                                <p className="text-sm text-green-600">Document verificat cu succes</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileUpload('certificate', null)}
                              className="text-red-600 hover:text-red-700"
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
                              onChange={(e) => e.target.files && handleFileUpload('certificate', e.target.files[0])}
                              className="hidden"
                              id="certificate-upload"
                            />
                            <label
                              htmlFor="certificate-upload"
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
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">🔒 Securitatea documentelor</h4>
                  <p className="text-blue-700 text-sm">
                    Toate documentele sunt stocate în siguranță și vor fi verificate de echipa noastră în maximum 48 de ore.
                    După verificare, vei primi o confirmare prin email și profilul tău va fi activat.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Se salvează...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {id === 'new' ? 'Creează profil' : 'Salvează modificările'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Info Panel */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Profilul tău</h3>
              </div>
              <p className="text-sm text-gray-600">
                Un profil complet și actualizat crește șansele de a primi mai multe programări cu până la 75%.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Securitate</h3>
              </div>
              <p className="text-sm text-gray-600">
                Toate datele tale sunt protejate și nu vor fi împărtășite fără acordul tău explicit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 010 19 9.5 9.5 0 010-19z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Suport</h3>
              </div>
              <p className="text-sm text-gray-600">
                Ai nevoie de ajutor? Echipa noastră este disponibilă 24/7 pentru a te sprijini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}