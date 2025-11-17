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
import { useTypewriter } from '../hooks/useTypewriter'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

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

const typewriterFallback = 'Preparing prompt...'

const promptMarkdownComponents: Components = {
  p: ({ node, ...props }) => (
    <p className="mb-3 text-slate-100 last:mb-0" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="text-cyan-200" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="text-purple-200" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="my-3 list-disc space-y-2 pl-5 text-slate-100 marker:text-cyan-300" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="my-3 list-decimal space-y-2 pl-5 text-slate-100 marker:text-cyan-300" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: ({ node, inline, className, children, ...props }: any) =>
    inline ? (
      <code className="rounded bg-slate-800/80 px-1 py-0.5 text-cyan-200" {...props}>
        {children}
      </code>
    ) : (
      <code className="block rounded-xl bg-slate-900/80 p-3 text-cyan-200" {...props}>
        {children}
      </code>
    ),
}

function PromptTypewriter({ text, speed = 3 }: { text: string; speed?: number }) {
  const display = useTypewriter(text, {
    speed,
    fallback: typewriterFallback,
  })

  return (
    <ReactMarkdown className="space-y-3 text-sm leading-relaxed" components={promptMarkdownComponents}>
      {display}
    </ReactMarkdown>
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

  const createdAtDisplay = useMemo(() => {
    if (!session?.created_at) return ''
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(session.created_at))
  }, [session?.created_at])

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
          Prompt created at {createdAtDisplay}.
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

      {sessionId && retryCount > 0 && retryCount < MAX_AUTO_RETRIES ? (
        <span className="text-xs text-slate-400">
          Tried {retryCount} / {MAX_AUTO_RETRIES} automatic refreshes.
        </span>
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
              <Tag variant="mood">Mood: {humanize(session.mood)}</Tag>
              {environmentChips.map((chip) => (
                <Tag key={chip} variant="environment">
                  {chip}
                </Tag>
              ))}
            </div>
          </Card>

          <KeywordSummary
            child={childProfile}
            loading={childLoading}
            error={childError}
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
              <PromptTypewriter text={session.prompt} speed={2} />
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
