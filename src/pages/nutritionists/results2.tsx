import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { NutritionistData } from '@/lib/types/nutritionist'
import { NutritionistService } from '@/lib/services/nutritionistService'
import { BookingData } from '@/components/BookingModal'
import { getSpecializationEmoji, getSpecializationLabel } from '@/lib/utils'

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
    // Salvăm ID-ul nutriționistului pentru pagina de booking
    sessionStorage.setItem('selectedNutritionist', nutritionist.id!)
    router.push(`/nutritionists/${nutritionist.id}/booking`)
  }

  const handleViewProfile = (nutritionist: NutritionistData) => {
    router.push(`/nutritionists/${nutritionist.id}`)
  }

  const getLowestPrice = (services: any[]) => {
    return Math.min(...services.map(s => parseInt(s.price)))
  }

  const handleBookingConfirmed = (data: BookingData) => {
    // 👉 here you can push to Supabase, send an email, etc.
    console.log('Booking confirmed:', data)
  }


  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
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
              Iată nutriționiștii tăi recomandați 🎯
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Am găsit <span className="font-bold text-green-600">{filteredNutritionists.length} specialiști</span> potriviți pentru obiectivul tău
            </p>

            {userPreferences?.goal && (
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                  {getSpecializationEmoji(userPreferences.goal)}
                  Obiectiv: {getSpecializationLabel(userPreferences.goal)}
                </span>
                {userPreferences.budget && (
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    💰 Buget: {userPreferences.budget} RON
                  </span>
                )}
                {userPreferences.consultationType && (
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    {userPreferences.consultationType === 'online' ? '💻' : userPreferences.consultationType === 'in-person' ? '🏢' : '🔄'}
                    {userPreferences.consultationType === 'online' ? 'Online' : userPreferences.consultationType === 'in-person' ? 'În persoană' : 'Hibrid'}
                  </span>
                )}
              </div>
            )}

            {/* TODO: */}
            {/* Filter Buttons */}
            {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrează rezultatele
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'price' | 'experience')}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none bg-white"
              >
                <option value="relevance">🎯 Relevanță</option>
                <option value="price-low">💰 Preț crescător</option>
                <option value="rating">⭐ Rating</option>
                <option value="experience">🏆 Experiență</option>
                <option value="availability">⏰ Disponibilitate</option>
              </select>
            </div> */}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 transition-all duration-300">
              <h3 className="font-bold text-gray-800 mb-4">Refinează căutarea</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💰 Buget</label>
                  <select
                    value={selectedFilters.price}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">Toate prețurile</option>
                    <option value="0-150">0 - 150 RON</option>
                    <option value="150-250">150 - 250 RON</option>
                    <option value="250-400">250 - 400 RON</option>
                    <option value="400+">400+ RON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏆 Experiență</label>
                  <select
                    value={selectedFilters.experience}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, experience: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">Orice experiență</option>
                    <option value="beginner">Începător (1-3 ani)</option>
                    <option value="intermediate">Intermediar (3-6 ani)</option>
                    <option value="expert">Expert (6+ ani)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📱 Tip consultație</label>
                  <select
                    value={selectedFilters.consultationType}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, consultationType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">Orice tip</option>
                    <option value="online">💻 Online</option>
                    <option value="in-person">🏢 În persoană</option>
                    <option value="hybrid">🔄 Hibrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">⏰ Disponibilitate</label>
                  <select
                    value={selectedFilters.availability}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, availability: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">Oricând</option>
                    <option value="today">Astăzi</option>
                    <option value="tomorrow">Mâine</option>
                    <option value="week">Săptămâna aceasta</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {filteredNutritionists.map((nutritionist, index) => (
            <div
              key={nutritionist.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:scale-[1.01]"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Profile Section */}
                  <div className="flex gap-4 lg:flex-shrink-0">

                    {/*  */}
                    {nutritionist.profile_photo_url ? (
                      <img
                        src={nutritionist.profile_photo_url}
                        alt="Avatar"
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex
        items-center justify-center text-white text-2xl font-bold">
                        {nutritionist.full_name
                          ? nutritionist.full_name.split(' ').map(n => n[0]).join('')
                          : 'NN'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{nutritionist.full_name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(nutritionist.average_rating!)}
                            <span className="text-sm text-gray-500">({nutritionist.total_reviews || 3} recenzii)</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-xl md:text-2xl font-bold text-green-600">
                            {getLowestPrice(nutritionist.services)} RON
                          </div>
                          <div className="text-sm text-gray-500">de la</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
                          <span className="whitespace-nowrap">{nutritionist.years_experience} ani exp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{nutritionist.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="whitespace-nowrap">Disponibil {nutritionist.next_available}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 lg:pl-6 lg:border-l border-gray-100">
                    {/* Specializations */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {nutritionist.specializations.slice(0, 3).map((spec) => (
                          <span key={spec} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                            <span>{getSpecializationEmoji(spec)}</span>
                            <span className="hidden sm:inline">{getSpecializationLabel(spec)}</span>
                            <span className="sm:hidden">{getSpecializationLabel(spec).split(' ')[0]}</span>
                          </span>
                        ))}
                        {nutritionist.specializations.length > 3 && (
                          <span className="text-gray-500 text-sm px-2 py-1">+{nutritionist.specializations.length - 3} mai multe</span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {nutritionist.bio}
                    </p>

                    {/* Services Preview */}
                    {/* <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {nutritionist.services.slice(0, 2).map((service, serviceIndex) => (
                          <div key={serviceIndex} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-gray-800 text-sm">{service.name}</span>
                                <div className="text-xs text-gray-500">{service.duration}</div>
                              </div>
                              <span className="font-bold text-green-600">{service.price} RON</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {nutritionist.consultation_types.includes('online') && (
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          💻 <span className="hidden sm:inline">Consultații </span>Online
                        </span>
                      )}
                      {nutritionist.consultation_types.includes('in-person') && (
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          🏢 <span className="hidden sm:inline">Cabinet </span>Fizic
                        </span>
                      )}
                      {nutritionist.languages.length > 1 && (
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          🌍 {nutritionist.languages.length} limbi
                        </span>
                      )}
                      {nutritionist.certifications.length > 0 && (
                        <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          🏆 Certificat
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="lg:flex-shrink-0 lg:w-44">
                    <div className="space-y-3">
                      <button
                        onClick={() => handleBookConsultation(nutritionist)}
                        className="w-full bg-green-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm lg:text-base"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                        </svg>
                        <span className="hidden sm:inline">Programează</span>
                        <span className="sm:hidden">Program</span>
                      </button>

                      {/* TODO */}
                      {/* <BookingModal
                        nutritionist={nutritionist}
                        onBook={handleBookingConfirmed}
                      /> */}

                      <button
                        onClick={() => handleViewProfile(nutritionist)}
                        className="w-full border-2 border-green-600 text-green-600 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium text-sm lg:text-base"
                      >
                        <span className="hidden sm:inline">Vezi profilul</span>
                        <span className="sm:hidden">Profil</span>
                      </button>

                      <div className="text-center">
                        <button className="text-gray-500 hover:text-red-500 text-sm flex items-center justify-center gap-1 mx-auto transition-colors p-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="hidden lg:inline">Salvează</span>
                        </button>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    {/* <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-green-600 font-bold text-lg">
                          {Math.floor(Math.random() * 20) + 85}%
                        </div>
                        <div className="text-green-700 text-xs font-medium">Compatibilitate</div>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.floor(Math.random() * 20) + 85}%` }}
                        ></div>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-base md:text-lg font-bold text-gray-800">{Math.floor(Math.random() * 200) + 50}</div>
                      <div className="text-xs text-gray-500">Clienți ajutați</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-bold text-gray-800">{Math.floor(Math.random() * 10) + 15} zile</div>
                      <div className="text-xs text-gray-500">Timp mediu rezultate</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-bold text-gray-800">{Math.floor(Math.random() * 5) + 95}%</div>
                      <div className="text-xs text-gray-500">Rate succes</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-bold text-gray-800">&lt; 2h</div>
                      <div className="text-xs text-gray-500">Timp răspuns</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium flex items-center justify-center gap-2 mx-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Încarcă mai mulți nutriționiști
          </button>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Nu ai găsit ce căutai? 🤔</h3>
            <p className="text-xl text-gray-600 mb-8">Îți putem trimite recomandări personalizate pe email sau îți putem ajuta să găsești exact ce ai nevoie</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Trimite-mi recomandări
              </button>

              <button
                onClick={() => router.push('/')}
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Refinează căutarea
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t pt-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm font-medium text-gray-800">Verificați</div>
              <div className="text-xs text-gray-500">Toți nutriționiștii sunt licențiați CDR</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-sm font-medium text-gray-800">Specialiști</div>
              <div className="text-xs text-gray-500">Cea mai mare rețea din România</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.9★</div>
              <div className="text-sm font-medium text-gray-800">Rating mediu</div>
              <div className="text-xs text-gray-500">Peste 15,000 de recenzii reale</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
              <div className="text-sm font-medium text-gray-800">Conectare rapidă</div>
              <div className="text-xs text-gray-500">Contact în maximum 24 de ore</div>
            </div>
          </div>
        </div>
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
  )
}