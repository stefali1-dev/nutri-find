export interface ReviewData {
  id?: string
  nutritionist_id: string
  author_name: string
  rating: number
  comment: string
  is_verified: boolean
  helpful_count: number
  created_at?: string
  updated_at?: string
}

export interface CreateReviewData extends Omit<
  ReviewData,
  'id' | 'created_at' | 'updated_at' | 'helpful_count'
> {}

export interface UpdateReviewData extends Partial<ReviewData> {
  id: string
}
