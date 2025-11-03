import { useCallback, useState } from 'react'
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

type UseChildResult = {
  createChild: (payload: CreateChildPayload) => Promise<ChildResponse>
  isSubmitting: boolean
  error: string | null
  clearError: () => void
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
