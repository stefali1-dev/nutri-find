import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface OnboardingData {
    // Step 1: Account
    email: string
    password: string
    confirmPassword: string

    // Step 2: Personal Info
    fullName: string
    phone: string
    birthDate: string
    gender: string

    // Step 3: Professional Info
    licenseNumber: string
    yearsExperience: string
    workType: string[] // freelance, clinic, hospital
    specializations: string[]

    // Step 4: Education
    education: {
        degree: string
        university: string
        graduationYear: string
    }[]
    certifications: {
        name: string
        issuer: string
        year: string
    }[]

    // Step 5: Services
    consultationTypes: string[]
    services: {
        name: string
        duration: string
        price: string
        description: string
    }[]

    // Step 6: Availability
    workDays: string[]
    workHours: {
        start: string
        end: string
    }
    consultationDuration: string

    // Step 7: Profile Details
    bio: string
    profilePhoto: string
    languages: string[]
    location: string

    // Step 8: Verification
    documents: {
        diploma: File | null
        license: File | null
        insurance: File | null
    }
    termsAccepted: boolean
}

const initialData: OnboardingData = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    birthDate: '',
    gender: '',
    licenseNumber: '',
    yearsExperience: '',
    workType: [],
    specializations: [],
    education: [],
    certifications: [],
    consultationTypes: [],
    services: [],
    workDays: [],
    workHours: { start: '09:00', end: '18:00' },
    consultationDuration: '60',
    bio: '',
    profilePhoto: '',
    languages: [],
    location: '',
    documents: { diploma: null, license: null, insurance: null },
    termsAccepted: false
}

