import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { request } from '../lib/api'
import {
  Button,
  Card,
  KeywordSummary,
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

type ChildProfileSummary = {
  child_id: string
  nickname: string
  comm_level: string
  personality: string
  interests: string
  triggers: string
  target_skills: string
}

function humanize(option: string) {
  return option
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const MAX_AUTO_RETRIES = 3

function PromptTypewriter({ text, speed = 6 }: { text: string; speed?: number }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    setDisplay('')
    if (!text) return
    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setDisplay(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(interval)
      }
    }, speed)
    return () => window.clearInterval(interval)
  }, [text, speed])

  return (
    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-100">
      {display}
    </p>
  )
}

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
  const [childProfile, setChildProfile] = useState<ChildProfileSummary | null>(null)
  const [childLoading, setChildLoading] = useState(false)
  const [childError, setChildError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  const fetchChildProfile = useCallback(async (childId: string) => {
    setChildLoading(true)
    setChildError(null)
    try {
      const data = await request<ChildProfileSummary>(`/api/children/${childId}`)
      setChildProfile(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load child profile.'
      setChildError(message)
    } finally {
      setChildLoading(false)
    }
  }, [])

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

  useEffect(() => {
    if (!session?.child_id) {
      setChildProfile(null)
      return
    }
    fetchChildProfile(session.child_id)
  }, [fetchChildProfile, session?.child_id])

  const handleRefresh = useCallback(() => {
    if (!sessionId) return
    setIsAutoRetrying(false)
    setRetryCount(0)
    fetchSession(sessionId, { retry: false }).catch(() => {
      /* handled within fetchSession */
    })
  }, [fetchSession, sessionId])

  const handleCopyPrompt = useCallback(async () => {
    if (!session?.prompt) return
    try {
      await navigator?.clipboard?.writeText(session.prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy prompt', err)
    }
  }, [session?.prompt])

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
    <PageContainer variant="dark" contentClassName="space-y-12">
      <SectionHeader
        tone="dark"
        align="center"
        title="Session prompt generated"
        description="Keywords from the child profile and today’s context have been fused into a single robot-ready script."
      />

      {session && !errorMessage ? (
        <StatusBanner variant="success">
          Prompt created at {new Date(session.created_at).toLocaleString()}.
        </StatusBanner>
      ) : null}

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
            <span className="text-xs text-slate-400">
              Tried {retryCount} / {MAX_AUTO_RETRIES} automatic refreshes.
            </span>
          ) : null}
        </div>
      ) : null}

      {session ? (
        <div className="space-y-8">
          <Card
            tone="dark"
            title="Session overview"
            description="Snapshot of the data that shaped today’s prompt."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  session_id
                </p>
                <p className="font-mono text-sm text-cyan-200 break-words">
                  {session.session_id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  child_id
                </p>
                <p className="font-mono text-sm text-cyan-200 break-words">
                  {session.child_id}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag variant="info">Mood: {humanize(session.mood)}</Tag>
              {environmentChips.map((chip) => (
                <Tag key={chip}>{chip}</Tag>
              ))}
            </div>
          </Card>

          <KeywordSummary
            child={childProfile}
            loading={childLoading}
            error={childError}
            onRetry={session?.child_id ? () => fetchChildProfile(session.child_id) : undefined}
          />

          <Card
            tone="dark"
            title="Today’s context"
            description="A quick refresher of what you shared in the session form."
          >
            <div className="space-y-3">
              <div className="group relative max-h-32 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/70 p-4 text-sm text-slate-200 transition-all duration-300 hover:max-h-[420px]">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {session.situation}
                </p>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
              </div>
              <p className="text-xs text-slate-400">
                Hover to expand and review the full note.
              </p>
            </div>
          </Card>

          <Card
            tone="dark"
            title="Robot prompt"
            description="Copy and send to your social robot—this script combines profile keywords with today’s context."
            footer={
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyPrompt}
                >
                  {copied ? 'Copied' : 'Copy prompt'}
                </Button>
                <Link
                  to={
                    session
                      ? `/session/new?child_id=${encodeURIComponent(session.child_id)}`
                      : '/session/new'
                  }
                  className={buttonClasses({ variant: 'ghost' })}
                >
                  Start another session
                </Link>
              </div>
            }
          >
            <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4 shadow-inner">
              <PromptTypewriter text={session.prompt} speed={5} />
            </div>
          </Card>
        </div>
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
