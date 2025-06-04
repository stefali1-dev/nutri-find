import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../../lib/supabaseClient'

interface FormData {
  goal: string
  healthConditions: string[]
  dietType: string
  budget: string
  consultationType: string
  availability: string[]
  experience: string
  location: string
  age: string
  gender: string
  email: string
  name: string
}

export default function FindNutritionist() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    goal: '',
    healthConditions: [],
    dietType: '',
    budget: '',
    consultationType: '',
    availability: [],
    experience: '',
    location: '',
    age: '',
    gender: '',
    email: '',
    name: ''
  })

  const totalSteps = 7 // Redus de la 8 la 7 după eliminarea pasului 2

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('nutriForm')
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nutriForm', JSON.stringify(formData))
  }, [formData])

  const handleNext = () => {
    if (validateStep()) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps))
        setIsAnimating(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    }
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1))
      setIsAnimating(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.goal !== ''
      case 4:
        return formData.budget !== ''
      case 5:
        return formData.consultationType !== ''
      case 7:
        return formData.email !== '' && formData.name !== ''
      default:
        return true
    }
  }

const handleSubmit = async () => {
  try {
    setIsAnimating(true)

    const dataToSave = {
      name: formData.name,
      email: formData.email,
      goal: formData.goal,
      health_conditions: formData.healthConditions,
      diet_type: formData.dietType || null,
      budget: formData.budget,
      consultation_type: formData.consultationType,
      availability: formData.availability,
      experience_preference: formData.experience || null,
      location: formData.location || null,
      age_range: formData.age || null,
      gender: formData.gender || null
    }

    console.log(dataToSave);

    // Save in sessionStorage (serialize to JSON)
    // Will be used later to fetch nutritionists
    sessionStorage.setItem('nutriPreferences', JSON.stringify(dataToSave))
    router.push('/nutritionists/results')
    
  } catch (error) {
    console.error('Unexpected error:', error)
    alert('A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
    setIsAnimating(false)
  }
}


  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Înapoi
          </button>
          <span className="text-2xl font-bold text-green-600">NutriConnect</span>
          <button className="text-gray-500 text-sm">
            Salvează și continuă mai târziu
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Pasul {currentStep} din {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% completat</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          
          {/* Step 1: Main Goal */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Să începem! Care este obiectivul tău principal? 🎯
              </h2>
              <p className="text-gray-600 mb-8">
                Alegerea ta ne va ajuta să găsim nutriționiști specializați exact pe ceea ce ai nevoie.
              </p>
              
              <div className="space-y-4">
                {[
                  { value: 'weight-loss', label: 'Slăbire sănătoasă', emoji: '⚖️' },
                  { value: 'muscle-gain', label: 'Creștere masă musculară', emoji: '💪' },
                  { value: 'health-condition', label: 'Gestionare condiție medicală', emoji: '🏥' },
                  { value: 'sports-nutrition', label: 'Nutriție sportivă', emoji: '🏃‍♂️' },
                  { value: 'general-health', label: 'Alimentație sănătoasă generală', emoji: '🥗' },
                  { value: 'other', label: 'Altceva', emoji: '✨' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('goal', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                      formData.goal === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-medium text-gray-800">{option.label}</span>
                    </span>
                    {formData.goal === option.value && (
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Health Conditions (fostul Step 3) */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Sănătatea ta este prioritatea noastră 🏥
              </h2>
              <p className="text-gray-600 mb-8">
                Ai condiții medicale pe care nutriționistul ar trebui să le ia în considerare?
              </p>
              
              <div className="space-y-3">
                {[
                  'Nu am condiții medicale',
                  'Diabet tip 1 sau 2',
                  'Boli cardiovasculare',
                  'Probleme tiroidiene',
                  'Sindrom de colon iritabil',
                  'Intoleranță la lactoză',
                  'Boală celiacă',
                  'Alergii alimentare',
                  'Altele'
                ].map((condition) => (
                  <label
                    key={condition}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.healthConditions.includes(condition)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(condition)}
                      onChange={(e) => {
                        if (condition === 'Nu am condiții medicale') {
                          updateFormData('healthConditions', e.target.checked ? [condition] : [])
                        } else {
                          const filtered = formData.healthConditions.filter(c => c !== 'Nu am condiții medicale')
                          if (e.target.checked) {
                            updateFormData('healthConditions', [...filtered.filter(c => c !== condition), condition])
                          } else {
                            updateFormData('healthConditions', filtered.filter(c => c !== condition))
                          }
                        }
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-gray-800">{condition}</span>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        formData.healthConditions.includes(condition)
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300'
                      }`}>
                        {formData.healthConditions.includes(condition) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="mt-6 text-green-600 text-sm hover:text-green-700 transition-colors"
              >
                Prefer să nu răspund →
              </button>
            </div>
          )}

          {/* Step 3: Diet Preferences (fostul Step 4) */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Ai preferințe alimentare speciale? 🥗
              </h2>
              <p className="text-gray-600 mb-8">
                Acest lucru ne ajută să găsim nutriționiști familiarizați cu stilul tău de viață.
              </p>
              
              <div className="space-y-4">
                {[
                  { value: 'omnivore', label: 'Mănânc de toate', emoji: '🍽️' },
                  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
                  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
                  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
                  { value: 'keto', label: 'Keto', emoji: '🥑' },
                  { value: 'other', label: 'Altă dietă', emoji: '✨' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('dietType', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                      formData.dietType === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-medium text-gray-800">{option.label}</span>
                    </span>
                    {formData.dietType === option.value && (
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="mt-6 text-green-600 text-sm hover:text-green-700 transition-colors"
              >
                Nu am preferințe speciale →
              </button>
            </div>
          )}

          {/* Step 4: Budget (fostul Step 5) */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Care este bugetul tău lunar? 💰
              </h2>
              <p className="text-gray-600 mb-8">
                Nu-ți face griji, avem opțiuni pentru toate buzunarele, inclusiv consultații gratuite!
              </p>
              
              <div className="space-y-4">
                {[
                  { value: 'free', label: 'Caut consultații gratuite', desc: 'Nutriționiști începători', emoji: '🎁' },
                  { value: '0-200', label: '0 - 200 RON', desc: 'Opțiuni accesibile', emoji: '💵' },
                  { value: '200-500', label: '200 - 500 RON', desc: 'Gamă medie', emoji: '💳' },
                  { value: '500-1000', label: '500 - 1000 RON', desc: 'Premium', emoji: '💎' },
                  { value: '1000+', label: 'Peste 1000 RON', desc: 'VIP / Personalizat complet', emoji: '👑' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('budget', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${
                      formData.budget === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">{option.emoji}</span>
                      <div>
                        <span className="font-medium text-gray-800 block">{option.label}</span>
                        <span className="text-sm text-gray-500">{option.desc}</span>
                      </div>
                    </div>
                    {formData.budget === option.value && (
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Consultation Type (fostul Step 6) */}
          {currentStep === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Cum preferi să ai consultațiile? 💻
              </h2>
              <p className="text-gray-600 mb-8">
                Flexibilitate maximă pentru stilul tău de viață.
              </p>
              
              <div className="space-y-4">
                {[
                  { 
                    value: 'online', 
                    label: 'Online', 
                    desc: 'Video call din confortul casei tale',
                    emoji: '💻',
                    benefits: ['Fără deplasare', 'Program flexibil', 'Înregistrări disponibile']
                  },
                  { 
                    value: 'in-person', 
                    label: 'În persoană', 
                    desc: 'Întâlniri față în față la cabinet',
                    emoji: '🏢',
                    benefits: ['Contact direct', 'Măsurători precise', 'Experiență completă']
                  },
                  { 
                    value: 'hybrid', 
                    label: 'Hibrid', 
                    desc: 'Combinație online + față în față',
                    emoji: '🔄',
                    benefits: ['Flexibilitate maximă', 'Best of both worlds', 'Personalizat']
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData('consultationType', option.value)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.consultationType === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="font-medium text-gray-800 text-lg">{option.label}</span>
                        </div>
                        <p className="text-gray-600 mb-3">{option.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.benefits.map((benefit) => (
                            <span key={benefit} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      {formData.consultationType === option.value && (
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Additional Info (fostul Step 7) */}
          {currentStep === 6 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Câteva detalii despre tine 📝
              </h2>
              <p className="text-gray-600 mb-8">
                Opțional, dar ne ajută să facem recomandări mai bune.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vârsta ta</label>
                  <select
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value="">Selectează...</option>
                    <option value="18-25">18-25 ani</option>
                    <option value="26-35">26-35 ani</option>
                    <option value="36-45">36-45 ani</option>
                    <option value="46-55">46-55 ani</option>
                    <option value="56+">56+ ani</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gen</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Masculin', 'Feminin', 'Altul'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => updateFormData('gender', gender)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.gender === gender
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-400'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localitatea</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="ex: București, Cluj-Napoca"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de experiență dorit</label>
                  <div className="space-y-3">
                    {[
                      { value: 'beginner', label: 'Nutriționist începător', desc: 'Prețuri mai mici, entuziasm maxim' },
                      { value: 'intermediate', label: 'Experiență medie', desc: '2-5 ani experiență' },
                      { value: 'expert', label: 'Expert', desc: '5+ ani, specializări multiple' },
                      { value: 'any', label: 'Nu contează', desc: 'Orice nivel de experiență' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => updateFormData('experience', level.value)}
                        className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.experience === level.value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-400'
                        }`}
                      >
                        <span className="font-medium text-gray-800 block">{level.label}</span>
                        <span className="text-sm text-gray-500">{level.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="mt-6 text-green-600 text-sm hover:text-green-700 transition-colors"
              >
                Sari peste acest pas →
              </button>
            </div>
          )}

          {/* Step 7: Contact (fostul Step 8) */}
          {currentStep === 7 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Aproape gata! 🎉
              </h2>
              <p className="text-gray-600 mb-8">
                Ultimul pas - cum te putem contacta cu recomandările personalizate?
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numele tău</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="ex: Maria Popescu"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="email@exemplu.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    🔒 Datele tale sunt în siguranță. Nu trimitem spam și nu le vindem către terți.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Sunt de acord cu <a href="#" className="text-green-600 hover:underline">termenii și condițiile</a> și 
                    <a href="#" className="text-green-600 hover:underline"> politica de confidențialitate</a>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!validateStep()}
              className={`ml-auto flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                validateStep()
                  ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuă
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep()}
              className={`ml-auto flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                validateStep()
                  ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Vezi nutriționiștii recomandați
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-600">Confidențial</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">500+</div>
            <div className="text-sm text-gray-600">Nutriționiști</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">4.9★</div>
            <div className="text-sm text-gray-600">Rating mediu</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">Gratuit</div>
            <div className="text-sm text-gray-600">Pentru clienți</div>
          </div>
        </div>
      </div>
    </div>
  )
}