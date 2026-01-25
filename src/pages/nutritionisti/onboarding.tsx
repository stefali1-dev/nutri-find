import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Footer from '@/components/Footer'
import LocationSearch from '@/components/LocationSearch'
import { NutritionistService } from '@/lib/services/nutritionistService'
import type { CreateNutritionistData } from '@/lib/types/nutritionist'
import { consultationTypes, specializations } from '@/lib/utils'

// Tipuri de date simplificate
interface FormData {
    // Step 1
    email: string
    password: string

    // Step 2
    fullName: string
    phone: string

    // Step 3
    specializations: string[]
    experience: string
    consultationTypes: string[]

    // Step 4
    bio: string
    languages: string[]
    location: string

    // Step 5
    services: Array<{
        name: string
        price: string
        duration: string
    }>

    // Step 6
    termsAccepted: boolean
}

const INITIAL_FORM_DATA: FormData = {
    email: '',
    password: '',
    fullName: '',
    phone: '',
    specializations: [],
    experience: '',
    consultationTypes: [],
    bio: '',
    languages: ['Română'],
    location: '',
    services: [
        { name: 'Consultație inițială', price: '250', duration: '60' },
        { name: 'Consultație de monitorizare', price: '150', duration: '30' }
    ],
    termsAccepted: false
}

