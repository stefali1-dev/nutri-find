import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Nutritionist {
  id: string
  name: string
  photo: string
  specializations: string[]
  experience: string
  rating: number
  reviewCount: number
  price: string
  consultationType: string[]
  availability: string
  description: string
  badges: string[]
  responseTime: string
  successStories: number
}

// Mock data - în producție ar veni din API
const mockNutritionists: Nutritionist[] = [
  {
    id: '1',
    name: 'Dr. Maria Popescu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=b6e3f4',
    specializations: ['Slăbire sănătoasă', 'Nutriție sportivă', 'Diabet'],
    experience: '8 ani experiență',
    rating: 4.9,
    reviewCount: 127,
    price: '250 RON',
    consultationType: ['online', 'in-person'],
    availability: 'Disponibil în 2 zile',
    description: 'Specialist în nutriție clinică cu experiență vastă în managementul greutății și nutriție sportivă.',
    badges: ['Top Rated', 'Verificat'],
    responseTime: 'Răspunde în ~2 ore',
    successStories: 89
  },
  {
    id: '2',
    name: 'Andreea Ionescu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andreea&backgroundColor=ffd5dc',
    specializations: ['Vegetarian/Vegan', 'Alergii alimentare', 'Sănătate digestivă'],
    experience: '5 ani experiență',
    rating: 4.8,
    reviewCount: 94,
    price: '200 RON',
    consultationType: ['online'],
    availability: 'Disponibil azi',
    description: 'Pasionată de nutriție plant-based și sănătate holistică. Abordare personalizată pentru fiecare client.',
    badges: ['Răspuns rapid', 'Eco-friendly'],
    responseTime: 'Răspunde în ~30 min',
    successStories: 67
  },
  {
    id: '3',
    name: 'Mihai Dumitrescu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihai&backgroundColor=c9f7f5',
    specializations: ['Creștere masă musculară', 'Nutriție sportivă', 'Recuperare'],
    experience: '3 ani experiență',
    rating: 4.7,
    reviewCount: 56,
    price: '150 RON',
    consultationType: ['online', 'in-person'],
    availability: 'Disponibil mâine',
    description: 'Fost sportiv de performanță, acum ajut alți sportivi să își atingă potențialul maxim.',
    badges: ['Rising Star', 'Sportiv'],
    responseTime: 'Răspunde în ~1 oră',
    successStories: 45
  },
  {
    id: '4',
    name: 'Elena Radu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd9a6',
    specializations: ['Nutriție pediatrică', 'Sarcină și alăptare', 'Familie'],
    experience: '10 ani experiență',
    rating: 5.0,
    reviewCount: 203,
    price: '300 RON',
    consultationType: ['in-person'],
    availability: 'Disponibil în 3 zile',
    description: 'Specialist în nutriție pentru copii și mame. Creez planuri nutritive pentru întreaga familie.',
    badges: ['Expert', 'Family-friendly'],
    responseTime: 'Răspunde în ~4 ore',
    successStories: 156
  },
  {
    id: '5',
    name: 'Alexandru Popa',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandru&backgroundColor=a6d9f7',
    specializations: ['Keto', 'Intermittent fasting', 'Biohacking'],
    experience: '2 ani experiență',
    rating: 4.6,
    reviewCount: 34,
    price: 'GRATUIT - primele 3 consultații',
    consultationType: ['online'],
    availability: 'Disponibil azi',
    description: 'Nutriționist începător, pasionat de abordări moderne. Ofer consultații gratuite pentru experiență!',
    badges: ['Ofertă specială', 'Începător motivat'],
    responseTime: 'Răspunde instant',
    successStories: 28
  }
]

