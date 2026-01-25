import { supabase } from '../supabaseClient'
import type { NutritionistData, CreateNutritionistData, UpdateNutritionistData } from '../types/nutritionist'
import { sendAccountConfirmationEmail } from './emailService'

export class NutritionistService {
  // Încarcă datele unui nutriționist după ID
  static async getNutritionistById(id: string): Promise<{ data: NutritionistData | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('nutritionists')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { data: null, error }
      }

      // Transformă datele pentru a se potrivi cu interfața
      const transformedData: NutritionistData = {
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
        documents_uploaded: data.documents_uploaded || { cdr_certificate: false, course_certificate: false, practice_notice: false }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Încarcă datele unui nutriționist după user_id (pentru editare)
  static async getNutritionistByUserId(userId: string): Promise<{ data: NutritionistData | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('nutritionists')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        return { data: null, error }
      }

      const transformedData: NutritionistData = {
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
        documents_uploaded: data.documents_uploaded || { cdr_certificate: false, course_certificate: false, practice_notice: false }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Creează un profil nou
  static async createNutritionist(nutritionistData: CreateNutritionistData): Promise<{ data: NutritionistData | null, error: any }> {
    try {
      const dataToSave = {
        ...nutritionistData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('nutritionists')
        .insert([dataToSave])
        .select()
        .single()

      if (error) {
        return { data: null, error }
      }
      if (data && data.email) {
        const emailResult = await sendAccountConfirmationEmail({
          toEmail: data.email,
        });

        if (emailResult.success) {
          // Email sent successfully
        } else {
          // Email could not be sent but account was created

        }
      } else {
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Actualizează un profil existent
  static async updateNutritionist(nutritionistData: UpdateNutritionistData): Promise<{ data: NutritionistData | null, error: any }> {
    try {
      const dataToUpdate = {
        ...nutritionistData,
        consultation_duration: parseInt(nutritionistData.consultation_duration?.toString() || '60'),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('nutritionists')
        .update(dataToUpdate)
        .eq('id', nutritionistData.id)
        .select()
        .single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Încarcă toți nutriționiștii activi (pentru listări publice)
  static async getVerifiedNutritionists(): Promise<{ data: NutritionistData[], error: any }> {
    try {
      const { data, error } = await supabase
        .from('nutritionists')
        .select('*')
        .eq('account_status', 'active');

      if (error) {
        return { data: [], error }
      }

      const transformedData = data.map(item => ({
        ...item,
        birth_date: item.birth_date?.split('T')[0] || '',
        education: item.education || [],
        certifications: item.certifications || [],
        services: item.services || [],
        work_types: item.work_types || [],
        specializations: item.specializations || [],
        consultation_types: item.consultation_types || [],
        work_days: item.work_days || [],
        languages: item.languages || ['Română'],
        documents_uploaded: item.documents_uploaded || { cdr_certificate: false, course_certificate: false, practice_notice: false }
      }))

      return { data: transformedData, error: null }
    } catch (error) {
      return { data: [], error }
    }
  }

  // Upload fișier document
  static async uploadDocument(
    userId: string,
    nutritionistId: string,
    documentType: 'cdr_certificate' | 'course_certificate' | 'practice_notice',
    file: File
  ): Promise<{ success: boolean, error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${documentType}.${fileExt}`

      // Upload la storage
      const { error: uploadError } = await supabase.storage
        .from('nutritionist-documents')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        return { success: false, error: uploadError }
      }

      // Salvează referința în BD
      const { error: dbError } = await supabase
        .from('nutritionist_documents')
        .upsert({
          nutritionist_id: nutritionistId,
          document_type: documentType,
          file_url: fileName,
          file_name: file.name
        }, {
          onConflict: 'nutritionist_id,document_type'
        })

      if (dbError) {
        return { success: false, error: dbError }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error }
    }
  }

  static async uploadProfilePhoto(
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: any }> {
    // 1. upload (upsert) to bucket
    const path = `${userId}/avatar.jpg`         // or keep original file.name
    const { error: uploadError } = await supabase
      .storage
      .from('profile-photos')
      .upload(path, file, { upsert: true })

    if (uploadError) return { url: null, error: uploadError }

    // 2. get public URL
    const { data } = supabase
      .storage
      .from('profile-photos')
      .getPublicUrl(path)

    return { url: data?.publicUrl ?? null, error: null }
  }
}