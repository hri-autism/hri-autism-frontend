import { useCallback, useEffect, useState } from 'react'
import { request } from '../lib/api'

const CHILDREN_CACHE_KEY = 'children_cache_v1'
const CHILDREN_TTL = 40_000 // 40 seconds

type ChildrenCache = {
  ts: number
  data: ChildListItem[]
}

const readChildrenCache = (): ChildrenCache | null => {
  try {
    const raw = localStorage.getItem(CHILDREN_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ChildrenCache
    if (!parsed?.ts || !Array.isArray(parsed.data)) return null
    return parsed
  } catch {
    return null
  }
}

const writeChildrenCache = (data: ChildListItem[]) => {
  try {
    const payload: ChildrenCache = { ts: Date.now(), data }
    localStorage.setItem(CHILDREN_CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore cache errors */
  }
}

const clearChildrenCache = () => {
  try {
    localStorage.removeItem(CHILDREN_CACHE_KEY)
  } catch {
    /* ignore */
  }
}

type CreateChildPayload = {
  nickname: string
  age: number
  comm_level: 'low' | 'medium' | 'high'
  personality: 'shy' | 'active' | 'calm' | 'curious'
  triggers_raw?: string
  interests_raw?: string
  target_skills_raw?: string
}

type ChildResponse = {
  child_id: string
  nickname: string
  age: number
  comm_level: string
  personality: string
  triggers: string
  interests: string
  target_skills: string
  created_at: string
  updated_at: string
}

type ChildListItem = {
  child_id: string
  nickname: string
  age: number
  comm_level: string
  personality: string
  triggers: string
  interests: string
  target_skills: string
  created_at: string
  updated_at: string
}

type ChildrenListResponse = {
  children: ChildListItem[]
}

type UseChildResult = {
  createChild: (payload: CreateChildPayload) => Promise<ChildResponse>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
}

type UseChildrenListResult = {
  children: ChildListItem[]
  isLoading: boolean
  error: string | null
  hasLoaded: boolean
  refresh: () => Promise<void>
}

export function useChild(): UseChildResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createChild = useCallback(async (payload: CreateChildPayload) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await request<ChildResponse>('/api/children', {
        method: 'POST',
        body: payload,
      })
      clearChildrenCache()
      return response
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
    createChild,
    isSubmitting,
    error,
    clearError,
  }
}

export function useChildrenList(autoFetch = true): UseChildrenListResult {
  const [children, setChildren] = useState<ChildListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const cached = readChildrenCache()
      const now = Date.now()
      if (cached && now - cached.ts < CHILDREN_TTL) {
        setChildren(cached.data)
        setHasLoaded(true)
        setIsLoading(false)
        return
      }

      const data = await request<ChildrenListResponse>('/api/children')
      setChildren(Array.isArray(data.children) ? data.children : [])
      writeChildrenCache(Array.isArray(data.children) ? data.children : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load children.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!autoFetch) return
    refresh().catch(() => {
      /* handled */
    })
  }, [autoFetch, refresh])

  return {
    children,
    isLoading,
    error,
    hasLoaded,
    refresh,
  }
}

export type { ChildListItem }
