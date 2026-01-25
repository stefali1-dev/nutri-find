import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { NutritionistData } from '@/lib/types/nutritionist'
import { NutritionistService } from '@/lib/services/nutritionistService'
import BookingModal, { BookingData } from '../../components/BookingModal'
import Footer from '@/components/Footer'
import { NutritionistCard } from '@/components/ui/nutritionist-card'

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
    if (!services || services.length === 0) return 0
    return Math.min(...services.map(s => parseInt(s.price)))
  }

  const handleBookingConfirmed = (data: BookingData) => {
    // Close modal and show success message
    setShowBookingModal(false)
    setSelectedNutritionist(null)
    
    // Show success notification
    alert('Programare confirmată! Vei primi un email de confirmare.')
    
    // Optional: redirect to a confirmation page or show inline success message
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
          <div className="max-w-6xl mx-auto px-4 py-4 relative flex items-center justify-between">
            <button
              onClick={() => router.push('/cauta-nutritionist')}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Modifică căutarea
            </button>
            <Link href="/">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">
                NutriFind
              </span>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors cursor-pointer"
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
            {filteredNutritionists.map((nutritionist) => (
              <NutritionistCard
                key={nutritionist.id}
                id={nutritionist.id!}
                fullName={nutritionist.full_name}
                profilePhotoUrl={nutritionist.profile_photo_url}
                yearsExperience={nutritionist.years_experience}
                location={nutritionist.location}
                specializations={nutritionist.specializations}
                bio={nutritionist.bio}
                consultationTypes={nutritionist.consultation_types}
                languages={nutritionist.languages}
                certifications={nutritionist.certifications}
                services={nutritionist.services}
                onBookClick={() => handleBookConsultation(nutritionist)}
                onViewProfileClick={() => handleViewProfile(nutritionist)}
              />
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