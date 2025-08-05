export interface BookingRequest {
  id?: string
  nutritionist_id: string
  full_name: string
  email: string
  phone: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected'
  created_at?: string
  updated_at?: string
}

export interface CreateBookingRequestData extends Omit<BookingRequest, 'id' | 'status' | 'created_at' | 'updated_at'> {
  // Inherit all fields except the ones managed by the database
}

export interface UpdateBookingRequestData extends Partial<BookingRequest> {
  id: string
}
