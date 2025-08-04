import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
  placeholder?: string
  className?: string
}

interface Location {
  name: string
  county: string
}

export default function LocationSearch({ 
  value, 
  onChange, 
  error = false,
  placeholder = "Caută localitatea...",
  className = ""
}: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse the initial value to extract location name
  useEffect(() => {
    if (value && value.includes(',')) {
      // Handle legacy format "Town, County" - extract just the town
      const [name] = value.split(',').map(s => s.trim())
      setSelectedLocation({ name, county: '' })
      setSearchQuery(name)
    } else if (value) {
      setSearchQuery(value)
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Search locations
  useEffect(() => {
    const searchLocations = async () => {
      if (searchQuery.length < 2) {
        setLocations([])
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('romanian_locations')
          .select('name, county')
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .limit(10)

        if (error) throw error

        setLocations(data || [])
      } catch (error) {
        console.error('Error searching locations:', error)
        setLocations([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchLocations, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location)
    setSearchQuery(location.name)
    onChange(location.name)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchQuery(newValue)
    setSelectedLocation(null)
    onChange(newValue)
    
    if (newValue.length >= 2) {
      setIsOpen(true)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedLocation(null)
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full p-3 pl-10 pr-10 border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-xl focus:border-green-500 focus:outline-none transition-colors`}
        />
        
        {/* Location icon */}
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>

        {/* Clear button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <p className="text-sm text-gray-500 mt-2">Se caută...</p>
            </div>
          ) : locations.length > 0 ? (
            <ul className="py-1">
              {locations.map((location, index) => (
                <li key={`${location.name}-${location.county}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectLocation(location)}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <svg 
                        className="w-5 h-5 text-gray-400 mr-3 group-hover:text-green-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-800">{location.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{location.county}</span>
                      </div>
                    </div>
                    <svg 
                      className="w-5 h-5 text-gray-300 group-hover:text-green-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Nu am găsit nicio localitate</p>
              <p className="text-xs mt-1">Încearcă alt termen de căutare</p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">Introdu minim 2 caractere pentru căutare</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}