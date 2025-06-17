import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

// Componenta pentru formularul de waiting list
type WaitlistFormProps = {
  placement: string
  className?: string
}

function WaitlistForm({ placement, className = "" }: WaitlistFormProps) {
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

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email,
            feature_interested: 'client_platform',
            source_page: router.pathname,
            user_type: 'client',
            placement: placement // pentru a vedea unde s-au înscris
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
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center ${className}`}>
        <div className="flex items-center justify-center mb-3">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">Mulțumim!</h3>
        <p className="text-sm sm:text-base text-green-700">
          Te-ai înscris cu succes! Vei primi 15% reducere la prima consultație când lansăm platforma.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl ${className}`}>
      <div className="text-center mb-4 sm:mb-5">
        <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
          </svg>
        </div>

        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 px-2">
          Rezervă-ți locul acum și primești <span className="text-green-600">15% reducere</span>!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-2">
          Înscrie-te gratuit pe lista de așteptare.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresa ta de email"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md pr-10 sm:pr-12"
            autoComplete="email"
            inputMode="email"
          />
          <svg className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {error && (
          <div className="text-red-600 text-xs sm:text-sm bg-red-50 p-2.5 sm:p-3 rounded-lg animate-shake flex items-start">
            <svg className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="break-words">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Se înscrie...
            </span>
          ) : (
            "Vreau reducerea de 15%!"
          )}
        </button>

        <p className="text-[11px] sm:text-xs text-gray-500 text-center px-2">
          * Reducerea se aplică exclusiv la prima consultație după lansarea platformei
        </p>
      </form>
    </div>
  )
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Head>
        <title>NutriFind - Găsește nutriționistul perfect pentru tine</title>
        <meta name="description" content="Conectează-te cu nutriționiști verificați din România. Consultații personalizate, prețuri transparente, rezultate garantate." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
        
        @media (max-width: 640px) {
          button, input, textarea, select {
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .touch-manipulation {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-bold text-green-600">NutriFind</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">Cum funcționează</a>
                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition-colors">Beneficii</a>
                <a href="#insights" className="text-gray-700 hover:text-green-600 transition-colors">Interviuri</a>
                <Link href="/#find-nutritionist">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                    Începe acum
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
                  href="#how-it-works"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cum funcționează
                </a>
                <a
                  href="#benefits"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beneficii
                </a>
                <a
                  href="#insights"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Interviuri
                </a>
                <Link href="/#find-nutritionist">
                  <button
                    className="w-full mt-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Începe acum
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-32 flex content-center items-center justify-center min-h-[70vh] sm:min-h-[80vh]">
          <div className="absolute top-0 w-full h-full bg-gradient-to-br from-green-50 to-emerald-50"></div>

          <div className="container relative mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="animate-fade-in">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Găsește nutriționistul
                    <span className="text-green-600"> perfect</span> pentru tine
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                    Conectează-te cu nutriționiști verificați din România.
                    Consultații personalizate, prețuri transparente, rezultate garantate.
                  </p>
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                    <Link href="#find-nutritionist">
                      <button className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                        Găsește un nutriționist
                      </button>
                    </Link>
                    <Link href="/nutritionisti">
                      <button className="w-full sm:w-auto cursor-pointer bg-white text-green-600 border-2 border-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-green-50 transition-all">
                        Sunt nutriționist
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secțiune de reducere - clarificată */}
        <section id="find-nutritionist" className="py-12 sm:py-16 bg-gradient-to-r from-green-500 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
              <div className="text-white lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Fii printre primii care au acces la platformă!
                </h2>
                <p className="text-base sm:text-lg text-green-100 mb-4 sm:mb-6">
                  Înscrie-te acum pe lista noastră de așteptare și primești 15% reducere la prima consultație, imediat ce lansăm platforma.
                </p>
                <ul className="text-green-100 space-y-2 text-sm sm:text-base">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Acces prioritar la lansare
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Reducere de lansare: -15% la prima consultație
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Fără obligații – te poți retrage oricând
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-1/2 max-w-md">
                <WaitlistForm
                  placement="before_how_it_works"
                  className="transform hover:-translate-y-1 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Cum funcționează?</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Procesul nostru simplu în 3 pași te conectează cu nutriționistul potrivit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Spune-ne nevoile tale</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Completează un formular simplu despre obiectivele tale de sănătate și preferințe
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Alege nutriționistul</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Explorează profilurile detaliate, citește recenzii și compară prețuri transparent
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Începe transformarea</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Programează consultația și începe călătoria către o viață mai sănătoasă
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">De ce NutriFind?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Platforma noastră îți oferă tot ce ai nevoie pentru a-ți atinge obiectivele de sănătate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Nutriționiști verificați</h3>
                <p className="text-gray-600">Toți specialiștii sunt verificați și au diplome acreditate</p>
              </div>

              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prețuri transparente</h3>
                <p className="text-gray-600">Vezi toate costurile înainte de a programa o consultație</p>
              </div>

              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Planuri personalizate</h3>
                <p className="text-gray-600">Fiecare plan este adaptat nevoilor și obiectivelor tale</p>
              </div>

              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Suport continuu</h3>
                <p className="text-gray-600">Comunică cu nutriționistul tău oricând ai nevoie</p>
              </div>

              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexibilitate maximă</h3>
                <p className="text-gray-600">Consultații online sau fizice, la ore convenabile pentru tine</p>
              </div>

              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                  <svg className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Recenzii autentice</h3>
                <p className="text-gray-600">Citește experiențele reale ale altor clienți</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interviuri Section - Înlocuiește testimonialele */}
        <section id="insights" className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Ce ne spun românii</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Am discutat cu oameni din întreaga țară despre provocările lor în găsirea unui nutriționist de încredere
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/interviews/1.png"
                    alt="Maria"
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-sm sm:text-base">Maria, 34 ani</p>
                    <p className="text-xs sm:text-sm text-gray-500">București</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic">
                  "Mi-ar plăcea să existe o platformă unde să pot căuta ușor nutriționiști și să văd transparent prețurile. Acum trebuie să sun la fiecare în parte și să întreb cât costă."
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/interviews/2.png"
                    alt="Andrei"
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-sm sm:text-base">Andrei, 28 ani</p>
                    <p className="text-xs sm:text-sm text-gray-500">Cluj</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic">
                  "Problema mea e că nu știu pe cine să aleg. Sunt atât de mulți nutriționiști, dar nu am cum să știu care sunt cu adevărat buni și care nu."
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/interviews/3.png"
                    alt="Elena"
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-sm sm:text-base">Elena, 42 ani</p>
                    <p className="text-xs sm:text-sm text-gray-500">Iași</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic">
                  "Aș vrea să pot vedea recenzii reale de la alți pacienți. Și să știu dinainte cât mă costă, fără să fiu pusă în situația să întreb de preț."
                </p>
              </div>
            </div>

            <div className="mt-8 sm:mt-12 bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                  Principalele provocări identificate:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">Dificultatea în alegerea specialistului</p>
                      <p className="text-xs sm:text-sm text-gray-600">65% nu știu cum să aleagă nutriționistul potrivit</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">Lipsă de recenzii verificate</p>
                      <p className="text-xs sm:text-sm text-gray-600">82% vor să citească experiențe reale înainte să decidă</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">Proces complicat de programare</p>
                      <p className="text-xs sm:text-sm text-gray-600">Telefoane, email-uri, programări întârziate</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">Prețuri netransparente</p>
                      <p className="text-xs sm:text-sm text-gray-600">Trebuie să întrebi de preț, ceea ce poate fi incomod</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium text-sm sm:text-base">
                    💡 <strong>Soluția NutriFind:</strong> O platformă care rezolvă toate aceste probleme într-un singur loc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secțiunea finală de reducere */}
        <section id="final-waitlist" className="py-16 sm:py-20 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
                Gata să îți transformi viața?
              </h2>
              <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Alătură-te primilor utilizatori și beneficiază de reducerea exclusivă de 15% la prima consultație
              </p>

              <div className="inline-flex items-center justify-center bg-yellow-50 text-yellow-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 animate-bounce text-sm sm:text-base">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="font-bold">Ofertă limitată la primele 50 de înscrieri</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-sm p-0.5 sm:p-1 rounded-xl sm:rounded-2xl">
              <WaitlistForm
                placement="final_cta"
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl"
              />
            </div>

            <div className="text-center mt-8 sm:mt-10 px-4">
              <p className="text-green-100 text-sm sm:text-base flex items-center justify-center">
                <svg className="inline w-4 h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Datele tale sunt sigure. Nu vom partaja niciodată informațiile tale.</span>
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