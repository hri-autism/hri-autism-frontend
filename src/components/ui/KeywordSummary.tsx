import { useEffect, useMemo, useState } from 'react'
import { Button } from './Button'
import { Spinner } from './Spinner'

type KeywordSummaryProps = {
  child?: {
    nickname: string
    comm_level: string
    personality: string
    interests: string
    triggers: string
    target_skills: string
  } | null
  loading: boolean
  error?: string | null
  onRetry?: () => void
}

type TypewriterLineProps = {
  label: string
  text: string
  delay?: number
}

function TypewriterLine({ label, text, delay = 25 }: TypewriterLineProps) {
  const [display, setDisplay] = useState('')
  useEffect(() => {
    setDisplay('')
    if (!text) {
      setDisplay('None yet')
      return
    }
    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setDisplay(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(interval)
      }
    }, delay)
    return () => window.clearInterval(interval)
  }, [text, delay])

  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-mono text-sm text-slate-200">{display}</p>
    </div>
  )
}

export function KeywordSummary({ child, loading, error, onRetry }: KeywordSummaryProps) {
  const [collapsed, setCollapsed] = useState(false)

  const summaryTexts = useMemo(() => {
    if (!child) return null

    const parse = (value: string) => {
      const items = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      return items.length ? items.join(' • ') : 'None recorded yet'
    }

    return {
      interests: parse(child.interests),
      triggers: parse(child.triggers),
      targetSkills: parse(child.target_skills),
      baseline: `${child.comm_level} communication · ${child.personality} personality`,
    }
  }, [child])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 shadow-[0_25px_80px_rgba(56,189,248,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-100">
            From child profile
          </p>
          <p className="text-xs text-slate-400">
            Robot will reference these keywords. You can’t edit them here.
          </p>
        </div>
        <div className="flex gap-2">
          {onRetry ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRetry}
              disabled={loading}
            >
              Refresh
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? 'Show' : 'Hide'}
          </Button>
        </div>
      </div>

      {collapsed ? null : (
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Spinner size="sm" /> Loading keywords…
            </div>
          ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : summaryTexts ? (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {summaryTexts.baseline}
              </p>
              <TypewriterLine label="Interests" text={summaryTexts.interests} />
              <TypewriterLine label="Triggers" text={summaryTexts.triggers} />
              <TypewriterLine
                label="Target skills"
                text={summaryTexts.targetSkills}
              />
            </div>
          ) : (
            <div className="text-sm text-slate-300/80">
              Keywords missing. Once the profile is processed, they will appear here.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
