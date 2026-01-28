import { supabase } from '@/lib/supabaseClient'
import type { ReviewData, CreateReviewData } from '@/lib/types/review'

export class ReviewService {
  /**
   * Get all reviews for a specific nutritionist
   */
  static async getReviewsByNutritionist(nutritionistId: string): Promise<{ data: ReviewData[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
        return { data: null, error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error fetching reviews:', error)
      return { data: null, error }
    }
  }

  /**
   * Create a new review
   */
  static async createReview(reviewData: CreateReviewData): Promise<{ data: ReviewData | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          nutritionist_id: reviewData.nutritionist_id,
          author_name: reviewData.author_name,
          rating: reviewData.rating,
          comment: reviewData.comment,
          is_verified: reviewData.is_verified
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating review:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating review:', error)
      return { data: null, error }
    }
  }

  /**
   * Increment the helpful count for a review
   */
  static async incrementHelpful(reviewId: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase.rpc('increment_review_helpful', { review_id: reviewId })

      if (error) {
        // Fallback to manual increment if RPC doesn't exist
        const { data: review, error: fetchError } = await supabase
          .from('reviews')
          .select('helpful_count')
          .eq('id', reviewId)
          .single()

        if (fetchError || !review) {
          console.error('Error fetching review for helpful increment:', fetchError)
          return { success: false, error: fetchError }
        }

        const { error: updateError } = await supabase
          .from('reviews')
          .update({ helpful_count: review.helpful_count + 1 })
          .eq('id', reviewId)

        if (updateError) {
          console.error('Error incrementing helpful count:', updateError)
          return { success: false, error: updateError }
        }

        return { success: true, error: null }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error incrementing helpful count:', error)
      return { success: false, error }
    }
  }

  /**
   * Get review statistics for a nutritionist
   */
  static async getReviewStats(nutritionistId: string): Promise<{ 
    data: { 
      total: number, 
      average: number,
      distribution: { [key: number]: number }
    } | null, 
    error: any 
  }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('nutritionist_id', nutritionistId)

      if (error) {
        console.error('Error fetching review stats:', error)
        return { data: null, error }
      }

      if (!data || data.length === 0) {
        return { 
          data: { 
            total: 0, 
            average: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          }, 
          error: null 
        }
      }

      const total = data.length
      const sum = data.reduce((acc, review) => acc + review.rating, 0)
      const average = Math.round((sum / total) * 10) / 10

      const distribution = data.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1
        return acc
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number })

      return { 
        data: { total, average, distribution }, 
        error: null 
      }
    } catch (error) {
      console.error('Unexpected error fetching review stats:', error)
      return { data: null, error }
    }
  }
}
