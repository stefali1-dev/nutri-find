import { supabase } from '../supabaseClient'
import type { BookingRequest, CreateBookingRequestData, UpdateBookingRequestData } from '../types/booking'

export class BookingService {
  // Creează o cerere de programare
  static async createBookingRequest(requestData: CreateBookingRequestData): Promise<{ data: BookingRequest | null, error: any }> {
    try {
      const dataToSave = {
        nutritionist_id: requestData.nutritionist_id,
        full_name: requestData.full_name,
        email: requestData.email,
        phone: requestData.phone,
        message: requestData.message || null, // Explicit null instead of undefined
        status: 'pending' as const,
      }

      // DEBUG: Log exact data being sent
      console.log('🔍 DEBUG - Data being sent to Supabase:', JSON.stringify(dataToSave, null, 2))
      console.log('🔍 DEBUG - nutritionist_id type:', typeof dataToSave.nutritionist_id)
      console.log('🔍 DEBUG - nutritionist_id value:', dataToSave.nutritionist_id)

      const { data, error } = await supabase
        .from('booking_requests')
        .insert([dataToSave])
        .select()
        .single()

      if (error) {
        console.error('Error creating booking request:', error)
        console.error('🔍 DEBUG - Full error object:', JSON.stringify(error, null, 2))
        return { data: null, error }
      }

      console.log('✅ SUCCESS - Booking request created:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error creating booking request:', error)
      return { data: null, error }
    }
  }

  // Încarcă cererile de programare pentru un nutriționist
  static async getBookingRequestsByNutritionist(nutritionistId: string): Promise<{ data: BookingRequest[], error: any }> {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('nutritionist_id', nutritionistId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching booking requests:', error)
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error fetching booking requests:', error)
      return { data: [], error }
    }
  }

  // Actualizează statusul unei cereri de programare
  static async updateBookingRequestStatus(id: string, status: BookingRequest['status']): Promise<{ data: BookingRequest | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating booking request status:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error updating booking request status:', error)
      return { data: null, error }
    }
  }

  // Încarcă o cerere de programare după ID
  static async getBookingRequestById(id: string): Promise<{ data: BookingRequest | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching booking request:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error fetching booking request:', error)
      return { data: null, error }
    }
  }

  // Șterge o cerere de programare
  static async deleteBookingRequest(id: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting booking request:', error)
        return { success: false, error }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error deleting booking request:', error)
      return { success: false, error }
    }
  }

  // Actualizează o cerere de programare completă
  static async updateBookingRequest(requestData: UpdateBookingRequestData): Promise<{ data: BookingRequest | null, error: any }> {
    try {
      const dataToUpdate = {
        ...requestData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('booking_requests')
        .update(dataToUpdate)
        .eq('id', requestData.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating booking request:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Unexpected error updating booking request:', error)
      return { data: null, error }
    }
  }
}
