import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Results() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState('Analizăm preferințele tale...')

  useEffect(() => {
    // Get email from session storage
    const email = sessionStorage.getItem('clientEmail')
    if (email) {
      setUserEmail(email)
    }

    // Simulate loading process
    const loadingSteps = [
      { progress: 25, message: 'Analizăm preferințele tale...', duration: 800 },
      { progress: 50, message: 'Căutăm nutriționiști potriviți...', duration: 1200 },
      { progress: 75, message: 'Verificăm disponibilitatea...', duration: 1000 },
      { progress: 90, message: 'Pregătim rezultatele...', duration: 800 },
      { progress: 100, message: 'Aproape gata...', duration: 600 }
    ]

    let currentStep = 0
    
    const runLoadingStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        setLoadingProgress(step.progress)
        setLoadingMessage(step.message)
        
        setTimeout(() => {
          currentStep++
          runLoadingStep()
        }, step.duration)
      } else {
        // Finish loading
        setTimeout(() => {
          setIsLoading(false)
        }, 400)
      }
    }

    // Start loading simulation
    runLoadingStep()
  }, [])

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Se încarcă rezultatele... - NutriFind</title>
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
            {/* Loading animation */}
            <div className="flex flex-col items-center">
              {/* Animated logo/icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                {/* Rotating ring */}
                <div className="absolute inset-0 w-24 h-24 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
              </div>

              {/* Loading message */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {loadingMessage}
              </h2>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              {/* Progress percentage */}
              <p className="text-sm text-gray-600 mb-6">{loadingProgress}% completat</p>

              {/* Fun facts while loading */}
              <div className="bg-green-50 rounded-xl p-4 w-full">
                <p className="text-sm text-green-800 text-center">
                  <span className="font-semibold">Știai că?</span> 
                  <br />
                  O alimentație echilibrată poate îmbunătăți nivelul de energie cu până la 40%
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Rezultate trimise - NutriFind</title>
        <meta name="description" content="Verifică-ți email-ul pentru nutriționiștii recomandați" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Simple Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/">
              <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
            </Link>
          </div>
        </header>

        {/* Main Content with fade-in animation */}
        <div className="max-w-4xl mx-auto px-4 py-16 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center relative overflow-hidden">
              {/* Animated circles background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full animate-pulse delay-300"></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Felicitări! 🎉
                </h1>
                <p className="text-xl text-green-100">
                  Am găsit nutriționiștii perfecți pentru tine
                </p>
              </div>
            </div>

            {/* Email Notification */}
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Verifică-ți email-ul!
                </h2>
                
                {userEmail && (
                  <p className="text-gray-600 mb-6">
                    Am trimis lista personalizată cu nutriționiști la:
                    <span className="block text-lg font-semibold text-gray-800 mt-2">
                      {userEmail}
                    </span>
                  </p>
                )}
              </div>

              {/* What's in the email */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Ce vei găsi în email:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Top 5 nutriționiști</strong> care se potrivesc perfect cu nevoile tale
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Profile complete</strong> cu specializări, experiență și abordare
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Prețuri transparente</strong> și disponibilitate actualizată
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Link direct</strong> pentru programare rapidă
                    </span>
                  </li>
                </ul>
              </div>

              {/* Didn't receive email */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Nu ai primit email-ul?</h4>
                    <p className="text-yellow-700 text-sm mb-2">
                      Verifică folderul Spam/Junk sau Promotions. Uneori email-urile ajung acolo.
                    </p>
                    {/* <button className="text-yellow-700 hover:text-yellow-800 text-sm font-medium underline">
                      Retrimite email-ul
                    </button> */}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <button className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-all font-medium">
                    Înapoi la pagina principală
                  </button>
                </Link>
                <Link href="/coming-soon?for=client">
                  <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-medium">
                    Fă o nouă căutare
                  </button>
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">🔒</div>
                  <div className="text-sm text-gray-600">100% Securizat</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">⚡</div>
                  <div className="text-sm text-gray-600">Răspuns rapid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">🎯</div>
                  <div className="text-sm text-gray-600">Personalizat</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              💡 Sfaturi pentru prima consultație
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Pregătește-te</h4>
                <p className="text-sm text-gray-600">
                  Notează-ți obiectivele și întrebările pe care vrei să le adresezi
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Fii sincer</h4>
                <p className="text-sm text-gray-600">
                  Împărtășește toate detaliile despre stilul tău de viață actual
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Fii răbdător</h4>
                <p className="text-sm text-gray-600">
                  Rezultatele durabile vin cu timp și consistență
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </>
  )
}