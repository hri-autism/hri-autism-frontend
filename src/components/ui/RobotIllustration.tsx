import { useMemo } from 'react'

const bubbleColors = ['#38BDF8', '#8B5CF6', '#F59E0B']

export function RobotIllustration() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, idx) => ({
        size: 8 + Math.random() * 20,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        color: bubbleColors[idx % bubbleColors.length],
      })),
    [],
  )

  return (
    <div className="relative h-64 w-64">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/80 via-purple-500/70 to-cyan-400/70 blur-3xl opacity-70" />
      <div className="absolute inset-6 rounded-[48%] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 shadow-[0_20px_70px_rgba(56,189,248,0.35)]" />
      <div className="absolute left-1/2 top-16 -translate-x-1/2">
        <div className="relative h-24 w-32 overflow-hidden rounded-3xl border border-white/40 bg-slate-800/90 shadow-lg">
          <div className="absolute inset-x-6 top-6 h-10 rounded-xl bg-slate-900/80 shadow-inner">
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
              <div className="absolute inset-0 animate-[scan_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
              <div className="absolute inset-x-4 top-1 flex h-2 items-center gap-2">
                <span className="h-1 w-16 rounded-full bg-cyan-200/70" />
                <span className="h-1 w-6 rounded-full bg-purple-300/50" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-8 bottom-5 flex h-1 items-center justify-between opacity-80">
            <span className="h-1 w-10 rounded-full bg-cyan-300/50" />
            <span className="h-1 w-6 rounded-full bg-purple-400/40" />
            <span className="h-1 w-4 rounded-full bg-amber-300/40" />
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-[11.5rem] -translate-x-1/2">
        <div className="h-14 w-14 rounded-full border border-white/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-inner" />
        <div className="absolute left-1/2 top-10 h-10 w-2 -translate-x-1/2 rounded-full bg-slate-800/80" />
        <div className="robot-antenna absolute -left-8 top-4 h-20 w-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 opacity-70" />
        <div
          className="robot-antenna absolute -right-8 top-4 h-20 w-3 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 opacity-70"
          style={{ animationDelay: '2.25s' }}
        />
      </div>
      <div className="absolute inset-0">
        <div
          className="hero-beam-shift absolute h-60 w-20 rotate-12 rounded-full bg-gradient-to-b from-cyan-300/55 via-transparent to-transparent blur-3xl mix-blend-screen"
          style={{ left: '-4rem', top: '1rem' }}
        />
        <div
          className="hero-beam-sweep absolute h-72 w-24 -rotate-6 rounded-full bg-gradient-to-b from-purple-400/55 via-transparent to-transparent blur-[70px] mix-blend-screen"
          style={{ right: '-4.5rem', top: '2.5rem' }}
        />
        {bubbles.map((bubble, idx) => (
          <span
            key={idx}
            style={{
              width: bubble.size,
              height: bubble.size,
              top: `${bubble.top}%`,
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`,
              backgroundColor: bubble.color,
            }}
            className="absolute animate-[float_6s_ease-in-out_infinite] rounded-full opacity-60"
          />
        ))}
      </div>
    </div>
  )
}

export const heroBackgroundStyles = `
  relative flex flex-col overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#0B1120] text-white md:min-h-screen
  before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]
  after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(120deg,rgba(139,92,246,0.15)_0%,rgba(56,189,248,0.05)_100%)]
`

export const heroParallaxStyles = `
  perspective-1000 relative isolate
  [--cloud-start:translateZ(-200px)_scale(1.2)]
  [--cloud-mid:translateZ(-100px)_scale(1.1)]
  [--cloud-front:translateZ(0px)_scale(1)]
`
