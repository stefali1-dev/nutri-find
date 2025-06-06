import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

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
        if (!validateCurrentStep()) { // Validează ultimul pas înainte de submit
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setErrors({}); // Resetează erorile la fiecare încercare de submit

        try {
            // Pasul 1: Înregistrează utilizatorul în Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) {
                if (signUpError.message.toLowerCase().includes("user already registered") || signUpError.message.toLowerCase().includes("already exists")) {
                    setErrors(prev => ({ ...prev, email: 'Acest email este deja înregistrat.' }));
                    setCurrentStep(1); // Revino la pasul cu email/parolă
                } else {
                    console.error('Sign up error:', signUpError);
                    setErrors(prev => ({ ...prev, general: `Eroare la crearea contului: ${signUpError.message}` }));
                }
                setIsSubmitting(false);
                return;
            }

            if (!authData.user) {
                // Acest caz poate apărea dacă ai confirmarea pe email activată și utilizatorul nu este returnat imediat.
                // Sau dacă sesiunea nu este returnată (authData.session poate fi null)
                alert('Cont creat! Dacă este necesară confirmarea pe email, te rugăm să verifici inbox-ul înainte de a te loga.');
                // Poți redirecționa către o pagină de "verifică email" sau login.
                // De obicei, Supabase te loghează automat după signUp dacă nu e necesară confirmarea,
                // deci authData.user ar trebui să existe.
                // Dacă ai confirmarea activată, session va fi null și user va avea datele.
                // router.push('/login'); // Sau o pagină dedicată
                setIsSubmitting(false); // S-ar putea să vrei să gestionezi fluxul de confirmare email
                return;
            }

            // Pasul 2: Pregătește datele pentru inserția în tabelul 'nutritionists'
            // NOTĂ: Asigură-te că ai adăugat câmpul license_number în interfața FormData și în formular.
            // Coloana password_hash NU mai este necesară în tabelul nutritionists dacă folosești user_id.
            const nutritionistPayload = {
                user_id: authData.user.id, // ID-ul utilizatorului din Supabase Auth
                email: formData.email,
                full_name: formData.fullName,
                phone: formData.phone,
                specializations: formData.specializations,
                years_experience: formData.experience,
                consultation_types: formData.consultationTypes,
                bio: formData.bio,
                languages: formData.languages,
                location: formData.location,
                services: formData.services,
                // Logică îmbunătățită pentru work_types, presupunând că valorile din consultationTypes sunt mapabile
                work_types: formData.consultationTypes.map(type => type.toLowerCase().includes('online') ? 'online' : 'clinic').filter((value, index, self) => self.indexOf(value) === index), // elimină duplicatele
                verification_status: 'pending',
                account_status: 'active',
                subscription_plan: 'free', // Sau alt plan implicit
                // license_number: formData.license_number || 'NECOMPLETAT', // Important: asigură-te că gestionezi acest câmp. 'NECOMPLETAT' dacă e permis NULL, altfel trebuie să fie din form.
                // Alte câmpuri din tabelul nutritionists care au valori default sau pot fi null la început:
                // birth_date: null, gender: null, profile_photo_url: null, education: '[]', certifications: '[]',
                // work_days: '{}', work_hours: '{"start": "09:00", "end": "18:00"}', consultation_duration: 60,
                // documents_uploaded: '{"diploma": false, "license": false, "insurance": false}'
            };

            // Pasul 3: Inserează profilul nutriționistului
            const { data: nutritionistProfile, error: insertProfileError } = await supabase
                .from('nutritionists')
                .insert([nutritionistPayload])
                .select() // Pentru a returna datele inserate, inclusiv ID-ul generat al profilului
                .single();

            if (insertProfileError) {
                console.error('Error inserting nutritionist profile:', insertProfileError);
                // Dacă inserția profilului eșuează, ideal ar fi să ștergi utilizatorul creat în Auth pentru a evita conturi orfane.
                // Aceasta necesită o funcție de server (Supabase Edge Function) cu privilegii de admin,
                // deoarece ștergerea utilizatorilor nu se poate face direct din client cu `supabase.auth.admin.deleteUser()`.
                // Pentru moment, informează utilizatorul.
                setErrors(prev => ({ ...prev, general: `Profilul nu a putut fi creat după înregistrarea contului. Te rugăm să contactezi suportul. (${insertProfileError.message})` }));
                setIsSubmitting(false);
                return;
            }

            // Pasul 4: Succes! Salvează informații în sesiune și redirecționează
            if (nutritionistProfile) { // Verifică dacă nutritionistProfile nu e null
                 sessionStorage.setItem('nutritionistId', nutritionistProfile.id); // ID-ul profilului din tabelul nutritionists
                 sessionStorage.setItem('nutritionistEmail', nutritionistProfile.email);
                 // Poate vrei să salvezi și user_id din authData.user.id dacă e util în frontend
                 // sessionStorage.setItem('userId', authData.user.id);
                 router.push(`/nutritionists/${nutritionistProfile.id}/edit`);
            } else {
                // Ceva neașteptat, profilul nu a fost returnat
                console.error('Nutritionist profile data was null after insert.');
                setErrors(prev => ({ ...prev, general: 'Eroare la finalizarea înregistrării. Profilul nu a fost returnat.' }));
                setIsSubmitting(false);
            }

        } catch (error: any) {
            console.error('General error in handleSubmit:', error);
            setErrors(prev => ({ ...prev, general: `A apărut o eroare neașteptată: ${error.message}` }));
            setIsSubmitting(false);
        }
        // Nu mai este nevoie de setIsSubmitting(false) aici dacă e acoperit în toate ramurile try/catch/if
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
                <title>Înregistrare Nutriționist - NutriConnect</title>
                <meta name="description" content="Alătură-te comunității de nutriționiști profesioniști" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
                {/* Header simplu */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/">
                            <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
                        </Link>
                        <Link href="/nutritionist/login">
                            <span className="text-green-600 hover:text-green-700 cursor-pointer">
                                Ai deja cont? Conectează-te
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Progress bar */}
                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                <div className="max-w-2xl mx-auto px-4 py-8">
                    {/* Step 1: Account */}
                    {currentStep === 1 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Bun venit în familia NutriConnect! 🌟
                                </h1>
                                <p className="text-gray-600">
                                    Creează-ți contul în doar câteva minute
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email profesional
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="email@exemplu.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                                            className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                            placeholder="Minim 8 caractere"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}

                                    {/* Password strength indicator */}
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className={`text-sm ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Minim 8 caractere
                                            </div>
                                            <div className={`text-sm ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Cel puțin o literă mare
                                            </div>
                                            <div className={`text-sm ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                                ✓ Cel puțin o cifră
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Benefits box */}
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-3">
                                        Ce primești gratuit:
                                    </h3>
                                    <ul className="space-y-2 text-sm text-green-700">
                                        <li>✓ Primele 3 luni fără costuri</li>
                                        <li>✓ Acces la mii de clienți potențiali</li>
                                        <li>✓ Dashboard profesional complet</li>
                                        <li>✓ Suport dedicat 24/7</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Info */}
                    {currentStep === 2 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Informații personale 👤
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nume complet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="ex: Dr. Maria Popescu"
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
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
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="07XX XXX XXX"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                                    💡 <strong>Sfat:</strong> Folosește datele reale. Clienții apreciază transparența și profesionalismul.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Professional Info */}
                    {currentStep === 3 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Expertiza ta 🏥
                            </h2>

                            <div className="space-y-6">
                                {/* Specializations */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Specializări (alege toate care se aplică)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            'Slăbire sănătoasă',
                                            'Nutriție sportivă',
                                            'Diabet',
                                            'Nutriție pediatrică',
                                            'Sarcină și alăptare',
                                            'Vegetarian/Vegan',
                                            'Alergii alimentare',
                                            'Nutriție clinică'
                                        ].map((spec) => (
                                            <label
                                                key={spec}
                                                className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.specializations.includes(spec)
                                                        ? 'border-green-600 bg-green-50'
                                                        : 'border-gray-200 hover:border-green-400'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.specializations.includes(spec)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            updateField('specializations', [...formData.specializations, spec])
                                                        } else {
                                                            updateField('specializations', formData.specializations.filter(s => s !== spec))
                                                        }
                                                    }}
                                                    className="sr-only"
                                                />
                                                <span className="text-sm">{spec}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.specializations && (
                                        <p className="mt-1 text-sm text-red-600">{errors.specializations}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Experiență profesională
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: '0-2', label: '0-2 ani' },
                                            { value: '2-5', label: '2-5 ani' },
                                            { value: '5-10', label: '5-10 ani' },
                                            { value: '10+', label: 'Peste 10 ani' }
                                        ].map((exp) => (
                                            <button
                                                key={exp.value}
                                                type="button"
                                                onClick={() => updateField('experience', exp.value)}
                                                className={`p-3 rounded-xl border-2 transition-all ${formData.experience === exp.value
                                                        ? 'border-green-600 bg-green-50'
                                                        : 'border-gray-200 hover:border-green-400'
                                                    }`}
                                            >
                                                {exp.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.experience && (
                                        <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                                    )}
                                </div>

                                {/* Consultation Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tipuri de consultații
                                    </label>
                                    <div className="space-y-3">
                                        {[
                                            { value: 'online', label: 'Online', icon: '💻' },
                                            { value: 'cabinet', label: 'La cabinet', icon: '🏢' },
                                            { value: 'domiciliu', label: 'La domiciliu', icon: '🏠' }
                                        ].map((type) => (
                                            <label
                                                key={type.value}
                                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.consultationTypes.includes(type.value)
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
                                                <span className="text-2xl mr-3">{type.icon}</span>
                                                <span className="font-medium">{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.consultationTypes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.consultationTypes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Profile */}
                    {currentStep === 4 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Profilul tău public 📝
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Despre tine
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => updateField('bio', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.bio ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        rows={6}
                                        placeholder="Spune clienților despre experiența ta, abordarea ta și ce te face special..."
                                    />
                                    <div className="mt-1 text-sm text-gray-500">
                                        {formData.bio.length}/50 caractere minime
                                    </div>
                                    {errors.bio && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                    )}
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
                                                className={`px-4 py-2 rounded-full border-2 transition-all ${formData.languages.includes(lang)
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Locație
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        placeholder="ex: București, Sector 1"
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Services */}
                    {currentStep === 5 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Servicii și prețuri 💰
                            </h2>

                            <div className="space-y-4">
                                {formData.services.map((service, index) => (
                                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                value={service.name}
                                                onChange={(e) => {
                                                    const newServices = [...formData.services]
                                                    newServices[index].name = e.target.value
                                                    updateField('services', newServices)
                                                }}
                                                placeholder="Nume serviciu"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    value={service.duration}
                                                    onChange={(e) => {
                                                        const newServices = [...formData.services]
                                                        newServices[index].duration = e.target.value
                                                        updateField('services', newServices)
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {errors[`service-${index}-name`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`service-${index}-name`]}</p>
                                        )}
                                        {errors[`service-${index}-price`] && (
                                            <p className="mt-1 text-sm text-red-600">{errors[`service-${index}-price`]}</p>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addService}
                                    className="w-full py-3 border-2 border-dashed border-green-400 rounded-xl text-green-600 hover:border-green-600 hover:bg-green-50 transition-all"
                                >
                                    + Adaugă serviciu
                                </button>

                                {errors.services && (
                                    <p className="text-sm text-red-600">{errors.services}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Terms */}
                    {currentStep === 6 && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Aproape gata! 🎉
                            </h2>

                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Rezumatul contului tău:</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nume:</span>
                                            <span className="font-medium">{formData.fullName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{formData.email}</span>
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

                                {/* Benefits reminder */}
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-3">Ce urmează:</h3>
                                    <ul className="space-y-2 text-sm text-green-700">
                                        <li>✓ Contul tău va fi activat instant</li>
                                        <li>✓ Vei primi primii clienți în 24-48 ore</li>
                                        <li>✓ Echipa noastră te va contacta pentru suport</li>
                                        <li>✓ Primele 3 luni sunt complet gratuite</li>
                                    </ul>
                                </div>

                                {/* Terms */}
                                <div className="border-2 border-gray-200 rounded-xl p-4">
                                    <label className="flex items-start cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.termsAccepted}
                                            onChange={(e) => updateField('termsAccepted', e.target.checked)}
                                            className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">
                                            Accept <Link href="/terms"><button className="text-green-600 hover:underline">Termenii și Condițiile</button></Link> și{' '}
                                            <Link href="/privacy"><button className="text-green-600 hover:underline">Politica de Confidențialitate</button></Link>.
                                            Înțeleg că datele mele vor fi verificate și profilul va deveni public.
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
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

                        {currentStep < TOTAL_STEPS ? (
                            <button
                                onClick={handleNext}
                                className="ml-auto bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                Continuă
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`ml-auto px-8 py-3 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 ${isSubmitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Se creează contul...
                                    </>
                                ) : (
                                    <>
                                        Creează cont
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Help footer */}
                <div className="text-center py-8 text-sm text-gray-600">
                    Ai nevoie de ajutor?
                    <Link href="/contact">
                        <button className="text-green-600 hover:text-green-700 ml-1">Contactează-ne</button>
                    </Link>
                </div>
            </div>

            <style jsx>{`
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
      `}</style>
        </>
    )
}