import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { StatusBanner } from '../components/ui'

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

  useEffect(() => {
    if (!sessionId) {
      setSession(null)
      setLocalError('Missing session_id in the URL.')
      return
    }

    let cancelled = false
    setLocalError(null)
    setSession(null)
    clearError()

    getSession(sessionId)
      .then((data) => {
        if (!cancelled) {
          setSession(data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load the session.'
          setLocalError(message)
        }
      })

    return () => {
      cancelled = true
    }
  }, [clearError, getSession, sessionId])

  const errorMessage = useMemo(
    () => localError ?? remoteError ?? null,
    [localError, remoteError],
  )

  const environmentChips = useMemo(() => {
    if (!session?.environment) return []
    return session.environment.split(',').map((token) => humanize(token.trim()))
  }, [session])

  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Session Prompt Ready
          </h1>
          <p className="text-slate-600">
            Review the generated prompt below. It stays read-only so the backend and Google Sheets remain consistent.
          </p>
        </header>

        {errorMessage ? (
          <StatusBanner variant="error">{errorMessage}</StatusBanner>
        ) : null}

        {isLoading && !session && !errorMessage ? (
          <StatusBanner variant="loading">Loading prompt...</StatusBanner>
        ) : null}

        {session ? (
          <section className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 space-y-4">
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
                  <p className="text-sm text-slate-800">{humanize(session.mood)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  environment
                </p>
                <div className="flex flex-wrap gap-2">
                  {environmentChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {chip}
                    </span>
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
                <div className="rounded-md border border-slate-300 bg-white p-4 text-sm text-slate-800 whitespace-pre-wrap">
                  {session.prompt}
                </div>
              </div>
            </div>
          </section>
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
            to={session ? `/session/new?child_id=${encodeURIComponent(session.child_id)}` : '/session/new'}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow hover:bg-blue-500 transition"
          >
            Start another session
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:border-slate-400 hover:bg-white transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SessionSuccess
