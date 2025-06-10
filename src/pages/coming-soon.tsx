import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function ComingSoon() {
    const router = useRouter()
    const [userType, setUserType] = useState<'nutritionist' | 'client' | null>(null)

    // Setează tipul de utilizator din query param
    useEffect(() => {
        if (router.isReady) {
            const type = router.query.for as 'nutritionist' | 'client'
            setUserType(type || 'nutritionist') // Default la nutritionist dacă nu e specificat
        }
    }, [router.isReady, router.query])

    if (userType === 'nutritionist') {
        return <NutritionistComingSoon />
    } else if (userType === 'client') {
        return <ClientComingSoon />
    } else {
        return <NutritionistComingSoon />
    }
}

// Componenta comuna pentru header
function PageHeader() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/">
                    <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
                </Link>
                <Link href="/">
                    <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Înapoi
                    </button>
                </Link>
            </div>
        </header>
    )
}

// Componenta comuna pentru mesajul de mulțumire
function ThankYouMessage({ userType }: { userType: 'nutritionist' | 'client' }) {
    const message = userType === 'nutritionist'
        ? "Te vom anunța imediat ce lansăm platforma pentru nutriționiști. Pregătește-te să îți dezvolți practica!"
        : "Te vom anunța imediat ce lansăm platforma. Vei putea găsi nutriționiști potriviți nevoilor tale și rezerva consultații online."

    return (
        <>
            <Head>
                <title>Mulțumim! - NutriFind</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Ești pe listă! 🎉
                    </h1>

                    <p className="text-gray-600 mb-8">
                        {message}
                    </p>

                    <Link href="/">
                        <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all">
                            Înapoi la pagina principală
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}

// Componenta pentru nutriționisti
function NutritionistComingSoon() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')
    const [totalCount, setTotalCount] = useState<number | null>(null)

    useEffect(() => {
        // Definim funcția simplă care preia numărul total
        async function fetchTotalWaitlistCount() {
            // { count: 'exact', head: true } este metoda eficientă de a număra rândurile
            const { count, error } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error('Error fetching total waitlist count:', error);
            } else {
                setTotalCount(count);
            }
        }

        // Apelăm funcția
        fetchTotalWaitlistCount();
    }, []); // [] asigură că funcția se execută o singură dată

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email
        if (!email) {
            setError('Te rugăm să introduci o adresă de email')
            return
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Te rugăm să introduci o adresă de email validă')
            return
        }

        setIsLoading(true)

        try {
            // Check if email already exists
            const { data: existing } = await supabase
                .from('waitlist')
                .select('id')
                .eq('email', email)
                .eq('user_type', 'nutritionist')
                .single()

            if (existing) {
                setError('Acest email este deja înregistrat!')
                setIsLoading(false)
                return
            }

            // Insert new subscriber
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert([
                    {
                        email: email,
                        feature_interested: 'nutritionist_platform',
                        source_page: router.pathname,
                        user_type: 'nutritionist'
                    }
                ])

            if (insertError) throw insertError

            // Success!
            setIsSubscribed(true)
            setEmail('')
        } catch (error) {
            console.error('Error:', error)
            setError('A apărut o eroare. Te rugăm să încerci din nou.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubscribed) {
        return <ThankYouMessage userType="nutritionist" />
    }

    return (
        <>
            <Head>
                <title>În Curând - Portal Nutriționiști | NutriFind</title>
                <meta name="description" content="Alătură-te listei de așteptare pentru portalul nutriționiștilor" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
                <PageHeader />

                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Lansare în curând
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                Portalul pentru nutriționiști vine în
                                <span className="text-green-600"> curând</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8">
                                Pregătim platforma completă pentru nutriționiști - de la gestionarea
                                clienților până la tools-uri profesionale de planificare nutrițională.
                            </p>

                            {/* Features preview */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Dashboard profesional</h3>
                                        <p className="text-gray-600 text-sm">Gestionează programări, clienți și venituri într-un singur loc</p>
                                    </div>
                                </div>


                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Primele 3 luni gratuite</h3>
                                        <p className="text-gray-600 text-sm">Pentru toți nutriționiștii înscriși înainte de lansare</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{(totalCount ?? 0) + 15}</div>
                                    <div className="text-sm text-gray-600">Nutriționiști înscriși</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">T2 2025</div>
                                    <div className="text-sm text-gray-600">Lansare estimată</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">100%</div>
                                    <div className="text-sm text-gray-600">Românesc</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Waitlist Form */}
                        <div className="lg:pl-12">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Fii printre primii! 🚀
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Înscrie-te pentru acces prioritar și 3 luni gratuite
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email profesional
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="nutritionist@exemplu.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            disabled={isLoading}
                                        />
                                        {error && (
                                            <p className="mt-2 text-sm text-red-600">{error}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 rounded-xl font-medium transition-all ${isLoading
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Se înregistrează...
                                            </span>
                                        ) : (
                                            'Înscrie-mă pe lista de așteptare'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center">
                                        🔒 Nu trimitem spam
                                    </p>
                                </div>

                                {/* Social proof */}
                                <div className="mt-6 flex items-center justify-center gap-1">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white"
                                                style={{
                                                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=User${i})`,
                                                    backgroundSize: 'cover'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 ml-3">
                                        +{(totalCount ?? 0) + 15} nutriționiști așteaptă lansarea
                                    </p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-2">Ai întrebări?</p>
                                <a href="mailto:contact@nutrifind.ro" className="text-green-600 hover:text-green-700 font-medium">
                                    contact@nutrifind.ro
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// Componenta pentru clienti
function ClientComingSoon() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [error, setError] = useState('')
    const [totalCount, setTotalCount] = useState<number | null>(null)

    useEffect(() => {
        // Definim funcția simplă care preia numărul total
        async function fetchTotalWaitlistCount() {
            // { count: 'exact', head: true } este metoda eficientă de a număra rândurile
            const { count, error } = await supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error('Error fetching total waitlist count:', error);
            } else {
                setTotalCount(count);
            }
        }
        fetchTotalWaitlistCount()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email
        if (!email) {
            setError('Te rugăm să introduci o adresă de email')
            return
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Te rugăm să introduci o adresă de email validă')
            return
        }

        setIsLoading(true)

        try {
            // Check if email already exists
            const { data: existing } = await supabase
                .from('waitlist')
                .select('id')
                .eq('email', email)
                .eq('user_type', 'client')
                .single()

            if (existing) {
                setError('Acest email este deja înregistrat!')
                setIsLoading(false)
                return
            }

            // Insert new subscriber
            const { error: insertError } = await supabase
                .from('waitlist')
                .insert([
                    {
                        email: email,
                        feature_interested: 'client_platform',
                        source_page: router.pathname,
                        user_type: 'client'
                    }
                ])

            if (insertError) throw insertError

            // Success!
            setIsSubscribed(true)
            setEmail('')
        } catch (error) {
            console.error('Error:', error)
            setError('A apărut o eroare. Te rugăm să încerci din nou.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubscribed) {
        return <ThankYouMessage userType="client" />
    }

    return (
        <>
            <Head>
                <title>În Curând - Platformă pentru Clienți | NutriFind</title>
                <meta name="description" content="Alătură-te listei de așteptare pentru platforma de nutriție" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
                <PageHeader />

                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Lansare în curând
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                Găsește nutriționiști potriviți
                                <span className="text-emerald-600"> în curând</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8">
                                Pregătim platforma care te va ajuta să găsești nutriționiști calificați,
                                cu planuri personalizate și consultații accesibile.
                            </p>

                            {/* Features preview */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Nutriționiști verificați</h3>
                                        <p className="text-gray-600 text-sm">Profesioniști cu acreditări și specializări diverse</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Planuri personalizate</h3>
                                        <p className="text-gray-600 text-sm">Soluții nutriționale adaptate nevoilor tale</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Prețuri accesibile</h3>
                                        <p className="text-gray-600 text-sm">Oferte transparente și fără costuri ascunse</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{(totalCount ?? 0) + 34}</div>
                                    <div className="text-sm text-gray-600">Clienți înscriși</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">T2 2025</div>
                                    <div className="text-sm text-gray-600">Lansare estimată</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                                    <div className="text-sm text-gray-600">Românesc</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Waitlist Form */}
                        <div className="lg:pl-12">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Fii printre primii! 🌟
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Înscrie-te pentru notificare la lansare și reducere 20% la prima consultație
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Adresa ta de email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="client@exemplu.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            disabled={isLoading}
                                        />
                                        {error && (
                                            <p className="mt-2 text-sm text-red-600">{error}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 rounded-xl font-medium transition-all ${isLoading
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Se înregistrează...
                                            </span>
                                        ) : (
                                            'Înscrie-mă pe lista de așteptare'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center">
                                        🔒 Nu trimitem spam
                                    </p>
                                </div>

                                {/* Social proof */}
                                <div className="mt-6 flex items-center justify-center gap-1">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white"
                                                style={{
                                                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=Client${i})`,
                                                    backgroundSize: 'cover'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 ml-3">
                                        +{(totalCount ?? 0) + 34} clienți așteaptă lansarea
                                    </p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-2">Ai întrebări?</p>
                                <a href="mailto:contact@nutrifind.ro" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    contact@nutrifind.ro
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}