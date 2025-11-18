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

type LatestSessionResponse = SessionResponse | null

type UseSessionResult = {
  createSession: (payload: SessionPayload) => Promise<SessionResponse>
  getSession: (sessionId: string) => Promise<SessionResponse>
  getLatestSession: (childId: string) => Promise<LatestSessionResponse>
  isSubmitting: boolean
  isFetching: boolean
  error: string | null
  clearError: () => void
}

export function useSession(): UseSessionResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
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
    setIsFetching(true)
    setError(null)
    try {
      return await request<SessionResponse>(`/api/sessions/${sessionId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setIsFetching(false)
    }
  }, [])

  const getLatestSession = useCallback(async (childId: string) => {
    setIsFetching(true)
    setError(null)
    try {
      return await request<LatestSessionResponse>(
        `/api/children/${childId}/sessions/latest`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setIsFetching(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    createSession,
    getSession,
    getLatestSession,
    isSubmitting,
    isFetching,
    error,
    clearError,
  }
}
