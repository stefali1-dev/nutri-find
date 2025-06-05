export interface NutritionistData {
  id?: string
  email: string
  fullName: string
  phone: string
  birthDate: string
  gender: string
  licenseNumber: string
  yearsExperience: string
  workType: string[]
  specializations: string[]
  education: {
    degree: string
    university: string
    graduationYear: string
  }[]
  certifications: {
    name: string
    issuer: string
    year: string
  }[]
  consultationTypes: string[]
  services: {
    name: string
    duration: string
    price: string
    description: string
  }[]
  workDays: string[]
  workHours: {
    start: string
    end: string
  }
  consultationDuration: string
  bio: string
  profilePhoto: string
  languages: string[]
  location: string
  documents: {
    diploma: File | null
    certificate: File | null
  }
  termsAccepted: boolean
  rating?: number
  totalReviews?: number
  nextAvailable?: string
}