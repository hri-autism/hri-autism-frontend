import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import {
  Button,
  Card,
  PageContainer,
  SectionHeader,
  StatusBanner,
  Tag,
  buttonClasses,
} from '../components/ui'

type SessionDetail = {
  session_id: string
  child_id: string
  mood: string
  environment: string
  situation: string
  prompt: string
  created_at: string
}

function humanize(option: string) {
  return option
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const MAX_AUTO_RETRIES = 3

function SessionSuccess() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const {
    getSession,
    isSubmitting: isLoading,
    error: remoteError,
    clearError,
  } = useSession()
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isAutoRetrying, setIsAutoRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const fetchSession = useCallback(
    async (targetId: string, { retry }: { retry: boolean }) => {
      setLocalError(null)
      clearError()

      try {
        const data = await getSession(targetId)
        setSession(data)
        setRetryCount(0)
        setIsAutoRetrying(false)
      } catch (err) {
        if (retry) {
          setRetryCount((prev) => prev + 1)
        }
        const message =
          err instanceof Error ? err.message : 'Failed to load the session.'
        setLocalError(message)
      }
    },
    [clearError, getSession],
  )

  useEffect(() => {
    if (!sessionId) {
      setSession(null)
      setLocalError('Missing session_id in the URL.')
      return
    }

    setSession(null)
    setLocalError(null)
    setRetryCount(0)
    setIsAutoRetrying(false)

    fetchSession(sessionId, { retry: false })
      .catch(() => {
        /* handled in fetchSession */
      })
  }, [fetchSession, sessionId])

  useEffect(() => {
    if (!session && sessionId && retryCount < MAX_AUTO_RETRIES) {
      setIsAutoRetrying(true)
      const timer = window.setTimeout(() => {
        fetchSession(sessionId, { retry: true }).finally(() => {
          setIsAutoRetrying(false)
        })
      }, 4000)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [fetchSession, retryCount, session, sessionId])

  const handleRefresh = useCallback(() => {
    if (!sessionId) return
    setIsAutoRetrying(false)
    setRetryCount(0)
    fetchSession(sessionId, { retry: false }).catch(() => {
      /* handled within fetchSession */
    })
  }, [fetchSession, sessionId])

  const errorMessage = useMemo(
    () => localError ?? remoteError ?? null,
    [localError, remoteError],
  )

  const environmentChips = useMemo(() => {
    if (!session?.environment) return []
    return session.environment.split(',').map((token) => humanize(token.trim()))
  }, [session])

  const refreshDisabled = isLoading || isAutoRetrying

  return (
    <PageContainer>
      <SectionHeader
        title="Session Prompt Ready"
        description="Review the generated prompt below. It stays read-only so the backend and Google Sheets remain consistent."
      />

      {errorMessage ? (
        <StatusBanner variant="error">{errorMessage}</StatusBanner>
      ) : null}

      {isLoading && !session && !errorMessage ? (
        <StatusBanner variant="loading">Loading prompt...</StatusBanner>
      ) : null}

      {isAutoRetrying && sessionId && retryCount < MAX_AUTO_RETRIES ? (
        <StatusBanner variant="info">
          Auto-refreshing prompt (attempt {retryCount + 1} of {MAX_AUTO_RETRIES})...
        </StatusBanner>
      ) : null}

      {sessionId ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleRefresh}
            disabled={refreshDisabled}
            loading={refreshDisabled && !isAutoRetrying}
          >
            {refreshDisabled ? 'Refreshing...' : 'Refresh prompt'}
          </Button>
          {retryCount > 0 && retryCount < MAX_AUTO_RETRIES ? (
            <span className="text-xs text-slate-500">
              Tried {retryCount} / {MAX_AUTO_RETRIES} automatic refreshes.
            </span>
          ) : null}
        </div>
      ) : null}

      {session ? (
        <Card>
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">
                session_id
              </p>
              <p className="font-mono text-base text-slate-900 break-words">
                {session.session_id}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  child_id
                </p>
                <p className="font-mono text-sm text-slate-800 break-words">
                  {session.child_id}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  mood
                </p>
                <p className="text-sm text-slate-800">
                  {humanize(session.mood)}
                </p>
              </div>
            </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  environment
                </p>
                <div className="flex flex-wrap gap-2">
                  {environmentChips.map((chip) => (
                    <Tag key={chip}>{chip}</Tag>
                  ))}
                </div>
              </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                situation
              </p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">
                {session.situation}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                prompt
              </p>
              <div className="rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-800 whitespace-pre-wrap">
                {session.prompt}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {!session && !isAutoRetrying && retryCount >= MAX_AUTO_RETRIES && sessionId ? (
        <StatusBanner variant="info">
          Automatic refresh attempts exhausted. Please try again manually.
        </StatusBanner>
      ) : null}

      {!session && !isLoading && !errorMessage && sessionId ? (
        <StatusBanner variant="info">
          Prompt not available yet. Try refreshing in a moment.
        </StatusBanner>
      ) : null}

      {!sessionId ? (
        <StatusBanner variant="info">
          Missing session information. Please start a new session below.
        </StatusBanner>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={
            session
              ? `/session/new?child_id=${encodeURIComponent(session.child_id)}`
              : '/session/new'
          }
          className={buttonClasses()}
        >
          Start another session
        </Link>
        <Link to="/" className={buttonClasses({ variant: 'secondary' })}>
          Back to home
        </Link>
      </div>
    </PageContainer>
  )
}

export default SessionSuccess
