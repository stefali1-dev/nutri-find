import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Head>
        <title>NutriConnect - Găsește nutriționistul perfect pentru tine</title>
        <meta name="description" content="Conectează-te cu nutriționiști verificați din România. Consultații personalizate, prețuri transparente, rezultate garantate." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">NutriConnect</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">Cum funcționează</a>
                <a href="#benefits" className="text-gray-700 hover:text-green-600 transition-colors">Beneficii</a>
                <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">Testimoniale</a>
                <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                  Începe acum
                </button>
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
                <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-green-600">Cum funcționează</a>
                <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-green-600">Beneficii</a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-green-600">Testimoniale</a>
                <button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                  Începe acum
                </button>
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
                    Găsește nutriționistul 
                    <span className="text-green-600"> perfect</span> pentru tine
                  </h1>
                  <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Conectează-te cu nutriționiști verificați din România. 
                    Consultații personalizate, prețuri transparente, rezultate garantate.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/find-nutritionist">
                      <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                        Găsește un nutriționist
                      </button>
                    </Link>
                    <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-full text-lg hover:bg-green-50 transition-all">
                      Sunt nutriționist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <p className="text-gray-600">Nutriționiști verificați</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                <p className="text-gray-600">Clienți mulțumiți</p>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                <p className="text-gray-600">Rating mediu</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Cum funcționează?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Procesul nostru simplu în 3 pași te conectează cu nutriționistul potrivit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Spune-ne nevoile tale</h3>
                <p className="text-gray-600">
                  Completează un formular simplu despre obiectivele tale de sănătate și preferințe
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Alege nutriționistul</h3>
                <p className="text-gray-600">
                  Explorează profilurile detaliate, citește recenzii și compară prețuri transparent
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Începe transformarea</h3>
                <p className="text-gray-600">
                  Programează consultația și începe călătoria către o viață mai sănătoasă
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">De ce NutriConnect?</h2>
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

        {/* Special Offer Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Începători? Avem o surpriză pentru tine!
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Conectează-te cu nutriționiști la început de carieră care oferă consultații gratuite sau la prețuri foarte accesibile
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Descoperă ofertele speciale
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Ce spun clienții noștri</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Mii de români și-au transformat viața cu ajutorul nutriționiștilor de pe NutriConnect
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Am slăbit 15 kg în 4 luni! Nutriționistul meu a fost extraordinar, m-a susținut la fiecare pas."
                </p>
                <p className="font-semibold">Maria P., București</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Ca sportiv, aveam nevoie de un plan special. Am găsit exact ce căutam, iar performanțele mele au crescut vizibil!"
                </p>
                <p className="font-semibold">Andrei M., Cluj</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Prețurile transparente m-au ajutat să îmi aleg nutriționistul perfect pentru bugetul meu. Recomand!"
                </p>
                <p className="font-semibold">Elena R., Timișoara</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Gata să îți transformi viața?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Alătură-te celor peste 10,000 de români care și-au îmbunătățit sănătatea cu NutriConnect
            </p>
            <Link href="/find-nutritionist">
              <button className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                Începe gratuit acum
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">NutriConnect</h3>
                <p className="text-gray-400">
                  Platforma #1 din România pentru conectarea cu nutriționiști verificați
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Platformă</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cum funcționează</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Găsește nutriționiști</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Prețuri</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Pentru nutriționiști</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Companie</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Despre noi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cariere</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Termeni și condiții</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Politica de confidențialitate</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400">
                © 2024 NutriFind. Toate drepturile rezervate. Făcut cu ❤️ în România.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}