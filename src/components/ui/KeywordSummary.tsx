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
          className="relative hidden w-full max-w-[220px] md:flex md:h-full md:self-stretch md:flex-col md:items-center"
          aria-hidden="true"
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="relative flex h-28 w-20 flex-col items-center animate-[float_7s_ease-in-out_infinite]">
              <div className="relative h-8 w-12 rounded-full border border-slate-200 bg-white/80 shadow-[0_5px_15px_rgba(56,189,248,0.2)]">
                <span className="absolute left-1/2 top-1/2 flex h-1 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-between">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900/70 animate-pulse" />
                  <span className="h-0.5 w-4 rounded-full bg-slate-900/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-900/70 animate-pulse" />
                </span>
              </div>
              <div className="relative mt-2 h-16 w-14 rounded-[36%] border border-slate-200 bg-white/70 shadow-[0_10px_25px_rgba(59,130,246,0.2)]">
                <span className="absolute -left-4 top-4 h-6 w-4 rounded-full border border-slate-200/40 bg-white/40 animate-[float_6s_ease-in-out_infinite]" />
                <span className="absolute -right-4 top-4 h-6 w-4 rounded-full border border-slate-200/40 bg-white/40 animate-[float_6s_ease-in-out_infinite_reverse]" />
                <span className="absolute bottom-2 left-1/2 h-6 w-10 -translate-x-1/2 rounded-full border border-slate-200/80 bg-slate-50/60" />
              </div>
              <div className="relative mt-2 flex w-16 justify-between">
                <span className="h-4 w-5 rounded-full border border-slate-200/30 bg-white/40" />
                <span className="h-4 w-5 rounded-full border border-slate-200/30 bg-white/40" />
              </div>
            </div>
            <div className="mt-4 flex h-1 w-16 items-center justify-center gap-2 opacity-60">
              <span className="h-1 w-7 rounded-full bg-gradient-to-r from-cyan-300/40 to-transparent" />
              <span className="h-1 w-7 rounded-full bg-gradient-to-l from-purple-300/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
