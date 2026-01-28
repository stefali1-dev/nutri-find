import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NutritionistService } from '@/lib/services/nutritionistService'
import { ReviewService } from '@/lib/services/reviewService'
import type { NutritionistData } from '@/lib/types/nutritionist'
import type { ReviewData } from '@/lib/types/review'
import BookingModal, { BookingData } from '@/components/BookingModal'
import Footer from '@/components/Footer'

export default function NutritionistProfile() {
  const router = useRouter()
  const { id } = router.query
  const [nutritionist, setNutritionist] = useState<NutritionistData | null>(null)
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews' | 'certificates'>('about')
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadNutritionistData(id)
      loadReviews(id)
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

  const loadReviews = async (nutritionistId: string) => {
    try {
      setLoadingReviews(true)
      const { data, error } = await ReviewService.getReviewsByNutritionist(nutritionistId)
      
      if (error) {
        console.error('Error loading reviews:', error)
        return
      }

      setReviews(data || [])
    } catch (err) {
      console.error('Error loading reviews:', err)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleBookingConfirmed = (data: BookingData) => {
    // Handle booking confirmation
    
    // Close modal and reset state
    setShowBookingModal(false)
    
    // Optionally redirect or show confirmation
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

  const formatExperienceYears = (years: string | number) => {
    const yearNum = typeof years === 'string' ? parseInt(years) : years
    if (yearNum === 1) return '1 an experiență'
    if (yearNum === 0) return 'Sub 1 an experiență'
    return `${yearNum} ani experiență`
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
          <Link href="/">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer">
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
              <Link href="/nutritionisti/rezultate">
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
                          {nutritionist.average_rating && nutritionist.average_rating > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-medium text-lg">{nutritionist.average_rating}</span>
                              <span>({nutritionist.total_reviews || 0} recenzii)</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatExperienceYears(nutritionist.years_experience)}
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
                  </div>

                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition-all transform hover:scale-105 mb-3"
                  >
                    Programează consultație
                  </button>
                  
                  {/* <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-white text-green-600 border-2 border-green-600 py-3 rounded-full font-medium hover:bg-green-50 transition-all"
                  >
                    Trimite mesaj
                  </button> */}
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
                  className={`py-4 px-1 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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

                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-800 mb-3">Locație cabinet</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {nutritionist.location}
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
                    {nutritionist.average_rating && nutritionist.average_rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < Math.round(nutritionist.average_rating || 0) ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-semibold">{nutritionist.average_rating}</span>
                        <span className="text-gray-600">({nutritionist.total_reviews || 0} recenzii)</span>
                      </div>
                    )}
                  </div>

                  {loadingReviews ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Se încarcă recenziile...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <>
                      <div className="space-y-6">
                        {reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-gray-800">{review.author_name}</span>
                                  {review.is_verified && (
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
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.created_at || '').toLocaleDateString('ro-RO', { year: 'numeric', month: 'long' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-3">{review.comment}</p>
                          </div>
                        ))}
                      </div>

                      {!showAllReviews && reviews.length > 3 && (
                        <button
                          onClick={() => setShowAllReviews(true)}
                          className="w-full mt-6 text-green-600 hover:text-green-700 font-medium"
                        >
                          Vezi toate recenziile ({reviews.length})
                        </button>
                      )}
                    </>
                  ) : (
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
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Contact & Availability Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact și disponibilitate</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-800">Locație</div>
                      <div className="text-gray-600">{nutritionist.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-800">Contact</div>
                      <div className="text-gray-600">Prin platformă</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status verificare</h3>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {nutritionist.verification_status === 'verified' ? 'Verificat' : 'În proces de verificare'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {nutritionist.verification_status === 'verified' 
                        ? 'Nutriționist verificat de echipa NutriFind'
                        : 'Verificarea documentelor în desfășurare'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {nutritionist.languages.length > 1 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Limbi vorbite</h3>
                  <div className="flex flex-wrap gap-2">
                    {nutritionist.languages.map((lang) => (
                      <span key={lang} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {nutritionist && (
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false)
            }}
            onConfirm={handleBookingConfirmed}
            nutritionistId={nutritionist.id!}
            nutritionistName={nutritionist.full_name}
          />
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
      <Footer />
    </>
  )
}