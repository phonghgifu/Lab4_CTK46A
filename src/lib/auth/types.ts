-- Auth types and interfaces for TypeScript
export interface User {
  id: string
  email: string
  user_metadata?: {
    display_name?: string
    avatar_url?: string
  }
}

export interface AuthSession {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface SignUpData {
  email: string
  password: string
  display_name?: string
}

export interface LoginData {
  email: string
  password: string
}
