import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'

// Componenta pentru formularul de waiting list pentru nutriționiști
type NutritionistWaitlistFormProps = {
    placement: string
    className?: string
}

function NutritionistWaitlistForm({ placement, className = "" }: NutritionistWaitlistFormProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Validare email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                throw new Error('Te rog să introduci o adresă de email validă')
            }

            console.log(`Submitting email: ${email} with placement: ${placement}`)
            // Insert new nutritionist subscriber
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert([
                    {
                        email: email,
                        feature_interested: 'nutritionist_platform',
                        source_page: router.pathname,
                        user_type: 'nutritionist',
                        placement: placement
                    }
                ])

            if (insertError) {
                if (insertError.code === '23505') { // Duplicate email
                    throw new Error('Această adresă de email este deja înregistrată!')
                }
                throw insertError
            }

            setIsSubmitted(true)
            setEmail('')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('A apărut o eroare neașteptată')
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
                <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Bine ai venit în echipa NutriFind!</h3>
                <p className="text-green-700">
                    Te-ai înscris cu succes! Vei primi acces prioritar la clienții potențiali și listare 100% gratuită.
                </p>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-2xl p-8 shadow-xl ${className}`}>
            <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Listare <span className="text-green-600">100% gratuită</span> pe platformă!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    <strong>100% gratuit. </strong>Primești promovare gratuită, listare completă și acces la clienți.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresa ta de email"
                        required
                        disabled={isLoading}
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                    />
                    <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg animate-shake">
                        <svg className="inline w-5 h-5 mr-2 -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Se înscrie...
                        </span>
                    ) : (
                        "Înscrie-mă gratuit!"
                    )}
                </button>

                <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>✅ Primești acces prioritar la cererile venite de la primii clienți care caută un nutriționist potrivit</p>
                    <p>✅ Ești liber(ă) să te retragi oricând. Nu există nicio obligație, iar listarea e complet gratuită</p>
                </div>
            </form>
        </div>
    )
}

// Calculator de venit
function IncomeCalculator() {
    const [clients, setClients] = useState(10)
    const [pricePerSession, setPricePerSession] = useState(150)
    const [sessionsPerClient, setSessionsPerClient] = useState(4)

    const monthlyIncome = clients * pricePerSession * sessionsPerClient
    const yearlyIncome = monthlyIncome * 12

    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Calculează-ți potențialul de câștig
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clienți noi pe lună
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={clients}
                            onChange={(e) => setClients(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                            {clients}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preț per consultație (RON)
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="100"
                            max="300"
                            step="10"
                            value={pricePerSession}
                            onChange={(e) => setPricePerSession(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-8 left-2/3 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                            {pricePerSession}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultații per client
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={sessionsPerClient}
                            onChange={(e) => setSessionsPerClient(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                            {sessionsPerClient}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Venit lunar estimat</p>
                        <p className="text-3xl font-bold text-green-600">{monthlyIncome.toLocaleString()} RON</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Venit anual estimat</p>
                        <p className="text-2xl font-bold text-green-600">{yearlyIncome.toLocaleString()} RON</p>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-green-700 font-medium">
                        💚 Fără taxe de platformă! Păstrezi 100% din veniturile tale
                    </p>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                    *Calculele sunt orientative și bazate pe date din piață
                </p>
                <Link href="#waitlist-final">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                        Vreau să încep să câștig!
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default function NutritionistsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    const faqs = [
        {
            question: "Cât costă să mă înscriu pe platformă?",
            answer: "Înscrierea și listarea pe NutriFind sunt 100% GRATUITE! Nu aplicăm niciun comision pentru consultațiile tale. Păstrezi întreaga sumă pe care o încasezi de la clienți. În viitor, vom introduce opțiuni premium opționale, dar listarea de bază va rămâne gratuită."
        },
        {
            question: "Cât timp durează procesul de verificare?",
            answer: "Procesul de verificare durează între 24-48 de ore. Verificăm diplomele și certificările pentru a ne asigura că toți nutriționiștii de pe platformă sunt profesioniști autentici."
        },
        {
            question: "Pot să îmi stabilesc propriile prețuri?",
            answer: "Da, absolut! Tu decizi prețurile pentru consultații. Recomandăm să verifici prețurile altor nutriționiști pentru a rămâne competitiv, dar decizia finală îți aparține."
        },
        {
            question: "Cum primesc plățile de la clienți?",
            answer: "Inițial, gestionezi plățile direct cu clienții tăi (transfer bancar, cash, etc.). În viitor, vom oferi și opțiuni de plată prin platformă ca funcție premium opțională."
        },
        {
            question: "Pot oferi consultații atât online cât și fizice?",
            answer: "Da! Poți alege să oferi consultații online (prin video call), fizice (la cabinetul tău) sau ambele. Flexibilitatea este cheia succesului pe NutriFind."
        },
        {
            question: "Ce se întâmplă dacă vreau să mă retrag de pe platformă?",
            answer: "Ești complet liber(ă) să te retragi oricând. Nu există contracte sau obligații. Poți să-ți ștergi profilul în orice moment fără niciun cost sau penalizare."
        }
    ]

    return (
        <>
            <Head>
                <title>Nutriționiști - Înscrie-te GRATUIT pe NutriFind</title>
                <meta name="description" content="Dezvoltă-ți practica de nutriție cu NutriFind. Listare 100% gratuită, găsește clienți noi și gestionează programările fără taxe." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <Link href="/">
                                    <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition-colors">Beneficii</a>
                                <a href="#income-potential" className="text-gray-700 hover:text-green-600 transition-colors">Calculator Venit</a>
                                <a href="#insights" className="text-gray-700 hover:text-green-600 transition-colors">Interviuri</a>
                                <a href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">FAQ</a>
                                <Link href="#waitlist-final">
                                    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                                        Înscrie-te gratuit
                                    </button>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-gray-700 hover:text-green-600 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white border-t border-gray-100">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-green-600">Beneficii</a>
                                <a href="#income-potential" className="block px-3 py-2 text-gray-700 hover:text-green-600">Calculator Venit</a>
                                <a href="#insights" className="block px-3 py-2 text-gray-700 hover:text-green-600">Interviuri</a>
                                <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-green-600">FAQ</a>
                                <Link href="#waitlist-final">
                                    <button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                                        Înscrie-te gratuit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[80vh]">
                    <div className="absolute top-0 w-full h-full bg-gradient-to-br from-green-50 to-emerald-50"></div>

                    <div className="container relative mx-auto px-4">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                <div className="animate-fade-in">
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                                        Dezvoltă-ți cariera în nutriție cu
                                        <span className="text-green-600"> NutriFind</span>
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                        Conectează-te cu mii de clienți potențiali care caută servicii de nutriție profesionistă.
                                        <strong> Listare 100% gratuită</strong> - construiește-ți portofoliul, stabilește-ți propriile prețuri și dezvoltă-ți afacerea în propriul ritm.
                                    </p>
                                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="#waitlist-hero">
                                            <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                                                Înscrie-te gratuit acum
                                            </button>
                                        </Link>
                                        <Link href="#income-potential">
                                            <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-full text-lg hover:bg-green-50 transition-all">
                                                Vezi potențialul de câștig
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prima secțiune de înregistrare */}
                <section id="waitlist-hero" className="py-16 bg-gradient-to-r from-green-500 to-emerald-600">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-white md:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Fii printre primii nutriționiști pe platformă!</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center text-green-100">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Listare și promovare 100% gratuită</span>
                                    </div>
                                    <div className="flex items-center text-green-100">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Suport dedicat pentru configurarea profilului</span>
                                    </div>
                                    <div className="flex items-center text-green-100">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Acces prioritar la primii clienți înregistrați</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <NutritionistWaitlistForm
                                    placement="hero_section"
                                    className="transform hover:-translate-y-1 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">De ce să alegi NutriFind?</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Platforma construită special pentru nutriționiștii care vor să-și dezvolte practica - <strong>complet gratuit</strong>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M12 7a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Clienți calificați</h3>
                                <p className="text-gray-600">Primești doar cereri de la oameni cu adevărat interesați de serviciile tale</p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Gestionare simplificată</h3>
                                <p className="text-gray-600">Programări, facturi și comunicare cu clienții într-un singur loc</p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Creștere sustenabilă</h3>
                                <p className="text-gray-600">Construiește-ți reputația cu recenzii verificate și un profil profesional</p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fără taxe sau comisioane</h3>
                                <p className="text-gray-600">Păstrezi 100% din veniturile tale - nu aplicăm niciun comision</p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Flexibilitate totală</h3>
                                <p className="text-gray-600">Lucrezi când vrei, cum vrei - online sau offline, la orele tale</p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Suport continuu</h3>
                                <p className="text-gray-600">Echipa noastră te ajută să optimizezi profilul și să atragi mai mulți clienți</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Income Calculator Section */}
                <section id="income-potential" className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Cât poți câștiga cu NutriFind?</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Ajustează parametrii pentru a vedea potențialul tău de câștig realist - <strong>fără niciun comision de la noi!</strong>
                            </p>
                        </div>
                        <IncomeCalculator />
                    </div>
                </section>

                {/* Interviuri Section */}
                <section id="insights" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ce ne spun nutriționiștii</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Am vorbit cu nutriționiști din România despre provocările lor în găsirea și menținerea clienților
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border">
                                <div className="flex items-center mb-4">
                                    <Image
                                        src="/images/interviews/4.png"
                                        alt="Ana"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold">Ana, 29 ani</p>
                                        <p className="text-sm text-gray-500">Nutriționist Dietetician</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Cea mai mare provocare e să găsesc clienți noi. Postez pe social media, dar e greu să ajung la oamenii potriviți. Aș avea nevoie de o platformă unde să mă pot promova profesional."
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border">
                                <div className="flex items-center mb-4">
                                    <Image
                                        src="/images/interviews/5.png"
                                        alt="Mihaela"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold">Mihaela, 34 ani</p>
                                        <p className="text-sm text-gray-500">Nutriționist Dietetician</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Administrația consumă mult timp - programări, facturi, urmărirea progresului clienților. Mi-ar plăcea o soluție care să automatizeze toate astea."
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg border">
                                <div className="flex items-center mb-4">
                                    <Image
                                        src="/images/interviews/6.png"
                                        alt="Laura"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold">Laura, 26 ani</p>
                                        <p className="text-sm text-gray-500">Absolventă</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "Sunt la început de carieră și e dificil să construiesc încrederea clienților. Nu am un portofoliu mare de cazuri de succes și nu știu cum să mă promovez eficient."
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 bg-gray-50 p-8 rounded-xl max-w-4xl mx-auto">
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                                    Principalele provocări identificate:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    <div className="flex items-start">
                                        <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Dificultatea în găsirea clienților</p>
                                            <p className="text-sm text-gray-600">78% cheltuie prea mult timp cu marketingul</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Gestionarea administrativă</p>
                                            <p className="text-sm text-gray-600">Programări, facturi și comunicare dezorganizate</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Construirea credibilității</p>
                                            <p className="text-sm text-gray-600">Greu să demonstrezi expertiza fără un portofoliu solid</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
                                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Venituri inconsistente</p>
                                            <p className="text-sm text-gray-600">Lipsă de predictibilitate în numărul de clienți</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <p className="text-green-800 font-medium">
                                        💡 <strong>Soluția NutriFind:</strong> Rezolvăm toate aceste probleme într-o singură platformă gratuită
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 bg-white">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Întrebări frecvente</h2>
                            <p className="text-lg text-gray-600">
                                Găsește răspunsuri la cele mai comune întrebări despre platforma noastră
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg">
                                    <button
                                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="font-semibold text-gray-800">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform ${openFaq === index ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final Waitlist Section */}
                <section id="waitlist-final" className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Ready să-ți transformi cariera?
                            </h2>
                            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                                Alătură-te primilor nutriționiști pe platformă și beneficiază de listare 100% gratuită plus promovare prioritară
                            </p>

                            <div className="inline-flex items-center justify-center bg-yellow-50 text-yellow-800 px-6 py-3 rounded-full mb-8 animate-bounce">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                                <span className="font-bold">Primii înscriși primesc acces prioritar la clienți!</span>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm p-1 rounded-2xl">
                            <NutritionistWaitlistForm
                                placement="final_cta"
                                className="bg-white rounded-2xl shadow-xl"
                            />
                        </div>

                        <div className="text-center mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                <div className="text-green-100">
                                    <div className="text-2xl font-bold">100%</div>
                                    <div className="text-sm">complet gratuit</div>
                                </div>
                                <div className="text-green-100">
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm">taxe sau comisioane</div>
                                </div>
                                <div className="text-green-100">
                                    <div className="text-2xl font-bold">24/7</div>
                                    <div className="text-sm">suport dedicat</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-10">
                            <p className="text-green-100">
                                <svg className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Datele tale sunt protejate și nu vor fi partajate cu terți.</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}