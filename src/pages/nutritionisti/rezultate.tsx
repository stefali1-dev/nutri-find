import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'
import { NutritionistData } from '@/lib/types/nutritionist'
import { NutritionistService } from '@/lib/services/nutritionistService'
import BookingModal, { BookingData } from '../../components/BookingModal'
import { getSpecializationEmoji, getSpecializationLabel } from '@/lib/utils'
import Footer from '@/components/Footer'

interface FormData {
  goal: string
  healthConditions: string[]
  dietType: string
  budget: string
  consultationType: string
  availability: string[]
  experience: string
  location: string
  age: string
  gender: string
  email: string
  name: string
}

export default function ResultsVertical() {
  const router = useRouter()
  const [userPreferences, setUserPreferences] = useState<FormData | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedNutritionist, setSelectedNutritionist] = useState<NutritionistData | null>(null)

  const [nutritionists, setNutritionists] = useState<NutritionistData[]>([])
  const [filteredNutritionists, setFilteredNutritionists] = useState<
    NutritionistData[]
  >([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'experience'>(
    'relevance'
  )
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    price: 'all',
    experience: 'all',
    consultationType: 'all',
    availability: 'all'
  })

  /** ─────────────────────────────────────────────────────────────
   *  Fetch only VERIFIED + ACTIVE nutritionists once on mount
   *  (MVP → nu ne uităm la preferințele user-ului încă)
   *  ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchNutritionists = async () => {

      const preferences = sessionStorage.getItem('nutriPreferences')
      if (preferences) {
        setUserPreferences(JSON.parse(preferences))
      }

      const { data, error } = await NutritionistService.getVerifiedNutritionists()

      if (error) {
        // TODO: poți adăuga un toast / mesaj de eroare
        console.error('Failed to load nutritionists:', error)
      } else {
        setNutritionists(data)
        setFilteredNutritionists(data) // momentan fără filtre
      }

      setLoading(false)
    }

    fetchNutritionists()
  }, [])

  const handleBookConsultation = (nutritionist: NutritionistData) => {
    setSelectedNutritionist(nutritionist)
    setShowBookingModal(true)
  }

  const handleViewProfile = (nutritionist: NutritionistData) => {
    router.push(`/nutritionisti/${nutritionist.id}`)
  }

  const getLowestPrice = (services: any[]) => {
    return Math.min(...services.map(s => parseInt(s.price)))
  }

  const handleBookingConfirmed = (data: BookingData) => {
    // Here you can push to Supabase, send an email, etc.
    console.log('Booking confirmed:', data)
    
    // Close modal and show success message
    setShowBookingModal(false)
    setSelectedNutritionist(null)
    
    // Show success notification
    alert('Programare confirmată! Vei primi un email de confirmare.')
    
    // Optional: redirect to a confirmation page or show inline success message
  }


  const renderStars = (rating: number) => {
    const validRating = rating || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= validRating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {validRating > 0 && (
          <span className="text-sm font-medium text-gray-700 ml-1">{validRating}</span>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Căutăm nutriționiștii perfecți pentru tine</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Analizăm profilurile și găsim specialiștii care se potrivesc cel mai bine cu obiectivele tale
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Modifică căutarea
            </button>
            <span className="text-2xl font-bold text-green-600">NutriFind</span>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Acasă
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {userPreferences?.name ? `Bună, ${userPreferences.name}! ` : ''}
                Iată nutriționiștii tăi recomandați
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Am găsit <span className="font-bold text-green-600">{filteredNutritionists.length} specialiști</span> potriviți pentru obiectivul tău
              </p>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {filteredNutritionists.map((nutritionist, index) => (
              <div
                key={nutritionist.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-[1.01] border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Section - Fixed Width */}
                    <div className="flex gap-4 lg:flex-shrink-0 lg:w-80">
                      {/* Avatar - Fixed size */}
                      <div className="flex-shrink-0">
                        {nutritionist.profile_photo_url ? (
                          <img
                            src={nutritionist.profile_photo_url}
                            alt="Avatar"
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold border-2 border-gray-100">
                            {nutritionist.full_name
                              ? nutritionist.full_name.split(' ').map(n => n[0]).join('')
                              : 'NN'}
                          </div>
                        )}
                      </div>

                      {/* Name & Info */}
                      <div className="flex-1 min-w-0">
                        {/* Name - Fixed height */}
                        <div className="h-14 flex flex-col justify-center mb-3">
                          <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2">
                            {nutritionist.full_name}
                          </h3>
                        </div>

                        {/* Rating - Fixed height */}
                        <div className="h-6 flex items-center gap-2 mb-3">
                          {renderStars(nutritionist.average_rating || 0)}
                        </div>

                        {/* Experience & Location - Fixed height */}
                        <div className="h-10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="whitespace-nowrap">{nutritionist.years_experience} ani exp.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{nutritionist.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Flexible */}
                    <div className="flex-1 lg:pl-6 lg:border-l border-gray-100 min-h-[160px] flex flex-col">
                      {/* Price - Fixed position top right on mobile */}
                      <div className="lg:hidden mb-4 text-right">
                        <div className="text-lg text-gray-500 mb-1">de la</div>
                        <div className="text-2xl font-bold text-green-600">
                          {getLowestPrice(nutritionist.services)} RON
                        </div>
                      </div>

                      {/* Specializations - Fixed height */}
                      <div className="mb-4 h-12 flex items-start">
                        <div className="flex flex-wrap gap-2">
                          {nutritionist.specializations.slice(0, 3).map((spec) => (
                            <span key={spec} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                              <span>{getSpecializationEmoji(spec)}</span>
                              <span className="hidden sm:inline">{getSpecializationLabel(spec)}</span>
                              <span className="sm:hidden">{getSpecializationLabel(spec).split(' ')[0]}</span>
                            </span>
                          ))}
                          {nutritionist.specializations.length > 3 && (
                            <span className="text-gray-500 text-sm px-2 py-1.5 flex items-center">+{nutritionist.specializations.length - 3}</span>
                          )}
                        </div>
                      </div>

                      {/* Bio - Fixed height with consistent truncation */}
                      <div className="mb-4 h-10 flex items-start">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {nutritionist.bio}
                        </p>
                      </div>

                      {/* Features - Fixed height */}
                      <div className="flex-1 flex items-start">
                        <div className="flex flex-wrap gap-2">
                          {nutritionist.consultation_types.includes('online') && (
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                              💻 <span className="hidden sm:inline">Consultații </span>Online
                            </span>
                          )}
                          {nutritionist.consultation_types.includes('in-person') && (
                            <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                              🏢 <span className="hidden sm:inline">Cabinet </span>Fizic
                            </span>
                          )}
                          {nutritionist.languages.length > 1 && (
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                              🌍 {nutritionist.languages.length} limbi
                            </span>
                          )}
                          {nutritionist.certifications.length > 0 && (
                            <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                              🏆 Certificat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Section - Fixed Width */}
                    <div className="lg:flex-shrink-0 lg:w-48 flex lg:flex-col lg:justify-between gap-4 lg:gap-0">
                      {/* Price for desktop */}
                      <div className="hidden lg:block text-right mb-4">
                        <div className="text-sm text-gray-500 mb-1">de la</div>
                        <div className="text-2xl font-bold text-green-600">
                          {getLowestPrice(nutritionist.services)} RON
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3 w-full">
                        <button
                          onClick={() => handleBookConsultation(nutritionist)}
                          className="w-full bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
                        >
                          Programează
                        </button>

                        <button
                          onClick={() => handleViewProfile(nutritionist)}
                          className="w-full border-2 border-green-600 text-green-600 px-5 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium text-sm"
                        >
                          Vezi profilul
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button pentru mobile */}
          <div className="fixed bottom-6 right-6 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
                  {/* Call to Action Section */}
          <div className="bg-white border-t mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Nu ai găsit ce căutai?</h3>
                <p className="text-xl text-gray-600 mb-8">Îți putem trimite recomandări personalizate pe email</p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Trimite-mi recomandări
                  </button>
                </div>
              </div>
            </div>
          </div>
        <Footer />

        {/* Booking Modal */}
        {selectedNutritionist && (
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false)
              setSelectedNutritionist(null)
            }}
            onConfirm={handleBookingConfirmed}
            nutritionistId={selectedNutritionist.id!}
            nutritionistName={selectedNutritionist.full_name}
          />
        )}
      </div>
    </>
  )
}