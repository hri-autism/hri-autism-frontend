const metrics = [
  { label: 'Prompt iterations saved', value: '3x faster' },
  { label: 'Emotional cues captured', value: '180+' },
  { label: 'Therapist collaborations', value: '50+ teams' },
]

export function AboutMetrics() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-6 rounded-2xl border border-cyan-400/20 bg-slate-900/40 p-10 text-slate-100 shadow-[0_30px_100px_rgba(56,189,248,0.15)] backdrop-blur">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Designed for neurodiverse interaction</h2>
          <p className="text-sm text-slate-300/90">
            Every prompt respects the child’s sensory profile, communication style, and current energy — so the robot feels less robotic.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center shadow-lg">
              <div className="text-xl font-semibold text-cyan-200">{metric.value}</div>
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
