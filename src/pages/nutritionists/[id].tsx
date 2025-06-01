import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Review {
  id: string
  author: string
  rating: number
  date: string
  comment: string
  helpful: number
  verified: boolean
}

interface Certificate {
  name: string
  issuer: string
  year: string
}

interface AvailableSlot {
  date: string
  time: string
  type: 'online' | 'in-person'
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Ioana M.',
    rating: 5,
    date: '15 ianuarie 2024',
    comment: 'Dr. Maria este extraordinară! Mi-a schimbat complet relația cu mâncarea. Am slăbit 12 kg în 3 luni, fără să mă înfometez. Planul ei personalizat a fost exact ce aveam nevoie.',
    helpful: 23,
    verified: true
  },
  {
    id: '2',
    author: 'Andrei P.',
    rating: 5,
    date: '3 februarie 2024',
    comment: 'Profesionalism desăvârșit. Mi-a explicat tot ce trebuia să știu despre nutriție sportivă. Performanțele mele au crescut semnificativ.',
    helpful: 15,
    verified: true
  },
  {
    id: '3',
    author: 'Elena R.',
    rating: 4,
    date: '20 februarie 2024',
    comment: 'Foarte mulțumită de rezultate. Singura problemă a fost că uneori răspunde mai greu la mesaje, dar consultațiile sunt excelente.',
    helpful: 8,
    verified: true
  }
]

const mockCertificates: Certificate[] = [
  { name: 'Licență în Nutriție și Dietetică', issuer: 'Universitatea de Medicină București', year: '2016' },
  { name: 'Master în Nutriție Clinică', issuer: 'Universitatea de Medicină București', year: '2018' },
  { name: 'Certificare în Nutriție Sportivă', issuer: 'ISSN România', year: '2020' },
  { name: 'Curs de Specializare în Diabet', issuer: 'Asociația Română de Diabet', year: '2021' }
]

const mockAvailableSlots: AvailableSlot[] = [
  { date: 'Mâine', time: '10:00', type: 'online' },
  { date: 'Mâine', time: '14:00', type: 'in-person' },
  { date: 'Mâine', time: '16:00', type: 'online' },
  { date: 'Joi', time: '09:00', type: 'online' },
  { date: 'Joi', time: '11:00', type: 'in-person' },
  { date: 'Vineri', time: '15:00', type: 'online' }
]

