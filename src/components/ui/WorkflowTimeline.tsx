import { Card } from './Card'

const steps = [
  {
    title: 'Create child profile',
    description:
      'Capture the child’s long-term preferences, triggers, and skill goals so the robot has a reliable baseline.',
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
          <div key={step.title} className="relative flex gap-6">
            <div className="hidden flex-col items-center md:flex">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/70 text-lg font-semibold text-cyan-200 shadow-lg">
                {index + 1}
              </span>
            </div>
            <Card
              title={step.title}
              description={step.description}
              className="flex-1 bg-white/85 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="hidden text-sm text-slate-500 md:block">
                Step {index + 1}
              </span>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}