export default function NutritionistOnboarding() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const [formData, setFormData] = useState<OnboardingData>(initialData)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [showPassword, setShowPassword] = useState(false)

    const totalSteps = 8

    const validateStep = () => {
        const newErrors: { [key: string]: string } = {}

        switch (currentStep) {
            case 1:
                if (!formData.email) newErrors.email = 'Email-ul este obligatoriu'
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalid'

                if (!formData.password) newErrors.password = 'Parola este obligatorie'
                else if (formData.password.length < 8) newErrors.password = 'Parola trebuie să aibă minim 8 caractere'

                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Parolele nu se potrivesc'
                }
                break

            case 2:
                if (!formData.fullName) newErrors.fullName = 'Numele complet este obligatoriu'
                if (!formData.phone) newErrors.phone = 'Numărul de telefon este obligatoriu'
                break

            case 3:
                if (!formData.licenseNumber) newErrors.licenseNumber = 'Numărul de licență este obligatoriu'
                if (!formData.yearsExperience) newErrors.yearsExperience = 'Experiența este obligatorie'
                if (formData.workType.length === 0) newErrors.workType = 'Selectează cel puțin un tip'
                if (formData.specializations.length === 0) newErrors.specializations = 'Selectează cel puțin o specializare'
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep()) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(prev => Math.min(prev + 1, totalSteps))
                setIsAnimating(false)
            }, 300)
        }
    }

    const handleBack = () => {
        setIsAnimating(true)
        setTimeout(() => {
            setCurrentStep(prev => Math.max(prev - 1, 1))
            setIsAnimating(false)
        }, 300)
    }

    const updateFormData = (field: keyof OnboardingData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleFileUpload = (type: 'diploma' | 'license' | 'insurance', file: File | null) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [type]: file }
        }))
    }

    const handleSubmit = async () => {
        // Here you would submit to your backend
        console.log('Submitting onboarding data:', formData)
        router.push('/nutritionists/dashboard')
    }

    const progressPercentage = (currentStep / totalSteps) * 100

    return (
    <>
            <Head>
                <title>Înregistrare Nutriționist - NutriConnect</title>
                <meta name="description" content="Alătură-te rețelei de nutriționiști profesioniști din România" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href="/">
                            <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Ai deja cont?</span>
                            <Link href="/nutritionists/login">
                                <span className="text-green-600 hover:text-green-700 font-medium cursor-pointer">Conectează-te</span>
                            </Link>
                        </div>
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

                {/* Welcome Message for First Step */}
                {currentStep === 1 && (
                    <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Bine ai venit în comunitatea NutriConnect! 🌟
                        </h1>
                        <p className="text-lg text-gray-600">
                            Peste 500 de nutriționiști folosesc platforma noastră pentru a-și dezvolta practica
                        </p>
                    </div>
                )}

                {/* Form Content */}
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>

                        {/* Step 1: Create Account */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Creează-ți contul profesional 🔐
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Începe călătoria ta alături de noi. Durează doar câteva minute!
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email profesional
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateFormData('email', e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                                }`}
                                            placeholder="nutritionist@exemplu.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parolă
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={(e) => updateFormData('password', e.target.value)}
                                                className={`w-full p-3 pr-10 border rounded-xl focus:outline-none transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                                    }`}
                                                placeholder="Minim 8 caractere"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmă parola
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                                }`}
                                            placeholder="Repetă parola"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Parola trebuie să conțină:</p>
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 text-sm ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Minim 8 caractere
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Cel puțin o literă mare
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Cel puțin o cifră
                                        </div>
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                    <h3 className="font-semibold text-green-800 mb-3">De ce să te alături?</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-sm text-green-700">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Primele 3 luni gratuite pentru early adopters</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-green-700">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Acces la peste 10,000 de clienți potențiali</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-green-700">
                                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tools profesionale pentru gestionarea practicii</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal Information */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Informații personale 👤
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Să facem cunoștință! Aceste date vor fi vizibile clienților.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nume complet
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => updateFormData('fullName', e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                                }`}
                                            placeholder="ex: Dr. Maria Popescu"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => updateFormData('phone', e.target.value)}
                                                className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                                    }`}
                                                placeholder="07XX XXX XXX"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Data nașterii
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => updateFormData('birthDate', e.target.value)}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gen
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Masculin', 'Feminin', 'Altul'].map((gender) => (
                                                <button
                                                    key={gender}
                                                    onClick={() => updateFormData('gender', gender)}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${formData.gender === gender
                                                            ? 'border-green-600 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    {gender}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Sfat:</strong> Folosește numele complet și profesional. Clienții au mai multă încredere în profilurile complete.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Professional Information */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Informații profesionale 🏥
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Spune-ne despre experiența ta profesională
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Număr licență/autorizație
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.licenseNumber}
                                            onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.licenseNumber ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                                }`}
                                            placeholder="ex: 12345"
                                        />
                                        {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ani de experiență
                                        </label>
                                        <select
                                            value={formData.yearsExperience}
                                            onChange={(e) => updateFormData('yearsExperience', e.target.value)}
                                            className={`w-full p-3 border rounded-xl focus:outline-none transition-colors ${errors.yearsExperience ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                                }`}
                                        >
                                            <option value="">Selectează...</option>
                                            <option value="0-1">Mai puțin de 1 an</option>
                                            <option value="1-3">1-3 ani</option>
                                            <option value="3-5">3-5 ani</option>
                                            <option value="5-10">5-10 ani</option>
                                            <option value="10+">Peste 10 ani</option>
                                        </select>
                                        {errors.yearsExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsExperience}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Unde lucrezi? (poți selecta mai multe)
                                        </label>
                                        <div className="space-y-3">
                                            {[
                                                { value: 'freelance', label: 'Practică privată/Freelance', emoji: '🏠' },
                                                { value: 'clinic', label: 'Clinică privată', emoji: '🏢' },
                                                { value: 'hospital', label: 'Spital', emoji: '🏥' },
                                                { value: 'online', label: 'Exclusiv online', emoji: '💻' }
                                            ].map((type) => (
                                                <label
                                                    key={type.value}
                                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.workType.includes(type.value)
                                                            ? 'border-green-600 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.workType.includes(type.value)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateFormData('workType', [...formData.workType, type.value])
                                                            } else {
                                                                updateFormData('workType', formData.workType.filter(t => t !== type.value))
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-2xl mr-3">{type.emoji}</span>
                                                    <span className="font-medium text-gray-800">{type.label}</span>
                                                    {formData.workType.includes(type.value) && (
                                                        <svg className="w-5 h-5 text-green-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.workType && <p className="text-red-500 text-sm mt-1">{errors.workType}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specializări (selectează toate care se aplică)
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                'Slăbire sănătoasă',
                                                'Nutriție sportivă',
                                                'Nutriție clinică',
                                                'Diabet și boli metabolice',
                                                'Nutriție pediatrică',
                                                'Sarcină și alăptare',
                                                'Vegetarian/Vegan',
                                                'Alergii și intoleranțe',
                                                'Tulburări digestive',
                                                'Nutriție oncologică',
                                                'Nutriție geriatrică',
                                                'Eating disorders'
                                            ].map((spec) => (
                                                <label
                                                    key={spec}
                                                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm ${formData.specializations.includes(spec)
                                                            ? 'border-green-600 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.specializations.includes(spec)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateFormData('specializations', [...formData.specializations, spec])
                                                            } else {
                                                                updateFormData('specializations', formData.specializations.filter(s => s !== spec))
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className="flex-1">{spec}</span>
                                                    {formData.specializations.includes(spec) && (
                                                        <svg className="w-4 h-4 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.specializations && <p className="text-red-500 text-sm mt-1">{errors.specializations}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Education & Certifications */}
                        {currentStep === 4 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Educație și certificări 🎓
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Clienții au încredere în profesioniști cu pregătire solidă
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Educație</h3>
                                        {formData.education.map((edu, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Titlu*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={edu.degree}
                                                            onChange={(e) => {
                                                                const newEducation = [...formData.education]
                                                                newEducation[index].degree = e.target.value
                                                                updateFormData('education', newEducation)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: Licență în Nutriție"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Universitate*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={edu.university}
                                                            onChange={(e) => {
                                                                const newEducation = [...formData.education]
                                                                newEducation[index].university = e.target.value
                                                                updateFormData('education', newEducation)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: Universitatea de Medicină"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            An absolvire*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={edu.graduationYear}
                                                            onChange={(e) => {
                                                                const newEducation = [...formData.education]
                                                                newEducation[index].graduationYear = e.target.value
                                                                updateFormData('education', newEducation)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: 2020"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newEducation = [...formData.education]
                                                            newEducation.splice(index, 1)
                                                            updateFormData('education', newEducation)
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Șterge
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFormData('education', [
                                                    ...formData.education,
                                                    { degree: '', university: '', graduationYear: '' }
                                                ])
                                            }}
                                            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium py-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Adaugă educație
                                        </button>

                                        <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Certificări</h3>
                                        {formData.certifications.map((cert, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Nume certificare*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cert.name}
                                                            onChange={(e) => {
                                                                const newCerts = [...formData.certifications]
                                                                newCerts[index].name = e.target.value
                                                                updateFormData('certifications', newCerts)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: Specialist în Nutriție Sportivă"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            An obținere*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cert.year}
                                                            onChange={(e) => {
                                                                const newCerts = [...formData.certifications]
                                                                newCerts[index].year = e.target.value
                                                                updateFormData('certifications', newCerts)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: 2022"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Organizație emitentă
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cert.issuer}
                                                            onChange={(e) => {
                                                                const newCerts = [...formData.certifications]
                                                                newCerts[index].issuer = e.target.value
                                                                updateFormData('certifications', newCerts)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: Asociația Nutriționiștilor din România"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newCerts = [...formData.certifications]
                                                            newCerts.splice(index, 1)
                                                            updateFormData('certifications', newCerts)
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Șterge
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFormData('certifications', [
                                                    ...formData.certifications,
                                                    { name: '', issuer: '', year: '' }
                                                ])
                                            }}
                                            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium py-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Adaugă certificare
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Services */}
                        {currentStep === 5 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Servicii oferite 💼
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Detaliaza serviciile pe care le oferi clienților
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipuri de consultații oferite*
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Online', 'In-person', 'Telefon', 'Pachet lunar'].map((type) => (
                                                <label
                                                    key={type}
                                                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm ${formData.consultationTypes.includes(type)
                                                            ? 'border-green-600 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.consultationTypes.includes(type)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateFormData('consultationTypes', [...formData.consultationTypes, type])
                                                            } else {
                                                                updateFormData('consultationTypes', formData.consultationTypes.filter(t => t !== type))
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className="flex-1">{type}</span>
                                                    {formData.consultationTypes.includes(type) && (
                                                        <svg className="w-4 h-4 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Servicii individuale</h3>
                                        {formData.services.map((service, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl p-4 mb-6">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Nume serviciu*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={service.name}
                                                            onChange={(e) => {
                                                                const newServices = [...formData.services]
                                                                newServices[index].name = e.target.value
                                                                updateFormData('services', newServices)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: Consultație inițială"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Durată (min)*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={service.duration}
                                                            onChange={(e) => {
                                                                const newServices = [...formData.services]
                                                                newServices[index].duration = e.target.value
                                                                updateFormData('services', newServices)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: 60"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Preț (RON)*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={service.price}
                                                            onChange={(e) => {
                                                                const newServices = [...formData.services]
                                                                newServices[index].price = e.target.value
                                                                updateFormData('services', newServices)
                                                            }}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="ex: 200"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Descriere
                                                        </label>
                                                        <textarea
                                                            value={service.description}
                                                            onChange={(e) => {
                                                                const newServices = [...formData.services]
                                                                newServices[index].description = e.target.value
                                                                updateFormData('services', newServices)
                                                            }}
                                                            rows={2}
                                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                                            placeholder="Detalii despre serviciu..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newServices = [...formData.services]
                                                            newServices.splice(index, 1)
                                                            updateFormData('services', newServices)
                                                        }}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Șterge serviciu
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFormData('services', [
                                                    ...formData.services,
                                                    { name: '', duration: '', price: '', description: '' }
                                                ])
                                            }}
                                            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium py-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Adaugă serviciu
                                        </button>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <p className="text-sm text-yellow-800">
                                            💡 <strong>Sfat:</strong> Clienții apreciază transparența prețurilor. Specifică clar costul fiecărui serviciu.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Availability */}
                        {currentStep === 6 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Disponibilitate 🕒
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Spune-ne când ești disponibil pentru consultații
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Zile de lucru*
                                        </label>
                                        <div className="grid grid-cols-7 gap-2">
                                            {['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'].map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => {
                                                        const newDays = [...formData.workDays]
                                                        if (newDays.includes(day)) {
                                                            updateFormData('workDays', newDays.filter(d => d !== day))
                                                        } else {
                                                            updateFormData('workDays', [...newDays, day])
                                                        }
                                                    }}
                                                    className={`py-3 rounded-xl border-2 transition-all duration-200 text-sm ${formData.workDays.includes(day)
                                                            ? 'border-green-600 bg-green-50 font-medium'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    {day.substring(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Oră început*
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.workHours.start}
                                                onChange={(e) => updateFormData('workHours', { ...formData.workHours, start: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Oră sfârșit*
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.workHours.end}
                                                onChange={(e) => updateFormData('workHours', { ...formData.workHours, end: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durată consultație*
                                            </label>
                                            <select
                                                value={formData.consultationDuration}
                                                onChange={(e) => updateFormData('consultationDuration', e.target.value)}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            >
                                                <option value="30">30 minute</option>
                                                <option value="45">45 minute</option>
                                                <option value="60">60 minute</option>
                                                <option value="90">90 minute</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Informație:</strong> Aceste detalii vor fi vizibile în profilul tău public.
                                            Le poți actualiza oricând din panoul de control.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 7: Profile Details */}
                        {currentStep === 7 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Finalizează profilul ✨
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Completează ultimele detalii pentru profilul tău public
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fotografie profil*
                                        </label>
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
                                                    {formData.profilePhoto ? (
                                                        <img
                                                            src={formData.profilePhoto}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover rounded-xl"
                                                        />
                                                    ) : (
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onload = (event) => {
                                                                if (event.target?.result) {
                                                                    updateFormData('profilePhoto', event.target.result as string)
                                                                }
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Alege o fotografie profesională. Profilurile cu fotografie au până la 80% mai multe solicitări.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
                                                    className="mt-2 text-green-600 hover:text-green-800 font-medium text-sm"
                                                >
                                                    Încarcă fotografie
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prezentare profesională*
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => updateFormData('bio', e.target.value)}
                                            rows={4}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            placeholder="Spune ce te face special și cum poți ajuta clienții..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Min. 100 caractere. Recomandăm 200-300 caractere pentru un impact maxim.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Limbile vorbiti*
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Română', 'Engleză', 'Maghiară', 'Germană', 'Franceză', 'Italienă', 'Spaniolă', 'Rusă'].map((lang) => (
                                                <label
                                                    key={lang}
                                                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-sm ${formData.languages.includes(lang)
                                                            ? 'border-green-600 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.languages.includes(lang)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                updateFormData('languages', [...formData.languages, lang])
                                                            } else {
                                                                updateFormData('languages', formData.languages.filter(l => l !== lang))
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <span className="flex-1">{lang}</span>
                                                    {formData.languages.includes(lang) && (
                                                        <svg className="w-4 h-4 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Locație (oraș)*
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => updateFormData('location', e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                            placeholder="ex: București, Cluj-Napoca, Timișoara..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 8: Verification */}
                        {currentStep === 8 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Verificare și termeni ✅
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Ultimul pas pentru activarea contului tău
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Încarcă documente</h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Pentru a verifica statutul tău profesional, avem nevoie de copii după următoarele documente.
                                            Datele vor fi procesate în mod sigur și confidențial.
                                        </p>

                                        <div className="space-y-6">
                                            {[
                                                {
                                                    type: 'diploma',
                                                    label: 'Diplomă de studii*',
                                                    description: 'Document care atestă calificarea ta în domeniul nutriției'
                                                },
                                                {
                                                    type: 'license',
                                                    label: 'Autorizație de practică*',
                                                    description: 'Autorizația emisă de Colegiul Nutriționiștilor'
                                                },
                                                {
                                                    type: 'insurance',
                                                    label: 'Asigurare RCA',
                                                    description: 'Asigurare de răspundere civilă (opțional)',
                                                    optional: true
                                                }
                                            ].map((doc) => (
                                                <div key={doc.type} className="border border-gray-200 rounded-xl p-5">
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-gray-100 p-3 rounded-lg">
                                                            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-800">{doc.label}</h4>
                                                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                                                </div>
                                                                {formData.documents[doc.type as keyof typeof formData.documents] && (
                                                                    <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                                                                        Încărcat
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mt-4">
                                                                <label className="block">
                                                                    <span className="sr-only">Alege fișier</span>
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0] || null
                                                                            handleFileUpload(doc.type as any, file)
                                                                        }}
                                                                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100
                      "
                                                                    />
                                                                </label>
                                                                <p className="text-xs text-gray-500 mt-2">
                                                                    Formate acceptate: PDF, JPG, PNG (max 5MB)
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Termeni și conditii</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Citește și acceptă termenii și condițiile platformei. Este important să respecți regulile comunității.
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.termsAccepted}
                                                onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                                                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <label className="text-sm text-gray-700">
                                                Am citit și accept termenii și condițiile platformei.
                                            </label>
                                        </div>
                                        {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>Informație:</strong> După verificare, profilul tău va fi activat și vizibil pentru clienți.
                                            Poți actualiza documentele oricând din panoul de control.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Finalizează înregistrarea
                                    </button>
                                </div>
                            </div>
                        )}

                    {/* Navigation Buttons */}
                    {currentStep < totalSteps && (
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isAnimating}
                                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                                    currentStep === 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-green-600 text-green-700 hover:bg-green-50'
                                }`}
                            >
                                Înapoi
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isAnimating}
                                className="px-6 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                                Continuă
                            </button>
                        </div>
                    )}

                    </div>
                </div>
            </div>
    </>
    )
}