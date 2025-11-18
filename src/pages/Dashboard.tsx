import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '../context/AuthContext'
import { useChildrenList, type ChildListItem } from '../hooks/useChild'
import { useSession } from '../hooks/useSession'
import {
  PageContainer,
  SectionHeader,
  StatusBanner,
  Card,
  EmptyState,
  buttonClasses,
  Tag,
} from '../components/ui'

type LatestSession = {
  session_id: string
  child_id: string
  mood: string
  environment: string
  situation: string
  prompt: string
  created_at: string
} | null

function Dashboard() {
  const { user, status, isAuthenticated } = useAuth()
  const { getLatestSession } = useSession()
  const {
    children,
    isLoading: childrenLoading,
    error: childrenError,
    refresh,
  } = useChildrenList(false)
  const [latestSessions, setLatestSessions] = useState<
    Record<string, LatestSession | undefined>
  >({})
  const [latestLoading, setLatestLoading] = useState(false)
  const [latestError, setLatestError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || status !== 'authenticated') return
    refresh().catch(() => {
      /* handled in hook */
    })
  }, [isAuthenticated, refresh, status])

  useEffect(() => {
    if (!isAuthenticated || children.length === 0) {
      setLatestSessions({})
      setLatestError(null)
      setLatestLoading(false)
      return
    }

    let cancelled = false
    setLatestLoading(true)
    setLatestError(null)

    Promise.all(
      children.map(async (child) => {
        try {
          const session = await getLatestSession(child.child_id)
          return [child.child_id, session] as const
        } catch (error) {
          console.error('Failed to fetch latest session for child', child.child_id, error)
          return [child.child_id, null] as const
        }
      }),
    )
      .then((entries) => {
        if (cancelled) return
        const next: Record<string, LatestSession | undefined> = {}
        entries.forEach(([childId, session]) => {
          next[childId] = session
        })
        setLatestSessions(next)
      })
      .catch((error) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Failed to load latest sessions.'
        setLatestError(message)
      })
      .finally(() => {
        if (!cancelled) {
          setLatestLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [children, getLatestSession, isAuthenticated])

const humanize = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const promptPreviewComponents = {
  p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0 text-slate-100" {...props} />,
  strong: ({ node, ...props }: any) => <strong className="text-cyan-200" {...props} />,
  em: ({ node, ...props }: any) => <em className="text-purple-200" {...props} />,
  ul: ({ node, ...props }: any) => (
    <ul className="my-2 list-disc pl-5 text-slate-100 marker:text-cyan-300" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="my-2 list-decimal pl-5 text-slate-100 marker:text-cyan-300" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="leading-relaxed" {...props} />,
  code: ({ inline, children, ...props }: any) =>
    inline ? (
      <code className="rounded bg-slate-800/80 px-1 py-0.5 text-cyan-200" {...props}>
        {children}
      </code>
    ) : (
      <code className="block rounded bg-slate-900/80 p-2 text-cyan-200" {...props}>
        {children}
      </code>
    ),
}

  const renderChildCard = useCallback(
    (child: ChildListItem) => {
      const latest = latestSessions[child.child_id]
      const environmentChips =
        latest?.environment
          ?.split(',')
          .map((token) => humanize(token.trim())) ?? []
      const createdAtDisplay =
        latest?.created_at
          ? new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(latest.created_at))
          : null

      const parseList = (value?: string) => {
        if (!value) return 'None recorded yet'
        const items = value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
        return items.length ? items.join(' • ') : 'None recorded yet'
      }

      return (
        <Card key={child.child_id} tone="dark">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-100">
                {child.nickname}
              </h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]">
              <div className="space-y-4 text-sm text-slate-100">
                <div className="space-y-1">
                  <Tag variant="baseline" className="text-[10px]">
                    {child.comm_level} communication · {child.personality} personality
                  </Tag>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Interests
                  </p>
                  <p className="font-mono text-xs text-slate-300 break-words">
                    {parseList(child.interests)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Triggers
                  </p>
                  <p className="font-mono text-xs text-slate-300 break-words">
                    {parseList(child.triggers)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Target skills
                  </p>
                  <p className="font-mono text-xs text-slate-300 break-words">
                    {parseList(child.target_skills)}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-100">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Latest session
                    </p>
                    {createdAtDisplay ? (
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {createdAtDisplay}
                      </span>
                    ) : null}
                 </div>
                  {latestLoading ? (
                    <p className="text-sm text-slate-200">Loading latest session...</p>
                  ) : latestError ? (
                    <p className="text-sm text-rose-300">{latestError}</p>
                  ) : latest ? (
                    <div className="space-y-4">
                      <div className="mt-3 mb-1 flex flex-wrap gap-1 md:gap-2 text-[11px] md:text-xs">
                        <Tag variant="mood" className="text-[11px] md:text-xs">
                          Mood: {humanize(latest.mood)}
                        </Tag>
                        {environmentChips.map((chip) => (
                          <Tag
                            key={`${latest.session_id}-${chip}`}
                            variant="environment"
                            className="text-[11px] md:text-xs"
                          >
                            {chip}
                          </Tag>
                        ))}
                      </div>
                      {latest.situation ? (
                        <div className="mt-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5">
                            Situation
                          </p>
                          <div className="group relative rounded-xl border border-slate-800/60 bg-slate-900/70 p-2 text-xs text-slate-200">
                            <div className="max-h-16 overflow-hidden transition-all duration-300 group-hover:max-h-40">
                              <div className="max-h-40 overflow-y-auto pr-1">
                                <p className="whitespace-pre-line text-slate-300">
                                  {latest.situation}
                                </p>
                              </div>
                            </div>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No situation recorded.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      No sessions yet. Create one to populate this area.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4 text-xs text-slate-200 shadow-inner">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Session prompt
              </p>
              <p className="text-[11px] text-slate-400">
                Hover to expand. Scroll inside to read the full prompt.
              </p>
              {latest?.prompt ? (
                <div className="group relative mt-2 rounded-xl border border-slate-800/60 bg-slate-900/70 p-3">
                  <div className="max-h-24 overflow-hidden transition-all duration-300 group-hover:max-h-[360px]">
                    <div className="max-h-64 overflow-y-auto pr-1">
                      <ReactMarkdown components={promptPreviewComponents}>
                        {latest.prompt}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400">Prompt not available yet.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/session/new?child_id=${encodeURIComponent(child.child_id)}`}
              className={buttonClasses({ size: 'sm' })}
            >
              New session
            </Link>
            <button
              type="button"
              className={buttonClasses({
                variant: 'secondary',
                size: 'sm',
                className: 'cursor-not-allowed opacity-60',
              })}
              title="Editing coming soon"
            >
              Edit profile
            </button>
          </div>
        </Card>
      )
    },
    [latestError, latestLoading, latestSessions],
  )

  const content = useMemo(() => {
    if (status === 'checking') {
      return (
        <StatusBanner variant="loading">Loading dashboard...</StatusBanner>
      )
    }

    if (!isAuthenticated || !user) {
      return (
        <StatusBanner variant="info">
          Please sign in to view your dashboard.
        </StatusBanner>
      )
    }

    return (
      <>
        <Card
          tone="dark"
          title={`Welcome back, ${user.full_name.split(' ')[0] ?? user.full_name} !`}
          description="Here’s a quick overview of your profiles and sessions."
        >
          <div className="grid gap-6 text-sm text-slate-200 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
              <p className="font-mono text-cyan-200">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Role</p>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Last login
              </p>
              <p>
                {user.last_login_at
                  ? new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(user.last_login_at))
                  : '—'}
              </p>
            </div>
          </div>
        </Card>

        {childrenLoading ? (
          <StatusBanner variant="loading">Loading child profiles...</StatusBanner>
        ) : childrenError ? (
          <StatusBanner variant="error">{childrenError}</StatusBanner>
        ) : children.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">My children</h2>
                <p className="text-sm text-slate-400">
                  Select a child to view or create sessions.
                </p>
              </div>
              <Link
                to="/child/new"
                className="rounded-2xl border border-cyan-400/40 bg-slate-900/70 px-6 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:text-white"
              >
                Add child
              </Link>
            </div>
            <div className="grid gap-6">
              {children.map((child) => renderChildCard(child))}
            </div>
          </div>
        ) : (
          <EmptyState
            tone="dark"
            title="Create your first child profile"
            description="You haven’t added any child profiles yet. Start by creating one so future sessions can reuse the child_id."
            actions={[
              { label: 'Create child profile', href: '/child/new', variant: 'primary' },
            ]}
          />
        )}
      </>
    )
  }, [
    children,
    childrenError,
    childrenLoading,
    isAuthenticated,
    renderChildCard,
    status,
    user,
  ])

  return (
    <PageContainer variant="dark" contentClassName="space-y-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          tone="dark"
          title="Dashboard"
          description="Manage your child profiles and sessions."
        />
        <Link
          to="/"
          className="rounded-2xl border border-cyan-400/40 bg-slate-900/70 px-6 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:text-white"
        >
          Back to home
        </Link>
     </div>
      {content}
    </PageContainer>
  )
}

export default Dashboard
