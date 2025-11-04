import { useMemo } from 'react'
import { Spinner } from './Spinner'
import { useTypewriter } from '../../hooks/useTypewriter'
import { Tag } from './Tag'

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
}

type TypewriterLineProps = {
  label: string
  text: string
  speed?: number
  loop?: boolean
  loopDelay?: number
  startDelay?: number
}

function TypewriterLine({
  label,
  text,
  speed = 28,
  loop = false,
  loopDelay = 2000,
  startDelay = 0,
}: TypewriterLineProps) {
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
      <p className="min-h-[1.4rem] font-mono text-sm text-slate-200">
        {display || '\u00A0'}
      </p>
    </div>
  )
}

export function KeywordSummary({ child, loading, error }: KeywordSummaryProps) {
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
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),minmax(200px,240px)] md:items-stretch">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-slate-100">
                From child profile
              </p>
              <p className="text-sm text-slate-400">
                Robot will reference these keywords. You can’t edit them here.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Spinner size="sm" /> Loading keywords…
              </div>
            ) : error ? (
            <div className="text-sm text-red-400">{error}</div>
          ) : summaryTexts ? (
            <div className="space-y-4">
              <Tag variant="baseline" className="text-[10px]">
                {summaryTexts.baseline}
              </Tag>
              <TypewriterLine
                label="Interests"
                text={summaryTexts.interests}
                loop
              />
              <TypewriterLine
                label="Triggers"
                text={summaryTexts.triggers}
                loop
                startDelay={150}
              />
              <TypewriterLine
                label="Target skills"
                text={summaryTexts.targetSkills}
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
        </div>

        <div
          className="relative hidden w-full max-w-[220px] overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/60 px-5 pb-5 pt-4 shadow-[0_30px_90px_rgba(56,189,248,0.16)] md:flex md:h-full md:self-stretch md:flex-col md:items-center"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_65%)] animate-[robotAuraPulse_8s_ease-in-out_infinite]" />
          <div className="absolute inset-4 rounded-[36%] border border-cyan-300/20 animate-[robotAuraPulse_9s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-x-8 top-0 h-28 overflow-hidden">
            <span className="absolute left-1/2 h-44 w-14 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-400/40 via-cyan-300/15 to-transparent blur-2xl animate-[robotCircuitSweep_6s_linear_infinite]" />
          </div>
          <div className="absolute -left-5 top-6 h-22 w-2 rounded-full bg-gradient-to-b from-cyan-400/40 to-purple-400/20 blur-md animate-[robotAuraPulse_5s_ease-in-out_infinite]" />
          <div className="absolute -right-5 top-24 h-18 w-2 rounded-full bg-gradient-to-t from-purple-400/40 to-cyan-400/20 blur-md animate-[robotAuraPulse_7s_ease-in-out_infinite]" />

          <div className="relative flex h-full w-full flex-col justify-between">
            <div className="flex flex-col items-center gap-3 pt-1">
              <div className="flex h-16 w-24 items-center justify-center rounded-[48%] border border-cyan-300/40 bg-slate-900/80 shadow-[0_0_32px_rgba(56,189,248,0.28)]">
                <div className="relative flex h-10 w-[72px] items-center justify-between px-3">
                  <span className="h-3 w-3 rounded-full bg-cyan-200/80 shadow-[0_0_12px_rgba(56,189,248,0.7)] animate-pulse" />
                  <span className="h-3 w-3 rounded-full bg-purple-200/80 shadow-[0_0_12px_rgba(147,51,234,0.6)] animate-[robotAuraPulse_4.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <div className="flex h-1 w-16 items-center justify-center gap-2">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <span className="h-1 w-8 rounded-full bg-gradient-to-l from-purple-400/60 to-transparent" />
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex h-14 w-7 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-900/70 shadow-[0_0_20px_rgba(56,189,248,0.22)]">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-cyan-300/70 to-purple-400/60 animate-[robotCircuitSweep_8s_linear_infinite]" />
              </div>
            </div>
            <div className="flex flex-1 items-end justify-center pb-1">
              <div className="flex h-8 w-24 items-center justify-center gap-3 rounded-full border border-cyan-400/40 bg-slate-900/75 px-4 text-[9px] uppercase tracking-[0.4em] text-cyan-200 animate-[robotBadgePulse_5.5s_ease-in-out_infinite]">
                <span>bot</span>
                <span>link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
