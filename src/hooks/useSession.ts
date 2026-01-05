import { useCallback, useState } from 'react'
import { request } from '../lib/api'

const LATEST_SESSION_CACHE_KEY = 'latest_session_cache_v1'
const SESSION_TTL = 40_000 // 40 seconds

type LatestCache = {
  ts: number
  data: Record<string, LatestSessionResponse | undefined>
}

const readLatestCache = (): LatestCache | null => {
  try {
    const raw = localStorage.getItem(LATEST_SESSION_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LatestCache
    if (!parsed?.ts || typeof parsed.data !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

const writeLatestCache = (data: Record<string, LatestSessionResponse | undefined>) => {
  try {
    const payload: LatestCache = { ts: Date.now(), data }
    localStorage.setItem(LATEST_SESSION_CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore cache errors */
  }
}

const clearLatestCacheForChild = (childId: string) => {
  try {
    const cached = readLatestCache()
    if (!cached) return
    const next = { ...cached.data }
    delete next[childId]
    writeLatestCache(next)
  } catch {
    /* ignore */
  }
}

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
      const result = await request<SessionResponse>('/api/sessions', {
        method: 'POST',
        body: payload,
      })
      clearLatestCacheForChild(payload.child_id)
      return result
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
    const cached = readLatestCache()
    const now = Date.now()
    if (cached && now - cached.ts < SESSION_TTL) {
      const cachedValue = cached.data?.[childId]
      if (typeof cachedValue !== 'undefined') {
        return cachedValue
      }
    }

    setIsFetching(true)
    setError(null)
    try {
      const result = await request<LatestSessionResponse>(
        `/api/children/${childId}/sessions/latest`,
      )
      const nextData = { ...(cached?.data ?? {}) }
      nextData[childId] = result
      writeLatestCache(nextData)
      return result
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
