import { Button } from './Button'

export function CTASection() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(79,70,229,0.15)_0%,rgba(56,189,248,0.08)_45%,rgba(14,116,144,0.04)_100%)]" />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-12 text-center shadow-[0_45px_140px_rgba(56,189,248,0.25)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_65%)]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="relative space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200">
              stay in sync
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
            <span className="md:hidden">
              Ready to guide your robot with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                real-time care?
              </span>
            </span>
            <span className="hidden md:block">
              Ready to synchronize your robot
              <span className="block">
                with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                  real-time empathy
                </span>
                ?
              </span>
            </span>
            </h2>
            <p className="text-base text-slate-200/80 md:text-lg">
              Capture a child baseline and keep logging daily sessions.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
              <Button as="link" href="/session/new" size="md" className="px-6">
                Start a new session
              </Button>
              <Button
                as="link"
                href="/child/new"
                variant="secondary"
                size="md"
                className="px-6"
              >
                Create child profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
