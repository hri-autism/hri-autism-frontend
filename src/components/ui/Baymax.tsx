type BaymaxProps = {
  className?: string
}

export function Baymax({ className = '' }: BaymaxProps) {
  const base =
    'relative hidden w-full max-w-[220px] md:flex md:h-full md:self-stretch md:flex-col md:items-center'

  return (
    <div className={`${base} ${className}`} aria-hidden="true">
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
  )
}
