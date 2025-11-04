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
  const backdropClass =
    tone === 'dark' ? 'bg-slate-950/80 text-slate-200' : 'bg-white/70 text-slate-700'
  const innerClass =
    tone === 'dark'
      ? 'border border-slate-700 bg-slate-900/90 text-slate-200'
      : 'border border-slate-200 bg-white text-slate-700'

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm ${backdropClass} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm shadow-sm ${innerClass}`}
      >
        <Spinner size="md" />
        <span>{children ?? label}</span>
      </div>
    </div>
  )
}
