export interface NutritionistData {
  id?: string
  user_id?: string
  email: string
  full_name: string
  phone: string
  birth_date: string
  gender: string
  license_number: string
  years_experience: string
  work_types: string[]
  specializations: string[]
  education: {
    degree: string
    university: string
    graduation_year: string
  }[]
  certifications: {
    name: string
    issuer: string
    year: string
  }[]
  consultation_types: string[]
  services: {
    name: string
    duration: string
    price: string
    description: string
  }[]
  work_days: string[]
  work_hours: {
    start: string
    end: string
  }
  consultation_duration: number
  bio: string
  profile_photo_url: string
  languages: string[]
  location: string
  documents_uploaded: {
    diploma: boolean
    certificate: boolean
  }
  verification_status: string
  average_rating?: number
  total_consultations?: number
  total_reviews?: number
  next_available?: string
}

export interface CreateNutritionistData extends Omit<
  NutritionistData,
  | 'id'
  | 'average_rating'
  | 'total_consultations'
  | 'total_reviews'
  | 'birth_date'
  | 'gender'
  | 'license_number'
  | 'education'
  | 'certifications'
  | 'work_types'
  | 'work_days'
  | 'work_hours'
  | 'profile_photo_url'
  | 'documents_uploaded'
  | 'verification_status'
  | 'next_available'
  | 'consultation_duration'
> {}

export interface UpdateNutritionistData extends Partial<NutritionistData> {
  id: string
}