import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NutritionistService } from '@/lib/services/nutritionistService'
import type { NutritionistData } from '@/lib/types/nutritionist'

interface Review {
  id: string
  author: string
  rating: number
  date: string
  comment: string
  helpful: number
  verified: boolean
}

interface AvailableSlot {
  date: string
  time: string
  type: 'online' | 'in-person'
}

// Mock data pentru reviews și available slots
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Ioana M.',
    rating: 5,
    date: '15 ianuarie 2024',
    comment: 'Profesionist desăvârșit! Mi-a schimbat complet relația cu mâncarea. Am slăbit 12 kg în 3 luni, fără să mă înfometez. Planul personalizat a fost exact ce aveam nevoie.',
    helpful: 23,
    verified: true
  },
  {
    id: '2',
    author: 'Andrei P.',
    rating: 5,
    date: '3 februarie 2024',
    comment: 'Foarte atent la detalii și empatic. Mi-a explicat tot ce trebuia să știu despre nutriție sportivă. Performanțele mele au crescut semnificativ.',
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
  const { id } = router.query
  const [nutritionist, setNutritionist] = useState<NutritionistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews' | 'certificates'>('about')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadNutritionistData(id)
    }
  }, [id])

  const loadNutritionistData = async (nutritionistId: string) => {
    try {
      setLoading(true)
      const { data, error } = await NutritionistService.getNutritionistById(nutritionistId)
      
      if (error || !data) {
        setError('Nu am putut încărca datele nutriționistului')
        return
      }

      setNutritionist(data)
    } catch (err) {
      console.error('Error loading nutritionist:', err)
      setError('A apărut o eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
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
    // Aici vei implementa logica de trimitere mesaj
  }

  const getSpecializationLabel = (spec: string) => {
    const labels: Record<string, string> = {
      'weight-loss': 'Slăbire sănătoasă',
      'muscle-gain': 'Creștere masă musculară',
      'health-condition': 'Condiții medicale',
      'sports-nutrition': 'Nutriție sportivă',
      'general-health': 'Sănătate generală',
      'pediatric': 'Nutriție pediatrică',
      'elderly': 'Nutriție vârstnici',
      'eating-disorders': 'Tulburări alimentare',
      'diabetes': 'Diabet'
    }
    return labels[spec] || spec
  }

  const getConsultationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'online': 'Online',
      'in-person': 'La cabinet',
      'hybrid': 'Hibrid'
    }
    return labels[type] || type
  }

  const formatWorkDays = (days: string[]) => {
    if (days.length === 7) return 'Toată săptămâna'
    if (days.length === 5 && !days.includes('Sâmbătă') && !days.includes('Duminică')) return 'Luni - Vineri'
    return days.join(', ')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Se încarcă profilul...</p>
        </div>
      </div>
    )
  }

  if (error || !nutritionist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-red-600 mb-4">{error || 'Nutriționistul nu a fost găsit'}</p>
          <Link href="/coming-soon?for=client">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
              Înapoi la căutare
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{nutritionist.full_name} - Profil Nutriționist | NutriFind</title>
        <meta name="description" content={`Programează o consultație cu ${nutritionist.full_name}. ${nutritionist.specializations.map(s => getSpecializationLabel(s)).join(', ')}.`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/nutritionists/results">
                <span className="text-gray-600 hover:text-green-600 cursor-pointer">Nutriționiști</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{nutritionist.full_name}</span>
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
                  {nutritionist.profile_photo_url ? (
                    <img
                      src={nutritionist.profile_photo_url}
                      alt={nutritionist.full_name}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {nutritionist.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{nutritionist.full_name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {nutritionist.average_rating && (
                            <span className="flex items-center gap-1">
                              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-medium text-lg">{nutritionist.average_rating}</span>
                              <span>({nutritionist.total_reviews || 3} recenzii)</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {nutritionist.years_experience} ani experiență
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {nutritionist.specializations.map((spec) => (
                            <span key={spec} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {getSpecializationLabel(spec)}
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
                        <div className="text-2xl font-bold text-green-600">{nutritionist.total_consultations || 0}</div>
                        <div className="text-sm text-gray-600">Consultații</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.years_experience}</div>
                        <div className="text-sm text-gray-600">Ani experiență</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.certifications.length}</div>
                        <div className="text-sm text-gray-600">Certificări</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{nutritionist.languages.length}</div>
                        <div className="text-sm text-gray-600">Limbi vorbite</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="md:w-1/3">
                <div className="bg-white border-2 border-green-100 rounded-2xl p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800">
                      {nutritionist.services.length > 0 
                        ? `${Math.min(...nutritionist.services.map(s => parseInt(s.price)))} RON`
                        : 'Preț variabil'
                      }
                    </div>
                    <div className="text-gray-600">de la</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {nutritionist.verification_status === 'verified' ? 'Nutriționist verificat' : 'În proces de verificare'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Disponibil {nutritionist.next_available || 'în curând'}
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
                { id: 'certificates', label: 'Educație și certificări' }
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
                    {nutritionist.bio.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Tipuri de consultații</h3>
                      <div className="space-y-2">
                        {nutritionist.consultation_types.map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600">{getConsultationTypeLabel(type)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Limbi vorbite</h3>
                      <div className="flex flex-wrap gap-2">
                        {nutritionist.languages.map((lang) => (
                          <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Locație cabinet</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {nutritionist.location}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Program de lucru</h3>
                      <p className="text-gray-600 mb-1">{formatWorkDays(nutritionist.work_days)}</p>
                      <p className="text-sm text-gray-500">
                        {nutritionist.work_hours.start} - {nutritionist.work_hours.end}
                      </p>
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
                          <span className="text-xl font-bold text-green-600">{service.price} RON</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.duration} minute
                          </span>
                        </div>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  {nutritionist.services.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nu există servicii configurate momentan</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recenzii clienți</h2>
                    {nutritionist.average_rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-semibold">{nutritionist.average_rating}</span>
                        <span className="text-gray-600">({nutritionist.total_reviews || 3} recenzii)</span>
                      </div>
                    )}
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

                  {(nutritionist.total_reviews === 0 || !nutritionist.total_reviews) && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nu există recenzii încă</p>
                    </div>
                  )}
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Educație și certificări</h2>
                  
                  {/* Education */}
                  {nutritionist.education.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Educație</h3>
                      <div className="space-y-4">
                        {nutritionist.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                              <p className="text-gray-600">{edu.university}</p>
                              <p className="text-sm text-gray-500">Absolvit: {edu.graduation_year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {nutritionist.certifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Certificări</h3>
                      <div className="space-y-4">
                        {nutritionist.certifications.map((cert, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                              <p className="text-gray-600">{cert.issuer}</p>
                              <p className="text-sm text-gray-500">Obținut: {cert.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* License */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Licență CDR</h4>
                        <p className="text-blue-700">Număr licență: {nutritionist.license_number}</p>
                      </div>
                    </div>
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
                    <span className="text-gray-600">{formatWorkDays(nutritionist.work_days)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informații rapide</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durată consultație:</span>
                    <span className="font-medium">{nutritionist.consultation_duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipuri consultații:</span>
                    <span className="font-medium">{nutritionist.consultation_types.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specializări:</span>
                    <span className="font-medium">{nutritionist.specializations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Limbi vorbite:</span>
                    <span className="font-medium">{nutritionist.languages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
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