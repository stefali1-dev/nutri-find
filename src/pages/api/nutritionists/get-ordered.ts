import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import type { NutritionistData } from '@/lib/types/nutritionist'

/**
 * Serverless API endpoint for fetching nutritionists with smart semi-random ordering.
 * 
 * Algorithm:
 * - Prioritizes nutritionists with profile photos
 * - Uses weighted interleaving to create natural-looking results
 * - Applies randomization for fairness and variety
 * - Typically shows 2-4 with photos, then 1-2 without, repeating
 */

interface OrderedNutritionistResponse {
  success: boolean
  data?: NutritionistData[]
  error?: string
  count?: number
}

/**
 * Simple seeded random number generator (Mulberry32)
 * Returns consistent pseudo-random numbers for the same seed
 */
function seededRandom(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/**
 * Get daily seed based on current date (UTC)
 * Same seed for entire day, changes at midnight UTC
 */
function getDailySeed(): number {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()
  // Combine date components into a seed
  return year * 10000 + month * 100 + day
}

/**
 * Fisher-Yates shuffle algorithm with seeded random
 * Uses daily seed to maintain consistent order throughout the day
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  const rng = seededRandom(getDailySeed())
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Smart interleaving algorithm that creates natural-looking results
 * while prioritizing nutritionists with profile photos.
 * 
 * @param withPhotos - Nutritionists that have profile photos
 * @param withoutPhotos - Nutritionists without profile photos
 * @returns Interleaved array with weighted preference for those with photos
 */
function smartInterleave(
  withPhotos: NutritionistData[],
  withoutPhotos: NutritionistData[]
): NutritionistData[] {
  const result: NutritionistData[] = []
  let photoIndex = 0
  let noPhotoIndex = 0

  while (photoIndex < withPhotos.length || noPhotoIndex < withoutPhotos.length) {
    // Add 2-4 nutritionists with photos (randomly chosen)
    const withPhotoCount = Math.floor(Math.random() * 3) + 2 // Random between 2 and 4
    
    for (let i = 0; i < withPhotoCount && photoIndex < withPhotos.length; i++) {
      result.push(withPhotos[photoIndex++])
    }

    // Add 1-2 nutritionists without photos (randomly chosen)
    const withoutPhotoCount = Math.floor(Math.random() * 2) + 1 // Random between 1 and 2
    
    for (let i = 0; i < withoutPhotoCount && noPhotoIndex < withoutPhotos.length; i++) {
      result.push(withoutPhotos[noPhotoIndex++])
    }
  }

  return result
}

/**
 * Transform database records to match NutritionistData interface
 */
function transformNutritionist(data: any): NutritionistData {
  return {
    ...data,
    birth_date: data.birth_date?.split('T')[0] || '',
    education: data.education || [],
    certifications: data.certifications || [],
    services: data.services || [],
    work_types: data.work_types || [],
    specializations: data.specializations || [],
    consultation_types: data.consultation_types || [],
    work_days: data.work_days || [],
    languages: data.languages || ['Română'],
    documents_uploaded: data.documents_uploaded || {
      cdr_certificate: false,
      course_certificate: false,
      practice_notice: false
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderedNutritionistResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    })
  }

  try {
    // Initialize Supabase client (server-side with service role would be better for production)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all active nutritionists from database
    const { data, error } = await supabase
      .from('nutritionists')
      .select('*')
      .eq('account_status', 'active')

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch nutritionists from database'
      })
    }

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        count: 0
      })
    }

    // Transform database records
    const nutritionists = data.map(transformNutritionist)

    // Separate into two groups: with and without profile photos
    const withPhotos: NutritionistData[] = []
    const withoutPhotos: NutritionistData[] = []

    nutritionists.forEach(nutritionist => {
      if (nutritionist.profile_photo_url && nutritionist.profile_photo_url.trim() !== '') {
        withPhotos.push(nutritionist)
      } else {
        withoutPhotos.push(nutritionist)
      }
    })

    // Shuffle both groups for randomness
    const shuffledWithPhotos = shuffleArray(withPhotos)
    const shuffledWithoutPhotos = shuffleArray(withoutPhotos)

    // Apply smart interleaving algorithm
    const orderedNutritionists = smartInterleave(shuffledWithPhotos, shuffledWithoutPhotos)

    // Return ordered results
    return res.status(200).json({
      success: true,
      data: orderedNutritionists,
      count: orderedNutritionists.length
    })

  } catch (error) {
    console.error('Unexpected error in get-ordered API:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    })
  }
}