export default function NutritionistOnboarding() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const TOTAL_STEPS = 6

    // Update form data și șterge eroarea pentru câmpul respectiv
    const updateField = (field: keyof FormData | string, value: any) => {
        setFormData(prev => {
            if (field.includes('.')) {
                // Handle nested fields like services.0.name
                const parts = field.split('.')
                const newData = { ...prev }
                let current: any = newData

                for (let i = 0; i < parts.length - 1; i++) {
                    current = current[parts[i]]
                }

                current[parts[parts.length - 1]] = value
                return newData
            }

            return { ...prev, [field]: value }
        })

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    // Validare pentru pasul curent
    const validateCurrentStep = () => {
        const newErrors: Record<string, string> = {}

        switch (currentStep) {
            case 1:
                if (!formData.email) {
                    newErrors.email = 'Email-ul este obligatoriu'
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Email-ul nu este valid'
                }

                if (!formData.password) {
                    newErrors.password = 'Parola este obligatorie'
                } else if (formData.password.length < 8) {
                    newErrors.password = 'Parola trebuie să aibă minim 8 caractere'
                }
                break

            case 2:
                if (!formData.fullName) {
                    newErrors.fullName = 'Numele complet este obligatoriu'
                }
                if (!formData.phone) {
                    newErrors.phone = 'Numărul de telefon este obligatoriu'
                }
                break

            case 3:
                if (formData.specializations.length === 0) {
                    newErrors.specializations = 'Selectează cel puțin o specializare'
                }
                if (!formData.experience) {
                    newErrors.experience = 'Selectează experiența ta'
                }
                if (formData.consultationTypes.length === 0) {
                    newErrors.consultationTypes = 'Selectează cel puțin un tip de consultație'
                }
                break

            case 4:
                if (!formData.bio || formData.bio.length < 50) {
                    newErrors.bio = 'Scrie o descriere de minim 50 caractere'
                }
                if (!formData.location) {
                    newErrors.location = 'Locația este obligatorie'
                }
                break

            case 5:
                if (formData.services.length === 0) {
                    newErrors.services = 'Adaugă cel puțin un serviciu'
                }
                formData.services.forEach((service, index) => {
                    if (!service.name) newErrors[`service-${index}-name`] = 'Numele serviciului este obligatoriu'
                    if (!service.price) newErrors[`service-${index}-price`] = 'Prețul este obligatoriu'
                })
                break

            case 6:
                if (!formData.termsAccepted) {
                    newErrors.terms = 'Trebuie să accepți termenii și condițiile'
                }
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmit = async () => {
        if (!validateCurrentStep()) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            // Pasul 1: Înregistrează utilizatorul în Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) {
                if (signUpError.message.toLowerCase().includes("user already registered") || signUpError.message.toLowerCase().includes("already exists")) {
                    setErrors(prev => ({ ...prev, email: 'Acest email este deja înregistrat.' }));
                    setCurrentStep(1);
                } else {
                    console.error('Sign up error:', signUpError);
                    setErrors(prev => ({ ...prev, general: `Eroare la crearea contului: ${signUpError.message}` }));
                }
                setIsSubmitting(false);
                return;
            }

            if (!authData.user) {
                alert('Cont creat! Dacă este necesară confirmarea pe email, te rugăm să verifici inbox-ul înainte de a te loga.');
                setIsSubmitting(false);
                return;
            }

            // Ensure the session is set on the client before proceeding
            if (authData.session) {
                await supabase.auth.setSession({
                    access_token: authData.session.access_token,
                    refresh_token: authData.session.refresh_token,
                });
            } else {
                console.error('No session returned after signup');
                setErrors(prev => ({ ...prev, general: 'Sesiunea nu a putut fi inițializată. Te rugăm să încerci să te autentifici.' }));
                setIsSubmitting(false);
                return;
            }

            // Verify the session is active before proceeding
            const { data: { user: verifiedUser } } = await supabase.auth.getUser();
            if (!verifiedUser || verifiedUser.id !== authData.user.id) {
                console.error('Session verification failed');
                setErrors(prev => ({ ...prev, general: 'Autentificarea nu a putut fi verificată. Te rugăm să încerci din nou.' }));
                setIsSubmitting(false);
                return;
            }

            // Pasul 2: Convertește FormData în CreateNutritionistData
            const nutritionistData: CreateNutritionistData = {
                user_id: authData.user.id,
                email: formData.email,
                full_name: formData.fullName,
                phone: formData.phone,
                years_experience: formData.experience,
                specializations: formData.specializations,
                consultation_types: formData.consultationTypes,
                services: formData.services.map(service => ({
                    name: service.name,
                    duration: service.duration,
                    price: service.price,
                    description: ''
                })),
                bio: formData.bio,
                languages: formData.languages,
                location: formData.location
            };


            // Pasul 3: Creează profilul nutriționistului folosind serviciul
            const { data: nutritionistProfile, error: createError } = await NutritionistService.createNutritionist(nutritionistData);

            if (createError) {
                console.error('Error creating nutritionist profile:', createError);
                
                let errorMessage = 'Profilul nu a putut fi creat. ';
                
                // Check for RLS policy errors
                if (createError.message && createError.message.includes('policy')) {
                    errorMessage += 'Eroare de permisiuni (RLS). Verifică că ești autentificat corect. ';
                } else if (createError.code === '42501') {
                    errorMessage += 'Nu ai permisiunea să creezi acest profil. ';
                } else if (createError.code === '23505') {
                    errorMessage += 'Există deja un profil asociat cu acest cont. ';
                } else {
                    errorMessage += `(${createError.message || createError.code || 'Eroare necunoscută'})`;
                }
                
                errorMessage += ' Te rugăm să contactezi suportul dacă problema persistă.';
                
                setErrors(prev => ({
                    ...prev,
                    general: errorMessage
                }));
                setIsSubmitting(false);
                return;
            }

            // Pasul 4: Succes! Salvează informații în sesiune și redirecționează
            if (nutritionistProfile && nutritionistProfile.id) {
                sessionStorage.setItem('nutritionistId', nutritionistProfile.id);
                sessionStorage.setItem('nutritionistEmail', nutritionistProfile.email);
                sessionStorage.setItem('userId', authData.user.id);

                // Redirecționează către pagina de editare profil pentru a completa restul informațiilor
                router.push(`/nutritionisti/${nutritionistProfile.id}/edit`);
            } else {
                console.error('Nutritionist profile data was null or missing ID after creation.');
                setErrors(prev => ({ ...prev, general: 'Eroare la finalizarea înregistrării. Profilul nu a fost returnat corect.' }));
                setIsSubmitting(false);
            }

        } catch (error: any) {
            console.error('General error in handleSubmit:', error);
            setErrors(prev => ({ ...prev, general: `A apărut o eroare neașteptată: ${error.message}` }));
            setIsSubmitting(false);
        }
    };

    // Add/Remove services
    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { name: '', price: '', duration: '60' }]
        }))
    }

    const removeService = (index: number) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }))
    }

    const progressPercentage = (currentStep / TOTAL_STEPS) * 100

    return (
        <>
            <Head>
                <title>Înregistrare Nutriționist - NutriFind</title>
                <meta name="description" content="Alătură-te comunității de nutriționiști profesioniști" />
            </Head>

            <style jsx global>{`
                @media (max-width: 640px) {
                    input[type="text"],
                    input[type="email"],
                    input[type="tel"],
                    textarea,
                    select {
                        font-size: 16px !important;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .touch-manipulation {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
                {/* Header simplu */}
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
                        <Link href="/">
                            <span className="text-xl sm:text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                        </Link>
                        <Link href="/nutritionisti/login">
                            <span className="text-green-600 hover:text-green-700 cursor-pointer text-sm sm:text-base">
                                <span className="hidden sm:inline">Ai deja cont? </span>Conectează-te
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Progress bar */}
                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                            <span>Pasul {currentStep} din {TOTAL_STEPS}</span>
                            <span>{Math.round(progressPercentage)}% completat</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Form container */}
                <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-8">
                    {/* Step 1: Account */}
                    {currentStep === 1 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <div className="text-center mb-6 sm:mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                                    Bun venit în familia NutriFind! 🌟
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Creează-ți contul în doar câteva minute
                                </p>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email profesional
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={`w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="email@exemplu.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Parolă
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            className={`w-full px-3 sm:px-4 py-3 pr-12 rounded-lg sm:rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                            placeholder="Minim 8 caractere"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 touch-manipulation cursor-pointer"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
                                    )}

                                    {/* Password strength indicator */}
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className={`text-xs sm:text-sm ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Minim 8 caractere
                                            </div>
                                            <div className={`text-xs sm:text-sm ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Cel puțin o literă mare
                                            </div>
                                            <div className={`text-xs sm:text-sm ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Cel puțin o cifră
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sfat profesional */}
                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                                    <p className="text-xs sm:text-sm text-blue-800">
                                        <strong>💡 Sfat:</strong> Folosește email-ul profesional pe care îl verifici zilnic. Aici vei primi notificări despre clienți noi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Info */}
                    {currentStep === 2 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Informații personale 👤
                            </h2>

                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nume complet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                        className={`w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="ex: Dr. Maria Popescu"
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className={`w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="07XX XXX XXX"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Step 3: Professional Info */}
                    {currentStep === 3 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Expertiza ta 🏥
                            </h2>

                            <div className="space-y-4 sm:space-y-6">
                                {/* Specializations */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Specializări (alege toate care se aplică)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {specializations.map(({ value, label }) => (
                                            <label
                                                key={value}
                                                className={`flex items-center p-3 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all touch-manipulation ${formData.specializations.includes(value)
                                                    ? 'border-green-600 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-400'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.specializations.includes(value)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            updateField('specializations', [...formData.specializations, value])
                                                        } else {
                                                            updateField('specializations', formData.specializations.filter(s => s !== value))
                                                        }
                                                    }}
                                                    className="sr-only"
                                                />
                                                <span className="text-xs sm:text-sm">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.specializations && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.specializations}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ani de experiență *</label>
                                    <select
                                        onChange={(e) => updateField('experience', e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                    >
                                        <option value="">Selectează...</option>
                                        {[...Array(20)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'an' : 'ani'}</option>
                                        ))}
                                        <option value="20+">20+ ani</option>
                                    </select>
                                </div>

                                {/* Consultation Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tipuri de consultații
                                    </label>
                                    <div className="space-y-2 sm:space-y-3">
                                        {consultationTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`flex items-center p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all touch-manipulation ${formData.consultationTypes.includes(type.value)
                                                    ? 'border-green-600 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-400'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.consultationTypes.includes(type.value)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            updateField('consultationTypes', [...formData.consultationTypes, type.value])
                                                        } else {
                                                            updateField('consultationTypes', formData.consultationTypes.filter(t => t !== type.value))
                                                        }
                                                    }}
                                                    className="sr-only"
                                                />
                                                <span className="text-xl sm:text-2xl mr-3">{type.icon}</span>
                                                <div className="flex-1">
                                                    <span className="font-medium text-sm sm:text-base block">{type.label}</span>
                                                    <span className="text-xs text-gray-500">{type.desc}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.consultationTypes && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.consultationTypes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Profile */}
                    {currentStep === 4 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Profilul tău public 📝
                            </h2>

                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Despre tine
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => updateField('bio', e.target.value)}
                                        className={`w-full px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl border ${errors.bio ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        rows={5}
                                        placeholder="Spune clienților despre tine..."
                                    />
                                    <div className="mt-1 text-xs sm:text-sm text-gray-500">
                                        {formData.bio.length}/50 caractere minime
                                    </div>
                                    {errors.bio && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.bio}</p>
                                    )}
                                </div>

                                {/* Sfat pentru bio */}
                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800">
                                    💡 <strong>Sfat:</strong> Menționează abordarea ta unică, certificările importante și de ce ești pasionat de nutriție. Clienții caută o conexiune personală!
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Limbi vorbite
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Română', 'Engleză', 'Franceză', 'Germană', 'Spaniolă'].map((lang) => (
                                            <button
                                                key={lang}
                                                type="button"
                                                onClick={() => {
                                                    if (formData.languages.includes(lang)) {
                                                        updateField('languages', formData.languages.filter(l => l !== lang))
                                                    } else {
                                                        updateField('languages', [...formData.languages, lang])
                                                    }
                                                }}
                                                className={`px-3 sm:px-4 py-2 rounded-full border-2 transition-all text-xs sm:text-sm touch-manipulation cursor-pointer ${formData.languages.includes(lang)
                                                    ? 'border-green-600 bg-green-50 text-green-700'
                                                    : 'border-gray-200 hover:border-green-400'
                                                    }`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>

                                    <LocationSearch
                                        value={formData.location}
                                        onChange={(value) => updateField('location', value)}
                                        error={!!errors.location}
                                        placeholder="Caută localitatea..."
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Services */}
                    {currentStep === 5 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Servicii și prețuri 💰
                            </h2>

                            {/* Sfat pentru prețuri */}
                            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800 mb-4">
                                💡 <strong>Sfat:</strong> Stabilește prețuri competitive pentru piața locală. Poți oferi reduceri pentru primii clienți sau pachete avantajoase.
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {formData.services.map((service, index) => (
                                    <div key={index} className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                            <input
                                                type="text"
                                                value={service.name}
                                                onChange={(e) => {
                                                    const newServices = [...formData.services]
                                                    newServices[index].name = e.target.value
                                                    updateField('services', newServices)
                                                }}
                                                placeholder="Nume serviciu"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={service.price}
                                                onChange={(e) => {
                                                    const newServices = [...formData.services]
                                                    newServices[index].price = e.target.value
                                                    updateField('services', newServices)
                                                }}
                                                placeholder="Preț (RON)"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    value={service.duration}
                                                    onChange={(e) => {
                                                        const newServices = [...formData.services]
                                                        newServices[index].duration = e.target.value
                                                        updateField('services', newServices)
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                                >
                                                    <option value="30">30 min</option>
                                                    <option value="45">45 min</option>
                                                    <option value="60">60 min</option>
                                                    <option value="90">90 min</option>
                                                </select>
                                                {formData.services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeService(index)}
                                                        className="text-red-500 hover:text-red-700 p-2 touch-manipulation cursor-pointer"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {errors[`service-${index}-name`] && (
                                            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[`service-${index}-name`]}</p>
                                        )}
                                        {errors[`service-${index}-price`] && (
                                            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[`service-${index}-price`]}</p>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addService}
                                    className="w-full py-3 border-2 border-dashed border-green-400 rounded-lg sm:rounded-xl text-green-600 hover:border-green-600 hover:bg-green-50 transition-all text-sm sm:text-base touch-manipulation"
                                >
                                    + Adaugă serviciu
                                </button>

                                {errors.services && (
                                    <p className="text-xs sm:text-sm text-red-600">{errors.services}</p>
                                )}
                            </div>

                            {/* Exemplu de servicii populare */}
                            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                <p className="text-xs sm:text-sm text-gray-700">
                                    <strong>Servicii populare:</strong> Consultație inițială (60 min), Monitorizare (30 min), Pachet lunar (4 consultații), Plan alimentar personalizat
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Terms */}
                    {currentStep === 6 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 animate-fadeIn">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Aproape gata! 🎉
                            </h2>

                            <div className="space-y-4 sm:space-y-6">
                                {/* Summary */}
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Rezumatul contului tău:</h3>
                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nume:</span>
                                            <span className="font-medium">{formData.fullName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-xs sm:text-sm break-all">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Telefon:</span>
                                            <span className="font-medium">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Specializări:</span>
                                            <span className="font-medium">{formData.specializations.length} selectate</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Servicii:</span>
                                            <span className="font-medium">{formData.services.length} configurate</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Next steps */}
                                <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-3 text-sm sm:text-base">Ce urmează după înregistrare:</h3>
                                    <ul className="space-y-2 text-xs sm:text-sm text-green-700">
                                        <li>✓ Vei primi un email de confirmare imediat</li>
                                        <li>✓ Poți începe să-ți completezi profilul, adăugând poză și documente</li>
                                        <li>✓ După încărcarea documentelor, îți vom revizui profilul în cel mai scurt timp</li>
                                    </ul>
                                </div>

                                {/* Terms */}
                                <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                    <label className="flex items-start cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.termsAccepted}
                                            onChange={(e) => updateField('termsAccepted', e.target.checked)}
                                            className="mt-0.5 sm:mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                        />
                                        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700">
                                            Accept <Link href="/termeni"><span className="text-green-600 hover:underline">Termenii și Condițiile</span></Link> și{' '}
                                            <Link href="/confidentialitate"><span className="text-green-600 hover:underline">Politica de Confidențialitate</span></Link>.
                                            Înțeleg că datele mele vor fi verificate și profilul va deveni public.
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.terms}</p>
                                    )}
                                </div>

                                {/* General error display */}
                                {errors.general && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                        <p className="text-xs sm:text-sm text-red-600">{errors.general}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation - Fixed on mobile */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:mt-8">
                        <div className="flex justify-between items-center max-w-2xl mx-auto">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors touch-manipulation"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="text-sm sm:text-base">Înapoi</span>
                                </button>
                            )}

                            {currentStep < TOTAL_STEPS ? (
                                <button
                                    onClick={handleNext}
                                    className="ml-auto bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base touch-manipulation"
                                >
                                    Continuă
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`ml-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base touch-manipulation ${isSubmitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span className="hidden sm:inline">Se creează contul...</span>
                                            <span className="sm:hidden">Creează...</span>
                                        </>
                                    ) : (
                                        <>
                                            Creează cont
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Help footer - Hidden on mobile when nav is fixed */}
                <div className="text-center py-8 text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Ai nevoie de ajutor?
                    <Link href="/contact">
                        <span className="text-green-600 hover:text-green-700 ml-1 cursor-pointer">Contactează-ne</span>
                    </Link>
                </div>
            </div>

            {/* <Footer /> */}
        </>
    )
}