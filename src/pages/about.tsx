import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const teamMembers = [
    {
      name: "Alexandru Ionescu",
      role: "Co-Founder & CEO",
      description: "Pasionat de tehnologie și nutriție, Alex conduce viziunea strategică a platformei.",
      image: "👨‍💻"
    },
    {
      name: "Maria Popescu",
      role: "Co-Founder & COO",
      description: "Cu experiență în industria wellness, Maria se asigură că operațiunile funcționează perfect.",
      image: "👩‍💼"
    },
    {
      name: "Andrei Mihăilescu",
      role: "CTO",
      description: "Dezvoltatorul principal care transformă ideile în realitate digitală.",
      image: "👨‍💻"
    },
    {
      name: "Elena Dumitrescu",
      role: "Head of Nutrition",
      description: "Nutriționist certificat, Elena verifică și mentorează specialiștii de pe platformă.",
      image: "👩‍⚕️"
    }
  ]

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Pasiune pentru sănătate",
      description: "Credem că fiecare persoană merită acces la consiliere nutrițională de calitate."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Încredere și siguranță",
      description: "Verificăm fiecare nutriționist pentru a asigura standarde înalte de profesionalism."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Comunitate unită",
      description: "Construim o comunitate unde nutriționiștii și clienții evoluează împreună."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Inovație continuă",
      description: "Folosim tehnologia pentru a face nutriția accesibilă și convenabilă pentru toți."
    }
  ]

  const milestones = [
    { year: "2023", title: "Nașterea ideii", description: "Un grup de prieteni identifică problemele din industria nutriției" },
    { year: "2024", title: "Lansarea platformei", description: "Prima versiune a NutriFind devine disponibilă publicului" },
    { year: "2024", title: "500+ nutriționiști", description: "Depășim pragul de 500 de specialiști verificați pe platformă" },
    { year: "2025", title: "10,000+ utilizatori", description: "Comunitatea noastră crește și ajută mii de români să trăiască mai sănătos" }
  ]

  return (
    <>
      <Head>
        <title>Despre Noi - NutriFind</title>
        <meta name="description" content="Descoperă echipa din spatele NutriFind și misiunea noastră de a democratiza accesul la servicii de nutriție în România." />
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
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">Acasă</Link>
                <Link href="/about" className="text-green-600 font-medium">Despre noi</Link>
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">Găsește nutriționiști</Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
                <Link href="/nutritionists/login">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                    Login
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
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-green-600">Acasă</Link>
                <Link href="/about" className="block px-3 py-2 text-green-600 font-medium">Despre noi</Link>
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-green-600">Găsește nutriționiști</Link>
                <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-green-600">Contact</Link>
                <Link href="/nutritionists/login">
                  <button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 -right-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-1/2 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Suntem o echipă de tineri cu o
                <span className="text-green-600"> misiune mare</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Credem că sănătatea nu ar trebui să fie un lux. De aceea construim punți între 
                românii care vor să trăiască mai sănătos și nutriționiștii care îi pot ghida în această călătorie.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        {/* <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Povestea noastră
                </h2>
                <p className="text-gray-600 mb-4">
                  NutriFind s-a născut din frustrarea personală a fondatorilor noștri. După luni de căutări 
                  pentru un nutriționist potrivit, realizând cât de dificil este procesul, am decis să facem o schimbare.
                </p>
                <p className="text-gray-600 mb-4">
                  Ca tineri antreprenori români, am văzut o oportunitate de a folosi tehnologia pentru a rezolva 
                  o problemă reală: lipsa de transparență și accesibilitate în industria serviciilor de nutriție.
                </p>
                <p className="text-gray-600 mb-6">
                  Astăzi, suntem mândri să oferim o platformă care conectează mii de români cu nutriționiști 
                  verificați, făcând sănătatea mai accesibilă pentru toți.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/">
                    <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                      Găsește un nutriționist
                    </button>
                  </Link>
                  <Link href="/nutritionisti">
                    <button className="bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-full hover:bg-green-50 transition-all">
                      Devino partener
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-full h-96 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                      <div className="text-6xl mb-4">🌱</div>
                      <h3 className="text-2xl font-bold mb-2">Creștem împreună</h3>
                      <p className="text-green-100">Construim viitorul sănătății în România</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-green-100 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">💚</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">10,000+</div>
                      <div className="text-sm text-gray-600">Vieți schimbate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Valorile care ne ghidează</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fiecare decizie pe care o luăm este ghidată de aceste principii fundamentale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Echipa din spatele platformei</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tineri pasionați care lucrează zi de zi pentru a face nutriția accesibilă tuturor
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-5xl shadow-lg group-hover:shadow-xl transition-all">
                      {member.image}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Timeline Section */}
        {/* <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Călătoria noastră</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                De la idee la realitate - iată cum am evoluat
              </p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-green-300"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 md:text-right">
                      {index % 2 === 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                          <div className="text-2xl font-bold text-green-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative flex items-center justify-center mx-4">
                      <div className="w-4 h-4 bg-green-600 rounded-full z-10"></div>
                    </div>
                    
                    <div className="flex-1">
                      {index % 2 !== 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                          <div className="text-2xl font-bold text-green-600 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6">
              Vino alături de noi în misiunea de a face România mai sănătoasă
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Fie că ești nutriționist sau cineva care caută să trăiască mai sănătos, 
              te așteptăm în comunitatea NutriFind
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                  Găsește un nutriționist
                </button>
              </Link>
              <Link href="/nutritionisti">
                <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-all">
                  Devino nutriționist partener
                </button>
              </Link>
            </div>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}