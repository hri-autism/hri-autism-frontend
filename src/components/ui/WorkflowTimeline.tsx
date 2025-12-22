import { Card } from './Card'

const steps = [
  {
    title: 'Create child profile',
    description:
      'Capture child’s long-term preferences, triggers, and skill goals so the robot has a reliable baseline.',
  },
  {
    title: 'Fill out the daily session form',
    description:
      'Record today’s mood, environment, and situational notes to reflect current energy and sensitivities.',
  },
  {
    title: 'Robot-ready prompt',
    description:
      'We synthesize everything into a single system prompt that the robot can follow right away.',
  },
]

export function WorkflowTimeline() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16">
      <div className="absolute left-5 top-16 bottom-16 hidden w-px bg-gradient-to-b from-cyan-400/40 to-purple-500/40 md:block" />
      <div className="space-y-10">
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex items-center justify-center md:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 text-sm font-semibold text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                {index + 1}
              </span>
            </div>
            <div className="hidden flex-col items-center md:flex">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 text-lg font-semibold text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                {index + 1}
              </span>
            </div>
            <Card
              title={step.title}
              description={step.description}
              tone="dark"
              className="flex-1 border-cyan-400/15 bg-slate-900/60 backdrop-blur-lg shadow-[0_18px_60px_rgba(8,23,53,0.6)] transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_30px_110px_rgba(56,189,248,0.25)]"
            >
              <span className="text-sm text-cyan-200/70">
                Step {index + 1}
              </span>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
