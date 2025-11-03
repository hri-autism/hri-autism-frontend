import { useCallback, useState } from 'react'
import { request } from '../lib/api'

type SessionPayload = {
  child_id: string
  mood: string
  environment: string
  situation: string
}

type SessionResponse = {
  session_id: string
  child_id: string
  mood: string
  environment: string
  situation: string
  prompt: string
  created_at: string
}

type UseSessionResult = {
  createSession: (payload: SessionPayload) => Promise<SessionResponse>
  getSession: (sessionId: string) => Promise<SessionResponse>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
}

export function useSession(): UseSessionResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSession = useCallback(async (payload: SessionPayload) => {
    setIsSubmitting(true)
    setError(null)
    try {
      return await request<SessionResponse>('/api/sessions', {
        method: 'POST',
        body: payload,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const getSession = useCallback(async (sessionId: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      return await request<SessionResponse>(`/api/sessions/${sessionId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    createSession,
    getSession,
    isSubmitting,
    error,
    clearError,
  }
}
