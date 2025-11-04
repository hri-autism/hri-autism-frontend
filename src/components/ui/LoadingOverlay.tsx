import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

type LoadingOverlayProps = {
  label?: string
  children?: ReactNode
  className?: string
  tone?: 'light' | 'dark'
}

export function LoadingOverlay({
  label = 'Loading...',
  children,
  className = '',
  tone = 'light',
}: LoadingOverlayProps) {
  const isDark = tone === 'dark'
  const backdropClass = isDark
    ? 'bg-slate-950/85 text-cyan-100'
    : 'bg-white/70 text-slate-700'

  const innerClass = isDark
    ? 'border border-cyan-400/40 bg-slate-950/80 text-cyan-100 shadow-[0_40px_120px_rgba(56,189,248,0.28)]'
    : 'border border-slate-200 bg-white text-slate-700'

  const accentBar = isDark ? (
    <span className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur" />
  ) : null

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md ${backdropClass} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`relative flex items-center gap-4 rounded-2xl px-6 py-4 text-sm ${innerClass}`}
      >
        {accentBar}
        <Spinner size="md" className="shrink-0" />
        <span className="font-mono text-sm uppercase tracking-[0.32em]">
          {children ?? label}
        </span>
      </div>
    </div>
  )
}
