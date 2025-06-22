import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface LocationSearchProps {
  formData: { location?: string };
  updateFormData: (field: string, value: string) => void;
}

const LocationSearch = ({ formData, updateFormData }: LocationSearchProps) => {
  const [inputValue, setInputValue] = useState(formData.location || '');
  interface LocationSuggestion {
    name: string;
    county: string;
  }
  
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Căutare cu debouncing
  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('romanian_locations')
        .select('name, county')
        .ilike('name', `%${inputValue}%`)
        .limit(10);

      if (!error) setSuggestions(data || []);
      setIsLoading(false);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (location: LocationSuggestion) => {
    setInputValue(location.name);
    updateFormData('location', location.name);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">Localitatea</label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="ex: București, Cluj-Napoca"
        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
      />
      
      {isLoading && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-xl p-2 border border-gray-200">
          <p className="text-gray-500">Se încarcă...</p>
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-xl border border-gray-200 mt-1 max-h-60 overflow-auto">
          {suggestions.map((loc) => (
            <div
              key={`${loc.name}-${loc.county}`}
              className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleSelect(loc)}
            >
              <div className="font-medium">{loc.name}</div>
              {loc.county && <div className="text-sm text-gray-500">{loc.county}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;