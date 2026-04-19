'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthSession } from './types'

const AuthContext = createContext<AuthSession | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authSession, setAuthSession] = useState<AuthSession>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = createClient()

  useEffect(() => {
    // Lấy session hiện tại
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setAuthSession({
          user: session?.user as User | null,
          isLoading: false,
          isAuthenticated: !!session,
        })
      } catch (error) {
        console.error('Error getting session:', error)
        setAuthSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    getInitialSession()

    // Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession({
        user: session?.user as User | null,
        isLoading: false,
        isAuthenticated: !!session,
      })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider value={authSession}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================
// CUSTOM HOOK: DÙNG AUTH CONTEXT
// ============================================================
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
