import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  onUnauthorized,
  request,
  setAccessToken,
} from '../lib/api'

type AuthUser = {
  user_id: string
  email: string
  full_name: string
  role: 'parent' | 'therapist'
  created_at: string
  updated_at: string
  last_login_at: string | null
}

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  setSession: (payload: { token: string; user: AuthUser }) => void
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const AUTH_USER_STORAGE_KEY = 'auth_cached_user'

function cacheUser(user: AuthUser) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Ignore quota/parsing errors
  }
}

function loadCachedUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function clearCachedUser() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(AUTH_USER_STORAGE_KEY)
}

function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403)
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('checking')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const token = getAccessToken()
      if (!token) {
        if (isMounted) {
          setUser(null)
          setStatus('unauthenticated')
        }
        return
      }

      const cached = loadCachedUser()
      if (cached && isMounted) {
        setUser(cached)
        setStatus('authenticated')
      } else if (isMounted) {
        setStatus('checking')
      }

      try {
        const me = await request<AuthUser>('/api/auth/me')
        if (isMounted) {
          setUser(me)
          setStatus('authenticated')
          cacheUser(me)
        }
      } catch (error) {
        console.error('Failed to bootstrap auth state', error)
        if (isUnauthorizedError(error)) {
          clearAccessToken()
          clearCachedUser()
          if (isMounted) {
            setUser(null)
            setStatus('unauthenticated')
          }
        } else if (isMounted) {
          if (cached) {
            setStatus('authenticated')
          } else {
            setUser(null)
            setStatus('unauthenticated')
          }
        }
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      setUser(null)
      setStatus('unauthenticated')
      clearCachedUser()
      navigate('/login', { replace: true })
    }

    onUnauthorized(handler)
    return () => {
      onUnauthorized(null)
    }
  }, [navigate])

  const refreshUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setStatus('unauthenticated')
      return
    }

    setStatus('checking')
    try {
      const data = await request<AuthUser>('/api/auth/me')
      setUser(data)
      setStatus('authenticated')
      cacheUser(data)
    } catch (error) {
      console.error('Failed to refresh auth state', error)
      if (isUnauthorizedError(error)) {
        clearAccessToken()
        clearCachedUser()
        setUser(null)
        setStatus('unauthenticated')
      } else {
        setStatus((prev) => (prev === 'unauthenticated' ? 'unauthenticated' : 'authenticated'))
      }
      throw error
    }
  }, [])

  const setSession = useCallback(({ token, user }: { token: string; user: AuthUser }) => {
    setAccessToken(token)
    setUser(user)
    cacheUser(user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    clearAccessToken()
    clearCachedUser()
    setUser(null)
    setStatus('unauthenticated')
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      setSession,
      refreshUser,
      logout,
    }),
    [logout, refreshUser, setSession, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { AuthUser, AuthStatus }
export { AuthProvider, useAuth }
