import { useCallback, useEffect, useState } from 'react'
import { request } from '../lib/api'

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
      const data = await request<ChildrenListResponse>('/api/children')
      setChildren(Array.isArray(data.children) ? data.children : [])
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
