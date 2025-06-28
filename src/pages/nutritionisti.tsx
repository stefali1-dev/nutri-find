import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Image from 'next/image'

// Calculator de venit - Mobile optimized
function IncomeCalculator() {
    const [clients, setClients] = useState(10)
    const [pricePerSession, setPricePerSession] = useState(150)
    const [sessionsPerClient, setSessionsPerClient] = useState(4)

    const monthlyIncome = clients * pricePerSession * sessionsPerClient
    const yearlyIncome = monthlyIncome * 12

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                Calculează-ți potențialul de câștig
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Clienți noi pe lună
                    </label>
                    <div className="relative pt-6">
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={clients}
                            onChange={(e) => setClients(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap">
                            {clients}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Preț per consultație (RON)
                    </label>
                    <div className="relative pt-6">
                        <input
                            type="range"
                            min="100"
                            max="300"
                            step="10"
                            value={pricePerSession}
                            onChange={(e) => setPricePerSession(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap">
                            {pricePerSession}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Consultații per client
                    </label>
                    <div className="relative pt-6">
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={sessionsPerClient}
                            onChange={(e) => setSessionsPerClient(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap">
                            {sessionsPerClient}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Venit lunar estimat</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{monthlyIncome.toLocaleString()} RON</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Venit anual estimat</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{yearlyIncome.toLocaleString()} RON</p>
                    </div>
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-xs sm:text-sm text-green-700 font-medium">
                        💚 Fără taxe de platformă în faza de lansare!
                    </p>
                </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    *Calculele sunt orientative și bazate pe date din piață
                </p>
                <Link href="/nutritionisti/onboarding">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                        Vreau să încep să câștig!
                    </button>
                </Link>
            </div>
        </div>
    )
}

// New component for live stats
function LiveStats() {
    return (
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-4 text-center text-white">
                    <div>
                        <div className="text-2xl sm:text-3xl font-bold">127</div>
                        <div className="text-xs sm:text-sm opacity-90">Nutriționiști activi</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-bold">2,450+</div>
                        <div className="text-xs sm:text-sm opacity-90">Clienți înregistrați</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-bold">4.8★</div>
                        <div className="text-xs sm:text-sm opacity-90">Rating mediu</div>
                    </div>
                </div>
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
            answer: "NutriFind este complet gratuit pentru nutriționiști în faza de lansare. Planificăm ca, în următoarele 6–12 luni, să aplicăm un comision de 10% doar consultațiilor care aduc venit prin platformă, pentru a susține costurile operaționale și promovarea ta. Vei fi anunțat cu mult timp înainte de orice schimbare, iar listarea de bază va rămâne mereu gratuită."
        },
        {
            question: "Cât timp durează procesul de verificare?",
            answer: "Procesul de verificare durează maximum 24 de ore. Verificăm diplomele și certificările pentru a ne asigura că toți nutriționiștii de pe platformă sunt profesioniști autentici."
        },
        {
            question: "Pot să îmi stabilesc propriile prețuri?",
            answer: "Da, absolut! Tu decizi prețurile pentru consultații. Recomandăm să verifici prețurile altor nutriționiști pentru a rămâne competitiv, dar decizia finală îți aparține."
        },
        {
            question: "Cum primesc plățile de la clienți?",
            answer: "Momentan, fiecare nutriționist își gestionează propriile plăți direct cu clientul (ex: transfer bancar, cash sau alte metode agreate). În viitor vom introduce un sistem de plată integrat în platformă."
        },
        {
            question: "Pot oferi consultații atât online cât și fizice?",
            answer: "Da! Poți alege să oferi consultații online (prin video call integrat), fizice (la cabinetul tău) sau ambele. Flexibilitatea este cheia succesului pe NutriFind."
        },
        {
            question: "Ce suport primesc după înscriere?",
            answer: "Primești acces la: ghid complet de optimizare profil, training gratuit despre marketing personal, suport tehnic dedicat, și acces la comunitatea exclusivă de nutriționiști NutriFind."
        }
    ]

    return (
        <>
            <Head>
                <title>Nutriționiști - Înscrie-te pe NutriFind | Platformă Profesională</title>
                <meta name="description" content="Dezvoltă-ți practica de nutriție cu NutriFind. Acces instant la clienți, unelte profesionale și suport dedicat. Înscrie-te gratuit astăzi!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                    scroll-padding-top: 80px;
                }
                
                @media (max-width: 640px) {
                    button, textarea, select {
                        min-height: 44px;
                    }
                    
                    input[type="text"],
                    input[type="email"],
                    input[type="tel"],
                    input[type="number"],
                    input[type="password"],
                    textarea,
                    select {
                        font-size: 16px !important;
                    }
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes pulse-border {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
                    }
                }

                .pulse-border {
                    animation: pulse-border 2s infinite;
                }
            `}</style>

            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <Image
                                    src="/images/logo.png"
                                    alt="NutriFind Logo"
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 sm:w-10 sm:h-10 mr-2"
                                    priority
                                />
                                <Link href="/">
                                    <span className="text-xl sm:text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition-colors">Beneficii</a>
                                <a href="#income-potential" className="text-gray-700 hover:text-green-600 transition-colors">Calculator Venit</a>
                                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">Cum funcționează</a>
                                <a href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">FAQ</a>
                                <Link href="/nutritionisti/onboarding">
                                    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 pulse-border">
                                        Începe acum
                                    </button>
                                </Link>
                                <Link href="/nutritionisti/login">
                                    <button className="cursor-pointer bg-transparent text-green-600 border border-green-600 px-6 py-2 rounded-full hover:bg-green-600 hover:text-white transition-all transform hover:scale-105">
                                        Login
                                    </button>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
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
                                <a
                                    href="#benefits"
                                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Beneficii
                                </a>
                                <a
                                    href="#income-potential"
                                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Calculator Venit
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Cum funcționează
                                </a>
                                <a
                                    href="#faq"
                                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    FAQ
                                </a>
                                <Link href="/nutritionisti/onboarding">
                                    <button
                                        className="w-full mt-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Începe acum
                                    </button>
                                </Link>
                                <Link href="/nutritionisti/login">
                                    <button
                                        className="w-full mt-2 bg-transparent text-green-600 border border-green-600 px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Live Stats Bar */}
                {/* <LiveStats /> */}

                {/* Hero Section */}
                <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-32 flex content-center items-center justify-center min-h-[70vh] sm:min-h-[80vh]">
                    <div className="absolute top-0 w-full h-full bg-gradient-to-br from-green-50 to-emerald-50"></div>

                    <div className="container relative mx-auto px-4">
                        <div className="items-center flex flex-wrap">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                                <div className="animate-fade-in">
                                    {/* New Badge */}
                                    <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6 text-sm font-medium">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Platforma este acum LIVE! Înscrie-te astăzi
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
                                        Dezvoltă-ți cariera în nutriție cu
                                        <span className="text-green-600"> NutriFind</span>
                                    </h1>
                                    <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
                                        Conectează-te instant cu clienți care caută servicii de nutriție profesionistă.
                                        <strong> Fără costuri de înscriere</strong> - construiește-ți portofoliul și dezvoltă-ți afacerea în propriul ritm.
                                    </p>

                                    {/* Trust Indicators */}
                                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verificare în 24h
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Anulare oricând
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Suport dedicat
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                                        <Link href="/nutritionisti/onboarding">
                                            <button className="w-full sm:w-auto bg-green-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg pulse-border">
                                                Înscrie-te gratuit acum
                                            </button>
                                        </Link>
                                        <Link href="/nutritionisti/login">
                                            <button className="w-full sm:w-auto cursor-pointer bg-white text-green-600 border-2 border-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-green-50 transition-all">
                                                Accesează contul
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-16 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Cum funcționează?</h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                                Procesul este simplu și durează mai puțin de 30 de minute
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-green-600">1</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Creează-ți profilul</h3>
                                <p className="text-gray-600">Completează informațiile profesionale, încarcă diploma și adaugă poze reprezentative</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-green-600">2</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Verificare rapidă</h3>
                                <p className="text-gray-600">Echipa noastră verifică documentele în maxim 24 de ore și îți activează profilul</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-green-600">3</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Primește clienți</h3>
                                <p className="text-gray-600">Clienții te găsesc, rezervă consultații și tu te concentrezi pe ceea ce faci cel mai bine</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/nutritionisti/onboarding">
                                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg">
                                    Începe înscrierea acum →
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="py-16 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">De ce să alegi NutriFind?</h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                                Platforma construită special pentru nutriționiștii care vor să-și dezvolte practica - <strong>complet gratuit în faza de lansare</strong>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M12 7a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Clienți calificați</h3>
                                <p className="text-sm sm:text-base text-gray-600">Primești doar cereri de la oameni cu adevărat interesați de serviciile tale</p>
                            </div>

                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Gestionare simplificată</h3>
                                <p className="text-sm sm:text-base text-gray-600">Programări, facturi și comunicare cu clienții într-un singur loc</p>
                            </div>

                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Creștere sustenabilă</h3>
                                <p className="text-sm sm:text-base text-gray-600">Construiește-ți reputația cu recenzii verificate și un profil profesional</p>
                            </div>

                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Listare gratuită pe platformă</h3>
                                <p className="text-sm sm:text-base text-gray-600">Profilul tău complet, fără costuri de înregistrare</p>
                            </div>

                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Flexibilitate totală</h3>
                                <p className="text-sm sm:text-base text-gray-600">Lucrezi când vrei, cum vrei - online sau offline, la orele tale</p>
                            </div>

                            <div className="text-center group p-4">
                                <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Suport continuu</h3>
                                <p className="text-sm sm:text-base text-gray-600">Echipa noastră te ajută să optimizezi profilul și să atragi mai mulți clienți</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Income Calculator Section */}
                <section id="income-potential" className="py-16 sm:py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Cât poți câștiga cu NutriFind?</h2>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                                Ajustează parametrii pentru a vedea potențialul tău de câștig realist
                            </p>
                        </div>
                        <IncomeCalculator />
                    </div>
                </section>

                {/* Challenges Section - High Impact Design */}
                <section id="insights" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header with dramatic styling */}
                        <div className="text-center mb-12 sm:mb-20">
                            <div className="inline-flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4 text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Provocări comune în industrie
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                                Știm prin ce treci ca nutriționist
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                                Înțelegem provocările nutriționiștilor din România.
                                <span className="font-semibold text-gray-900"> Iată problemele comune</span> pe care le-am identificat în piață
                            </p>
                        </div>

                        {/* Main challenges grid with enhanced visual impact */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
                            {/* Challenge 1 - Finding Clients */}
                            <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start mb-4">
                                        <div className="bg-red-100 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                Găsirea clienților potriviți
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Mulți nutriționiști petrec ore întregi pe social media încercând să ajungă la clienții potriviți, dar rezultatele sunt imprevizibile
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Challenge 2 - Administrative Burden */}
                            <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start mb-4">
                                        <div className="bg-red-100 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                Haosul administrativ
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Programări prin telefon, facturi manuale, mesaje pe multiple platforme - timpul valoros se pierde cu munca de birou
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Challenge 3 - Building Credibility */}
                            <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start mb-4">
                                        <div className="bg-red-100 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                Construirea încrederii
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Fără recenzii verificate și un portofoliu vizibil, e dificil să convingi clienții noi că ești profesionistul potrivit
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Challenge 4 - Income Instability */}
                            <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start mb-4">
                                        <div className="bg-red-100 p-3 rounded-xl mr-4 group-hover:bg-red-200 transition-colors">
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                Venituri imprevizibile
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Fluctuațiile mari în numărul de clienți fac dificilă planificarea financiară și dezvoltarea sustenabilă a practicii
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-16 sm:py-20 bg-white">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Întrebări frecvente</h2>
                            <p className="text-base sm:text-lg text-gray-600 px-4">
                                Găsește răspunsuri la cele mai comune întrebări despre platforma noastră
                            </p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                                    <button
                                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors touch-manipulation"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-2">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                                            <p className="text-gray-600 text-sm sm:text-base">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-16 sm:py-20 bg-gradient-to-br from-green-600 to-emerald-700">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ești gata să-ți transformi cariera?
                        </h2>
                        <p className="text-lg sm:text-xl text-green-100 mb-8">
                            Alătură-te comunității de nutriționiști care își dezvoltă practica cu NutriFind
                        </p>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
                                <div>
                                    <div className="text-3xl font-bold mb-2">0 RON</div>
                                    <div className="text-sm opacity-90">Costuri de înscriere</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold mb-2">24h</div>
                                    <div className="text-sm opacity-90">Verificare profil</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold mb-2">∞</div>
                                    <div className="text-sm opacity-90">Potențial de creștere</div>
                                </div>
                            </div>
                        </div>

                        <Link href="/nutritionisti/onboarding">
                            <button className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                                Începe acum - Gratuit!
                            </button>
                        </Link>

                        <p className="mt-6 text-green-100 text-sm">
                            Nu necesită card de credit • Listare gratuită • Suport inclus
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}