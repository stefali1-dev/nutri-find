import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

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
                <Image
                  src="/images/logo.png"
                  alt="NutriFind Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-2"
                  priority
                />
                <span className="text-xl sm:text-2xl font-bold text-green-600">NutriFind</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">Cum funcționează</a>
                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition-colors">Beneficii</a>
                <a href="#insights" className="text-gray-700 hover:text-green-600 transition-colors">Interviuri</a>
                <Link href="/cauta-nutritionist">
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
                <Link href="/cauta-nutritionist">
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
                    <Link href="/cauta-nutritionist">
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

        {/* Challenges Section - High Impact Design for Clients */}
        <section id="challenges" className="py-8 sm:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with dramatic styling */}
            <div className="text-center mb-12 sm:mb-20">
              <div className="inline-flex items-center justify-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Provocări comune în drumul spre sănătate
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                Te regăsești în aceste situații?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Nu ești singur. Mii de români se confruntă cu aceleași provocări.
                <span className="font-semibold text-gray-900"> Iată cum te putem ajuta</span> să le depășești
              </p>
            </div>

            {/* Main challenges grid with enhanced visual impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
              {/* Challenge 1 - Information Overload */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Prea multă informație contradictorie
                      </h3>
                      <p className="text-gray-600">
                        Google îți oferă mii de rezultate, influencerii spun una, prietenii alta. Nu mai știi ce dietă e cu adevărat potrivită pentru tine și corpul tău.
                      </p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">Soluția NutriFind:</p>
                        <p className="text-sm text-green-700">Sfaturi personalizate de la profesioniști certificați care înțeleg exact nevoile tale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge 2 - Failed Diets */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Ai încercat toate dietele, fără rezultate
                      </h3>
                      <p className="text-gray-600">
                        Keto, intermitent fasting, vegan... Le-ai încercat pe toate, dar kilogramele revin mereu. Te simți frustrat și nu mai ai încredere că poți reuși.
                      </p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">Soluția NutriFind:</p>
                        <p className="text-sm text-green-700">Plan alimentar sustenabil adaptat stilului tău de viață, nu diete extreme temporare</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge 3 - No Time */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Nu ai timp să cauți un nutriționist bun
                      </h3>
                      <p className="text-gray-600">
                        Între job, familie și responsabilități, găsirea unui nutriționist potrivit pare imposibilă. Și chiar dacă găsești unul, cum știi că e bun?
                      </p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">Soluția NutriFind:</p>
                        <p className="text-sm text-green-700">Găsește specialistul perfect în 5 minute - toți verificați, cu recenzii reale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge 4 - Health Issues */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl mr-4 group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Probleme de sănătate care necesită atenție specială
                      </h3>
                      <p className="text-gray-600">
                        Diabet, colesterol crescut, intoleranțe alimentare... Ai nevoie de cineva care înțelege situația ta specifică, nu doar rețete generice de pe internet.
                      </p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-1">Soluția NutriFind:</p>
                        <p className="text-sm text-green-700">Nutriționiști specializați exact pe condiția ta medicală, cu experiență dovedită</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="pb-16 pt-8 sm:py-20 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Gata să îți transformi viața?
            </h2>
            <p className="text-lg sm:text-xl text-green-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Începe acum căutarea nutriționistului perfect pentru tine. Procesul durează doar câteva minute!
            </p>
            
            <Link href="/cauta-nutritionist">
              <button className="bg-white text-green-600 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl">
                Găsește-ți nutriționistul acum
              </button>
            </Link>
            
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-green-100">
              <div className="flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base">Fără cont necesar</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base">Doar 5 minute</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm sm:text-base">100% gratuit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}