export default function NutritionistProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews' | 'certificates'>('about')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // Mock data - în producție ar veni din API bazat pe router.query.id
  const nutritionist = {
    id: '1',
    name: 'Dr. Maria Popescu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=b6e3f4',
    specializations: ['Slăbire sănătoasă', 'Nutriție sportivă', 'Diabet'],
    experience: '8 ani experiență',
    rating: 4.9,
    reviewCount: 127,
    price: '250 RON',
    consultationType: ['online', 'in-person'],
    responseTime: 'Răspunde în ~2 ore',
    successStories: 89,
    completedConsultations: 450,
    returnRate: 92,
    languages: ['Română', 'Engleză'],
    location: 'București, Sector 1',
    about: `Sunt Dr. Maria Popescu, nutriționist cu peste 8 ani de experiență în domeniul nutriției clinice. Pasiunea mea este să ajut oamenii să își atingă obiectivele de sănătate prin schimbări sustenabile în stilul de viață.

Am ajutat sute de clienți să slăbească sănătos, să își îmbunătățească performanțele sportive și să gestioneze condiții medicale precum diabetul. Cred cu tărie că o alimentație echilibrată nu înseamnă restricții severe, ci găsirea unui echilibru care funcționează pentru fiecare persoană în parte.

Abordarea mea se bazează pe știință, empatie și personalizare. Fiecare plan nutrițional pe care îl creez este adaptat nevoilor, preferințelor și stilului de viață al clientului.`,
    approach: [
      'Evaluare completă a stării de sănătate și obiceiurilor alimentare',
      'Plan nutrițional personalizat și flexibil',
      'Monitorizare constantă și ajustări în funcție de progres',
      'Educație nutrițională pentru rezultate pe termen lung',
      'Suport continuu între consultații'
    ],
    services: [
      {
        name: 'Consultație inițială completă',
        duration: '60 minute',
        price: '250 RON',
        description: 'Evaluare completă, istoric medical, măsurători, plan personalizat'
      },
      {
        name: 'Consultație de monitorizare',
        duration: '30 minute',
        price: '150 RON',
        description: 'Verificare progres, ajustări plan, răspunsuri la întrebări'
      },
      {
        name: 'Pachet lunar complet',
        duration: '4 consultații',
        price: '800 RON',
        description: 'Consultație inițială + 3 monitorizări + suport WhatsApp'
      },
      {
        name: 'Plan nutrițional sport',
        duration: '90 minute',
        price: '350 RON',
        description: 'Plan special pentru sportivi, include timing nutrițional'
      }
    ]
  }

  const handleBooking = () => {
    if (selectedSlot) {
      setShowBookingModal(true)
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    setShowContactModal(false)
  }

  return (
    <>
      <Head>
        <title>{nutritionist.name} - Profil Nutriționist | NutriConnect</title>
        <meta name="description" content={`Programează o consultație cu ${nutritionist.name}. ${nutritionist.specializations.join(', ')}.`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/nutritionists/results">
                <span className="text-gray-600 hover:text-green-600 cursor-pointer">Nutriționiști</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{nutritionist.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Profile Info */}
              <div className="md:w-2/3">
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={nutritionist.photo}
                    alt={nutritionist.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{nutritionist.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium text-lg">{nutritionist.rating}</span>
                            <span>({nutritionist.reviewCount} recenzii)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {nutritionist.experience}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {nutritionist.specializations.map((spec) => (
                            <span key={spec} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="hidden md:block p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.completedConsultations}</div>
                        <div className="text-sm text-gray-600">Consultații</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.successStories}</div>
                        <div className="text-sm text-gray-600">Povești de succes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.returnRate}%</div>
                        <div className="text-sm text-gray-600">Rată de return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.responseTime}</div>
                        <div className="text-sm text-gray-600">Timp răspuns</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="md:w-1/3">
                <div className="bg-white border-2 border-green-100 rounded-2xl p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800">{nutritionist.price}</div>
                    <div className="text-gray-600">per consultație</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Nutriționist verificat
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Disponibil în 24h
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Suport între consultații
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-all transform hover:scale-105 mb-3"
                  >
                    Programează consultație
                  </button>
                  
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-white text-green-600 border-2 border-green-600 py-3 rounded-full font-medium hover:bg-green-50 transition-all"
                  >
                    Trimite mesaj
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Anulare gratuită cu 24h înainte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'about', label: 'Despre mine' },
                { id: 'services', label: 'Servicii și prețuri' },
                { id: 'reviews', label: 'Recenzii' },
                { id: 'certificates', label: 'Certificări' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Despre mine</h2>
                  <div className="prose prose-green max-w-none">
                    {nutritionist.about.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Abordarea mea</h3>
                  <ul className="space-y-3">
                    {nutritionist.approach.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Limbi vorbite</h4>
                      <p className="text-gray-600">{nutritionist.languages.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Locație cabinet</h4>
                      <p className="text-gray-600">{nutritionist.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Servicii și prețuri</h2>
                  <div className="space-y-4">
                    {nutritionist.services.map((service, index) => (
                      <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:border-green-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                          <span className="text-xl font-bold text-green-600">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.duration}
                          </span>
                        </div>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-green-50 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">🎁 Ofertă specială pentru clienți noi</h3>
                    <p className="text-gray-600">
                      Primești 20% reducere la prima consultație! Folosește codul <span className="font-semibold text-green-600">NUTRI20</span> la programare.
                    </p>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recenzii clienți</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-semibold">{nutritionist.rating}</span>
                      <span className="text-gray-600">({nutritionist.reviewCount} recenzii)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {mockReviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-800">{review.author}</span>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  ✓ Client verificat
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'} fill-current`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-3">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Util ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!showAllReviews && mockReviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="w-full mt-6 text-green-600 hover:text-green-700 font-medium"
                    >
                      Vezi toate recenziile ({mockReviews.length})
                    </button>
                  )}
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Educație și certificări</h2>
                  <div className="space-y-4">
                    {mockCertificates.map((cert, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                          <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Available Slots */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Disponibilitate următoarele zile</h3>
                <div className="space-y-2">
                  {mockAvailableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedSlot === slot
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-800">{slot.date}</span>
                          <span className="text-gray-600 mx-2">•</span>
                          <span className="text-gray-600">{slot.time}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          slot.type === 'online' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {slot.type === 'online' ? 'Online' : 'Cabinet'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleBooking}
                  disabled={!selectedSlot}
                  className={`w-full mt-4 py-3 rounded-full font-medium transition-all ${
                    selectedSlot
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Rezervă ora selectată
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informații de contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">{nutritionist.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Contact prin platformă</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">{nutritionist.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Similar Nutritionists */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutriționiști similari</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Nutritionist${i}&backgroundColor=ffd5dc`}
                        alt={`Nutritionist ${i}`}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Dr. Nume Exemplu</h4>
                        <p className="text-sm text-gray-600">Nutriție sportivă</p>
                      </div>
                      <button className="text-green-600 hover:text-green-700 text-sm">
                        Vezi profil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Confirmă programarea</h3>
              
              {selectedSlot && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 mb-2">Ai selectat:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedSlot.date} • {selectedSlot.time} • {selectedSlot.type === 'online' ? 'Online' : 'La cabinet'}
                  </p>
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume complet</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="ex: Maria Popescu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="email@exemplu.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="07XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj (opțional)</label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    rows={3}
                    placeholder="Spune-i nutriționistului despre ce ai vrea să discutați..."
                  />
                </div>
              </form>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    // Handle booking confirmation
                    setShowBookingModal(false)
                    alert('Programare confirmată! Vei primi un email de confirmare.')
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-all"
                >
                  Confirmă programarea
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Trimite mesaj</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subiect</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="ex: Întrebare despre servicii"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    rows={5}
                    placeholder="Scrie mesajul tău aici..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email pentru răspuns</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder="email@exemplu.com"
                  />
                </div>
              </form>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  onClick={handleContactSubmit}
                  className="flex-1 bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-all"
                >
                  Trimite mesaj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}