export default function Results() {
  const router = useRouter()
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>(mockNutritionists)
  const [filteredNutritionists, setFilteredNutritionists] = useState<Nutritionist[]>(mockNutritionists)
  const [isLoading, setIsLoading] = useState(true)
  const [savedFormData, setSavedFormData] = useState<any>(null)
  
  // Filters
  const [priceFilter, setPriceFilter] = useState('all')
  const [consultationFilter, setConsultationFilter] = useState('all')
  const [specializationFilter, setSpecializationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
    
    // Get saved form data
    const formData = localStorage.getItem('nutriForm')
    if (formData) {
      setSavedFormData(JSON.parse(formData))
    }
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...nutritionists]

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(n => {
        if (priceFilter === 'free') return n.price.includes('GRATUIT')
        if (priceFilter === '0-200') return parseInt(n.price) <= 200
        if (priceFilter === '200-500') return parseInt(n.price) > 200 && parseInt(n.price) <= 500
        return true
      })
    }

    // Consultation type filter
    if (consultationFilter !== 'all') {
      filtered = filtered.filter(n => n.consultationType.includes(consultationFilter))
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(n => 
        n.specializations.some(s => s.toLowerCase().includes(specializationFilter.toLowerCase()))
      )
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const priceA = a.price.includes('GRATUIT') ? 0 : parseInt(a.price)
        const priceB = b.price.includes('GRATUIT') ? 0 : parseInt(b.price)
        return priceA - priceB
      })
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => {
        const priceA = a.price.includes('GRATUIT') ? 0 : parseInt(a.price)
        const priceB = b.price.includes('GRATUIT') ? 0 : parseInt(b.price)
        return priceB - priceA
      })
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience)
        const expB = parseInt(b.experience)
        return expB - expA
      })
    }

    setFilteredNutritionists(filtered)
  }, [priceFilter, consultationFilter, specializationFilter, sortBy, nutritionists])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Căutăm nutriționiștii perfecți pentru tine...</h2>
          <p className="text-gray-600">Analizăm preferințele tale și potrivim cei mai buni specialiști</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Rezultate - Nutriționiști Recomandați | NutriConnect</title>
        <meta name="description" content="Nutriționiști verificați care se potrivesc perfect cu nevoile tale" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Rezultate căutare</span>
              </div>
              <button
                onClick={() => router.push('/find-nutritionist')}
                className="text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Modifică preferințele
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Am găsit {filteredNutritionists.length} nutriționiști pentru tine! 🎉
                </h1>
                <p className="text-gray-600">
                  Bazat pe preferințele tale: {savedFormData?.goal === 'weight-loss' && 'Slăbire sănătoasă'} 
                  {savedFormData?.goal === 'muscle-gain' && 'Creștere masă musculară'}
                  {savedFormData?.goal === 'health-condition' && 'Gestionare condiție medicală'}
                  {savedFormData?.goal === 'sports-nutrition' && 'Nutriție sportivă'}
                  {savedFormData?.goal === 'general-health' && 'Alimentație sănătoasă'}
                  {savedFormData?.budget === 'free' && ' • Consultații gratuite'}
                  {savedFormData?.consultationType && ` • ${savedFormData.consultationType === 'online' ? 'Online' : savedFormData.consultationType === 'in-person' ? 'În persoană' : 'Hibrid'}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtre
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'fixed inset-0 z-50 bg-white md:relative md:inset-auto' : 'hidden md:block'} md:w-64 flex-shrink-0`}>
              <div className="bg-white rounded-xl shadow-lg p-6 md:sticky md:top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Filtrează rezultatele</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sortează după</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="recommended">Recomandat pentru tine</option>
                    <option value="rating">Rating</option>
                    <option value="price-low">Preț: Mic → Mare</option>
                    <option value="price-high">Preț: Mare → Mic</option>
                    <option value="experience">Experiență</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preț per consultație</label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Toate prețurile' },
                      { value: 'free', label: 'Gratuit' },
                      { value: '0-200', label: '0 - 200 RON' },
                      { value: '200-500', label: '200 - 500 RON' },
                      { value: '500+', label: 'Peste 500 RON' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          value={option.value}
                          checked={priceFilter === option.value}
                          onChange={(e) => setPriceFilter(e.target.value)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tip consultație</label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Toate' },
                      { value: 'online', label: 'Online' },
                      { value: 'in-person', label: 'În persoană' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="consultation"
                          value={option.value}
                          checked={consultationFilter === option.value}
                          onChange={(e) => setConsultationFilter(e.target.value)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specialization Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializare</label>
                  <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="all">Toate specializările</option>
                    <option value="slăbire">Slăbire</option>
                    <option value="sportivă">Nutriție sportivă</option>
                    <option value="diabet">Diabet</option>
                    <option value="vegan">Vegetarian/Vegan</option>
                    <option value="alergii">Alergii alimentare</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setPriceFilter('all')
                    setConsultationFilter('all')
                    setSpecializationFilter('all')
                    setSortBy('recommended')
                  }}
                  className="w-full text-green-600 hover:text-green-700 text-sm"
                >
                  Resetează filtrele
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              {filteredNutritionists.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nu am găsit rezultate</h3>
                  <p className="text-gray-600 mb-4">Încearcă să ajustezi filtrele pentru mai multe rezultate</p>
                  <button
                    onClick={() => {
                      setPriceFilter('all')
                      setConsultationFilter('all')
                      setSpecializationFilter('all')
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    Resetează filtrele
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredNutritionists.map((nutritionist, index) => (
                    <div
                      key={nutritionist.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={nutritionist.photo}
                              alt={nutritionist.name}
                              className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
                            />
                          </div>

                          {/* Main Info */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-800">{nutritionist.name}</h3>
                                  {nutritionist.badges.map(badge => (
                                    <span
                                      key={badge}
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        badge === 'Top Rated' ? 'bg-yellow-100 text-yellow-800' :
                                        badge === 'Verificat' ? 'bg-green-100 text-green-800' :
                                        badge === 'Ofertă specială' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-medium">{nutritionist.rating}</span>
                                    <span>({nutritionist.reviewCount} recenzii)</span>
                                  </span>
                                  <span>{nutritionist.experience}</span>
                                  <span className="text-green-600 font-medium">{nutritionist.responseTime}</span>
                                </div>

                                <p className="text-gray-600 mb-3">{nutritionist.description}</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  {nutritionist.specializations.map(spec => (
                                    <span key={spec} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                      {spec}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {nutritionist.successStories} povești de succes
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-600">
                                    {nutritionist.consultationType.includes('online') && (
                                      <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Online
                                      </>
                                    )}
                                    {nutritionist.consultationType.includes('online') && nutritionist.consultationType.includes('in-person') && ' • '}
                                    {nutritionist.consultationType.includes('in-person') && (
                                      <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        În persoană
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Price & Action */}
                              <div className="flex md:flex-col items-center md:items-end gap-4">
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${nutritionist.price.includes('GRATUIT') ? 'text-green-600' : 'text-gray-800'}`}>
                                    {nutritionist.price}
                                  </div>
                                  <div className="text-sm text-gray-500">per consultație</div>
                                  <div className="text-sm text-green-600 font-medium mt-1">
                                    {nutritionist.availability}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 whitespace-nowrap">
                                    Vezi profilul
                                  </button>
                                  <button className="text-green-600 hover:text-green-700 text-sm">
                                    Salvează
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {filteredNutritionists.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-all">
                    Vezi mai mulți nutriționiști
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Help Button */}
        <button className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-110">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Success Notification - shown when coming from form */}
        {savedFormData && (
          <div className="fixed top-20 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Căutare completă!</p>
              <p className="text-sm text-green-100">Am găsit nutriționiști perfecți pentru tine</p>
            </div>
            <button
              onClick={() => setSavedFormData(null)}
              className="ml-4 text-green-200 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}