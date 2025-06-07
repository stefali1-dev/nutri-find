import { useState, useEffect } from 'react'
import { NutritionistService } from '../services/nutritionistService'
import type { NutritionistData } from '../types/nutritionist'

export const useNutritionist = (id?: string) => {
  const [nutritionist, setNutritionist] = useState<NutritionistData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNutritionist = async (nutritionistId: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error: serviceError } = await NutritionistService.getNutritionistById(nutritionistId)
    
    if (serviceError) {
      setError(serviceError.message || 'Eroare la încărcarea datelor')
      setNutritionist(null)
    } else {
      setNutritionist(data)
    }
    
    setLoading(false)
  }

  const loadNutritionistByUserId = async (userId: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error: serviceError } = await NutritionistService.getNutritionistByUserId(userId)
    
    if (serviceError) {
      setError(serviceError.message || 'Eroare la încărcarea datelor')
      setNutritionist(null)
    } else {
      setNutritionist(data)
    }
    
    setLoading(false)
  }

  const updateNutritionist = (newData: Partial<NutritionistData>) => {
    setNutritionist(prev => prev ? { ...prev, ...newData } : null)
  }

  const refreshNutritionist = () => {
    if (id) {
      loadNutritionist(id)
    }
  }

  useEffect(() => {
    if (id) {
      loadNutritionist(id)
    }
  }, [id])

  return {
    nutritionist,
    loading,
    error,
    loadNutritionist,
    loadNutritionistByUserId,
    updateNutritionist,
    refreshNutritionist,
    setError
  }
}

// Hook pentru lista de nutriționiști
export const useNutritionistsList = () => {
  const [nutritionists, setNutritionists] = useState<NutritionistData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNutritionists = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: serviceError } = await NutritionistService.getVerifiedNutritionists()
    
    if (serviceError) {
      setError(serviceError.message || 'Eroare la încărcarea datelor')
      setNutritionists([])
    } else {
      setNutritionists(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadNutritionists()
  }, [])

  return {
    nutritionists,
    loading,
    error,
    refreshNutritionists: loadNutritionists
  }
}