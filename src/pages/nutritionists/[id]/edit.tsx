import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NutritionistData } from '@/types/NutritionistData'

export default function EditNutritionistProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'services' | 'availability' | 'documents'>('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  const [nutritionistData, setNutritionistData] = useState<NutritionistData>({
    id: '1',
    email: 'maria.popescu@email.com',
    fullName: 'Dr. Maria Popescu',
    phone: '0721234567',
    birthDate: '1985-05-15',
    gender: 'Feminin',
    licenseNumber: 'CDR12345',
    yearsExperience: '8',
    workType: ['online', 'in-person'],
    specializations: ['weight-loss', 'sports-nutrition'],
    education: [{
      degree: 'Licență în Nutriție și Dietetică',
      university: 'Universitatea de Medicină București',
      graduationYear: '2015'
    }],
    certifications: [{
      name: 'Certificat Nutriție Sportivă',
      issuer: 'ACSM',
      year: '2020'
    }],
    consultationTypes: ['online', 'in-person'],
    services: [
      {
        name: 'Consultație inițială',
        duration: '60',
        price: '250',
        description: 'Evaluare completă și plan personalizat'
      },
      {
        name: 'Follow-up',
        duration: '30',
        price: '150',
        description: 'Monitorizare și ajustări'
      }
    ],
    workDays: ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'],
    workHours: { start: '09:00', end: '17:00' },
    consultationDuration: '60',
    bio: 'Sunt nutriționist cu 8 ani de experiență, specializată în pierderea în greutate și nutriția sportivă.',
    profilePhoto: '',
    languages: ['Română', 'Engleză'],
    location: 'București',
    documents: { diploma: null, certificate: null },
    termsAccepted: true,
    rating: 4.9,
    totalReviews: 156
  })

  const updateData = (field: keyof NutritionistData, value: any) => {
    setNutritionistData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const addEducation = () => {
    updateData('education', [
      ...nutritionistData.education,
      { degree: '', university: '', graduationYear: '' }
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

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Aici ar fi logica de salvare în Supabase
      console.log('Salvare date:', nutritionistData)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulare request
      setHasUnsavedChanges(false)
      setShowSaveConfirm(true)
      setTimeout(() => setShowSaveConfirm(false), 3000)
    } catch (error) {
      console.error('Eroare la salvare:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (field: 'diploma' | 'certificate', file: File) => {
    updateData('documents', {
      ...nutritionistData.documents,
      [field]: file
    })
  }

  const documentsValid = nutritionistData.documents.diploma && nutritionistData.documents.certificate

  return (
    <>
      <Head>
        <title>Editare Profil - {nutritionistData.fullName} | NutriConnect</title>
        <meta name="description" content="Editează profilul tău de nutriționist" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Editare profil</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/nutritionist/profile">
                  <button className="text-gray-600 hover:text-green-600 transition-colors">
                    Previzualizare profil
                  </button>
                </Link>
                {hasUnsavedChanges && (
                  <span className="text-orange-600 text-sm">Modificări nesalvate</span>
                )}
              </div>
            </div>
          </div>
        </div>

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
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {nutritionistData.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Editare profil - {nutritionistData.fullName}
                </h1>
                <p className="text-gray-600 mb-4">
                  Menține-ți profilul actualizat pentru a atrage mai mulți clienți și a oferi informații corecte.
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
                  {nutritionistData.rating && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{nutritionistData.rating} ({nutritionistData.totalReviews} recenzii)</span>
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
                  className={`py-4 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
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
                      value={nutritionistData.fullName}
                      onChange={(e) => updateData('fullName', e.target.value)}
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
                      value={nutritionistData.birthDate}
                      onChange={(e) => updateData('birthDate', e.target.value)}
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
                          updateData('languages', [...nutritionistData.languages, e.currentTarget.value.trim()])
                          e.currentTarget.value = ''
                        }
                      }}
                      className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <button className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
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
                      value={nutritionistData.licenseNumber}
                      onChange={(e) => updateData('licenseNumber', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="ex: CDR12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ani de experiență *</label>
                    <select
                      value={nutritionistData.yearsExperience}
                      onChange={(e) => updateData('yearsExperience', e.target.value)}
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
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                          nutritionistData.specializations.includes(spec.value)
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
                            value={edu.graduationYear}
                            onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
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
                          checked={nutritionistData.consultationTypes.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateData('consultationTypes', [...nutritionistData.consultationTypes, type.value])
                            } else {
                              updateData('consultationTypes', nutritionistData.consultationTypes.filter(t => t !== type.value))
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                          nutritionistData.consultationTypes.includes(type.value)
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300'
                        }`}>
                          {nutritionistData.consultationTypes.includes(type.value) && (
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
                            checked={nutritionistData.workDays.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateData('workDays', [...nutritionistData.workDays, day])
                              } else {
                                updateData('workDays', nutritionistData.workDays.filter(d => d !== day))
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                            nutritionistData.workDays.includes(day)
                              ? 'bg-green-600 border-green-600'
                              : 'border-gray-300'
                          }`}>
                            {nutritionistData.workDays.includes(day) && (
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
                          value={nutritionistData.workHours.start}
                          onChange={(e) => updateData('workHours', {...nutritionistData.workHours, start: e.target.value})}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ora de sfârșit</label>
                        <input
                          type="time"
                          value={nutritionistData.workHours.end}
                          onChange={(e) => updateData('workHours', {...nutritionistData.workHours, end: e.target.value})}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Durata standard consultație</label>
                        <select
                          value={nutritionistData.consultationDuration}
                          onChange={(e) => updateData('consultationDuration', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        >
                          <option value="30">30 minute</option>
                          <option value="45">45 minute</option>
                          <option value="60">60 minute</option>
                          <option value="90">90 minute</option>
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
                        
                        {nutritionistData.documents.diploma ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="font-medium text-green-800">{nutritionistData.documents.diploma.name}</p>
                                <p className="text-sm text-green-600">Document încărcat cu succes</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileUpload('diploma', null as any)}
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
                        
                        {nutritionistData.documents.certificate ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="font-medium text-green-800">{nutritionistData.documents.certificate.name}</p>
                                <p className="text-sm text-green-600">Document încărcat cu succes</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileUpload('certificate', null as any)}
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
              className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isLoading
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
                  Salvează modificările
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