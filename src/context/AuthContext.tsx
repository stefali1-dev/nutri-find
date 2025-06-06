// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { supabase } from '@/lib/supabaseClient'

/** Minimal data we need globally (e.g. Navbar avatar, name, id) */
export interface MinimalNutritionist {
  id: string
  fullName: string
  profilePhoto: string
}

/** Shape of what the context exposes */
interface AuthContextType {
  nutritionist: MinimalNutritionist | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [nutritionist, setNutritionist] =
    useState<MinimalNutritionist | null>(null)

  useEffect(() => {
    const fetchMinimalProfile = async () => {
      /* 1. Get logged-in user */
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      /* 2. Fetch only needed columns */
      const { data, error } = await supabase
        .from('nutritionists')
        .select('id, full_name, profile_photo_url')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setNutritionist({
          id: data.id,
          fullName: data.full_name,
          profilePhoto: data.profile_photo_url,
        })
      }
    }

    fetchMinimalProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ nutritionist }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook with runtime guard so it can’t be used outside provider */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx)
    throw new Error('useAuth must be used inside an <AuthProvider>.')
  return ctx
}
