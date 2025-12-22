import { useEffect, useState } from 'react'
import { Button } from './Button'
import { RobotIllustration, heroBackgroundStyles } from './RobotIllustration'

export function Hero() {
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.15)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className={`${heroBackgroundStyles}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/3 -top-1/4 h-[60vh] w-[60vw] rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-500/30 to-blue-500/40 blur-3xl"
          style={{ transform: `translateY(${offsetY * 0.4}px)` }}
        />
        <div
          className="absolute right-[-10%] top-1/3 h-[50vh] w-[40vw] rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-3xl"
          style={{ transform: `translateY(${offsetY * -0.2}px)` }}
        />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pb-10 pt-12 md:gap-16 md:px-6 md:pb-24 md:pt-32 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[18rem] space-y-6 text-center md:max-w-xl md:space-y-8 md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200">
            <span className="md:hidden">AI-led prompts</span>
            <span className="hidden md:inline">AI + emotion-aware prompts</span>
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
            <span className="md:hidden">
              Guide your social robot with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                real-time care
              </span>
            </span>
            <span className="hidden md:inline">
              Guide your robot with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
                real-time empathy
              </span>
            </span>
          </h1>
          <p className="text-lg text-slate-200/90">
            <span className="md:hidden">Share context so every interaction stays calm and attentive.</span>
            <span className="hidden md:inline">
              Parents and therapists collaborate to give the robot just-in-time context, so every interaction feels
              warm and attentive.
            </span>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button as="link" href="/session/new" size="lg">
              Start a new session
            </Button>
            <Button as="link" href="/child/new" variant="ghost" size="lg">
              Create child profile
            </Button>
          </div>
        </div>
        <div className="relative hidden h-[26rem] w-full max-w-md items-center justify-center lg:flex">
          <div
            className="absolute inset-0 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/60 to-slate-900/30 shadow-[0_40px_120px_rgba(56,189,248,0.25)]"
            style={{ transform: `translateY(${offsetY * -0.2}px)` }}
          />
          <RobotIllustration />
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-center pb-8 md:pb-12">
        <a
          href="#features"
          className="flex flex-col items-center gap-3 text-slate-300/80 transition hover:text-cyan-200"
        >
          <span className="text-xs uppercase tracking-[0.4em]">Scroll</span>
          <span className="flex h-14 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/40">
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
          </span>
        </a>
      </div>
    </section>
  )
}
