import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { request } from '../lib/api'
import {
  Button,
  Card,
  PageContainer,
  SectionHeader,
  StatusBanner,
  Tag,
  buttonClasses,
  Spinner,
} from '../components/ui'
import { Baymax } from '../components/ui/Baymax'
import { useTypewriter } from '../hooks/useTypewriter'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { TopBar } from '../components/layout/TopBar'
import { heroBackgroundStyles } from '../components/ui/RobotIllustration'

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

function TypewriterLine({
  label,
  text,
  speed = 28,
  loop = false,
  loopDelay = 15000,
  startDelay = 0,
}: {
  label: string
  text: string
  speed?: number
  loop?: boolean
  loopDelay?: number
  startDelay?: number
}) {
  const fallback = 'None recorded yet'
  const isFallback = !text || text === fallback
  const display = useTypewriter(isFallback ? '' : text, {
    speed,
    loop: loop && !isFallback,
    loopDelay,
    startDelay,
    fallback,
  })

  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="min-h-[1.6rem] text-sm leading-relaxed text-slate-200">
        {display || '\u00A0'}
      </p>
    </div>
  )
}

function SessionSuccess() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const {
    getSession,
    isFetching: isLoading,
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
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

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

  const commLabel = useMemo(() => {
    if (!childProfile?.comm_level) return ''
    return `${humanize(childProfile.comm_level)} communication`
  }, [childProfile?.comm_level])

  const commLabelMobile = useMemo(() => {
    if (!childProfile?.comm_level) return ''
    const full = humanize(childProfile.comm_level)
    const isMedium = full.toLowerCase() === 'medium'
    return `${isMedium ? 'Med' : full} communication`
  }, [childProfile?.comm_level])

  const personalityLabel = useMemo(() => {
    if (!childProfile?.personality) return ''
    return `${humanize(childProfile.personality)} personality`
  }, [childProfile?.personality])

  const childSummary = useMemo(() => {
    if (!childProfile) return null

    const parse = (value: string) => {
      const items = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      return items.length ? items.join(' • ') : 'None recorded yet'
    }

    return {
      interests: parse(childProfile.interests),
      triggers: parse(childProfile.triggers),
      targetSkills: parse(childProfile.target_skills),
      baseline: `${childProfile.comm_level} communication · ${childProfile.personality} personality`,
    }
  }, [childProfile])

  const createdAtDisplay = useMemo(() => {
    if (!session?.created_at) return ''
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(session.created_at))
  }, [session?.created_at])

  useEffect(() => {
    if (session && !errorMessage) {
      setShowSuccessBanner(true)
      const timer = window.setTimeout(() => setShowSuccessBanner(false), 8000)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [session, errorMessage])

  return (
    <section className={`${heroBackgroundStyles} overflow-visible min-h-screen`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-blue-500/40 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[50vh] w-[40vw] rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-3xl" />
      </div>
      <div className="relative z-10">
        <TopBar variant="transparent" />
        <PageContainer variant="dark" contentClassName="space-y-12" className="bg-transparent text-white">
          <SectionHeader
            tone="dark"
            align="center"
            titleClassName="text-4xl md:text-5xl"
            descriptionClassName="text-base md:text-lg"
            title={
              <>
                Session Prompt{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                  Generated
                </span>
              </>
            }
            description="Keywords from the child profile and session have been fused into a single robot-ready script."
          />

          {session && !errorMessage && showSuccessBanner ? (
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
        <div className="space-y-6">
          <Card
            tone="dark"
            title="Session Overview"
            description="Mood, environment, and today’s situation."
          >
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Tag variant="mood" className="w-full sm:w-auto">
                <span className="md:hidden">Mood: {session.mood?.toLowerCase() === 'uncomfortable' ? 'Uncomfort' : humanize(session.mood)}</span>
                <span className="hidden md:inline">Mood: {humanize(session.mood)}</span>
              </Tag>
              {environmentChips.map((chip) => (
                <Tag key={chip} variant="environment" className="w-full sm:w-auto">
                  {chip}
                </Tag>
              ))}
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Situation
              </p>
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
            title="From Child Profile"
            description="Child’s baseline."
          >
            <div className="grid gap-4 md:grid-cols-[1fr,240px] md:items-start">
              <div className="space-y-3">
                {childLoading ? (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Spinner size="sm" /> Loading keywords…
                  </div>
                ) : childError ? (
                  <div className="text-sm text-red-400">{childError}</div>
                ) : childSummary ? (
                  <div className="space-y-3">
                    <div className="hidden md:block">
                      <Tag variant="baseline" className="text-[10px] justify-center text-center">
                        {childSummary.baseline}
                      </Tag>
                    </div>
                    <div className="flex flex-col gap-2 md:hidden">
                    {commLabel ? (
                        <Tag variant="baseline" className="text-[10px] justify-center text-center max-w-[220px]">
                          {commLabelMobile}
                        </Tag>
                      ) : null}
                      {personalityLabel ? (
                        <Tag variant="baseline" className="text-[10px] justify-center text-center max-w-[220px]">
                          {personalityLabel}
                        </Tag>
                      ) : null}
                    </div>
                    <TypewriterLine label="Interests" text={childSummary.interests} loop />
                    <TypewriterLine label="Triggers" text={childSummary.triggers} loop startDelay={150} />
                    <TypewriterLine
                      label="Target skills"
                      text={childSummary.targetSkills}
                      loop
                      startDelay={300}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-slate-300/80">
                    Keywords missing. Once the profile is processed, they will appear here.
                  </div>
                )}
              </div>
              <Baymax className="hidden md:flex" />
            </div>
          </Card>

          <Card
            tone="dark"
            title="Robot Prompt"
            description="Combines profile keywords with session."
            footer={
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyPrompt}
                >
                  {copied ? 'Copied' : 'Copy Prompt'}
                </Button>
                <Link
                  to={
                    session
                      ? `/session/new?child_id=${encodeURIComponent(session.child_id)}`
                      : '/session/new'
                  }
                  className={buttonClasses()}
                >
                  <span className="md:hidden">Start Another</span>
                  <span className="hidden md:inline">Start Another Session</span>
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

        </PageContainer>
      </div>
    </section>
  )
}

export default SessionSuccess
