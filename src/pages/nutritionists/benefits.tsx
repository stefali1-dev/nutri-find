import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function Benefits() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "Cât costă să mă înscriu pe platformă?",
      answer: "Înscrierea pe NutriFind este GRATUITĂ! Aplicăm doar un comision mic (15%) pentru consultațiile rezervate prin platformă. Nu există taxe ascunse sau abonamente lunare."
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
      answer: "Plățile sunt procesate securizat prin platformă și transferate în contul tău bancar săptămânal. Acceptăm plăți cu cardul și transfer bancar."
    },
    {
      question: "Pot oferi consultații atât online cât și fizice?",
      answer: "Da! Poți alege să oferi consultații online (prin video call), fizice (la cabinetul tău) sau ambele. Flexibilitatea este cheia succesului pe NutriFind."
    }
  ]

  return (
    <>
      <Head>
        <title>Devino Nutriționist Partener - NutriFind</title>
        <meta name="description" content="Alătură-te rețelei NutriFind și dezvoltă-ți cariera în nutriție. Clienți noi, venit stabil, flexibilitate totală." />
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
                <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">Cum funcționează</a>
                <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">Testimoniale</a>
                <a href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">Întrebări frecvente</a>
                <Link href="//coming-soon?for=nutritionist">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                    Începe acum
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
                <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-green-600">Cum funcționează</a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-green-600">Testimoniale</a>
                <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-green-600">Întrebări frecvente</a>
                <Link href="//coming-soon?for=nutritionist">
                  <button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                    Începe acum
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[80vh]">
          <div className="absolute top-0 w-full h-full bg-gradient-to-br from-emerald-50 via-green-50 to-white"></div>
          
          <div className="container relative mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                <div className="animate-fade-in">
                  <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Înscriere gratuită • Fără taxe ascunse
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                    Dezvoltă-ți cariera în nutriție cu
                    <span className="text-green-600"> NutriFind</span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Conectează-te cu mii de clienți potențiali care caută servicii de nutriție profesionistă. 
                    Construiește-ți portofoliul, stabilește-ți propriile prețuri și dezvoltă-ți afacerea în propriul ritm.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="//coming-soon?for=nutritionist">
                      <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
                        Înscrie-te gratuit acum
                      </button>
                    </Link>
                    <a href="#how-it-works">
                      <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-full text-lg hover:bg-green-50 transition-all">
                        Vezi cum funcționează
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </section>

        {/* TODO: Stats Section */}
        {/* <section className="py-16 bg-white -mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                  <p className="text-gray-600">Clienți activi lunar</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">€150</div>
                  <p className="text-gray-600">Venit mediu/consultație</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
                  <p className="text-gray-600">Rată de retenție clienți</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
                  <p className="text-gray-600">Rating mediu nutriționiști</p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">De ce nutriționiștii aleg NutriFind?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Oferim toate instrumentele de care ai nevoie pentru a-ți dezvolta practica de nutriție cu succes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Flux constant de clienți</h3>
                <p className="text-gray-600">
                  Accesează mii de clienți potențiali care caută activ servicii de nutriție. Nu mai pierde timp cu marketingul - noi îți aducem clienții.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Venit predictibil</h3>
                <p className="text-gray-600">
                  Stabilește-ți propriile prețuri și programul. Cu sistemul nostru de rezervări, poți planifica și prognoza veniturile cu ușurință.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexibilitate totală</h3>
                <p className="text-gray-600">
                  Lucrează de unde vrei, când vrei. Oferă consultații online sau fizice, tu decizi. Perfect pentru a-ți echilibra viața personală cu cariera.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Plăți securizate</h3>
                <p className="text-gray-600">
                  Nu te mai preocupa de facturare și încasări. Noi gestionăm plățile securizat și îți transferăm banii săptămânal.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Creștere rapidă</h3>
                <p className="text-gray-600">
                  Construiește-ți reputația prin recenzii pozitive. Clienții mulțumiți te vor recomanda, ajutându-te să crești organic.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Suport dedicat</h3>
                <p className="text-gray-600">
                  Echipa noastră este aici să te ajute să ai succes. Oferim training, resurse și suport continuu pentru dezvoltarea ta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Începe în doar 3 pași simpli</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Procesul nostru de înscriere este rapid și simplu. Poți începe să primești clienți în mai puțin de 48 de ore.
              </p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-green-200"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Completează profilul</h3>
                  <p className="text-gray-600">
                    Înscrie-te gratuit și completează-ți profilul cu experiența, specializările și serviciile tale. Durează doar 10 minute.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Verificare rapidă</h3>
                  <p className="text-gray-600">
                    Echipa noastră verifică diplomele și certificările tale în 24-48 de ore pentru a menține standardele înalte.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Primește clienți</h3>
                  <p className="text-gray-600">
                    Odată aprobat, profilul tău devine vizibil și poți începe să primești rezervări și să ajuți oamenii.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Ce spun nutriționiștii noștri</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Peste 500 de nutriționiști din România folosesc NutriFind pentru a-și dezvolta practica
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">DR</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Dr. Raluca Popescu</h4>
                    <p className="text-sm text-gray-500">Nutriționist, București</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "NutriFind mi-a transformat complet practica. În doar 3 luni, am ajuns la peste 50 de clienți noi. Platformele de plăți și programări fac totul atât de simplu!"
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">AM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Andreea Mihai</h4>
                    <p className="text-sm text-gray-500">Nutriționist sportiv, Cluj</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Ca nutriționist la început de drum, NutriFind mi-a oferit vizibilitatea de care aveam nevoie. Acum am un flux constant de clienți și pot să mă concentrez pe ceea ce iubesc."
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">CI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cristian Ionescu</h4>
                    <p className="text-sm text-gray-500">Nutriționist clinic, Timișoara</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Flexibilitatea de a oferi consultații online mi-a permis să ajut clienți din toată țara. Venitul meu a crescut cu 40% de când sunt pe platformă."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Income Calculator */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Calculează-ți potențialul venit
            </h2>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div>
                  <p className="text-green-100 mb-2">Consultații pe săptămână</p>
                  <p className="text-3xl font-bold">10</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Preț mediu/consultație</p>
                  <p className="text-3xl font-bold">150 RON</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Venit lunar estimat</p>
                  <p className="text-3xl font-bold">6,000 RON</p>
                </div>
              </div>
            </div>
            <p className="text-green-100 text-lg mb-8">
              *După deducerea comisionului platformei de 15%
            </p>
            <Link href="//coming-soon?for=nutritionist">
              <button className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                Începe să câștigi acum
              </button>
            </Link>
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
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
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

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ești gata să îți dezvolți cariera în nutriție?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Alătură-te comunității de peste 50 de nutriționiști care își construiesc succesul pe NutriFind
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="//coming-soon?for=nutritionist">
                <button className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl">
                  Înscrie-te gratuit acum
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-white text-green-600 border-2 border-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-all">
                  Contactează-ne
                </button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Nu necesită card de credit • Aprobare în 24-48h • Anulează oricând
            </p>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  )
}