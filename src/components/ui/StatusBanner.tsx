import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

type StatusVariant = 'info' | 'success' | 'error' | 'loading'

type StatusBannerProps = {
  variant: StatusVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<StatusVariant, string> = {
  info: 'border-cyan-400/40 bg-slate-900/70 text-cyan-100 shadow-[0_25px_60px_rgba(56,189,248,0.15)]',
  success:
    'border-emerald-400/40 bg-slate-900/70 text-emerald-100 shadow-[0_25px_60px_rgba(16,185,129,0.15)]',
  error:
    'border-rose-400/40 bg-slate-900/70 text-rose-200 shadow-[0_25px_60px_rgba(244,63,94,0.2)]',
  loading:
    'border-blue-400/40 bg-slate-900/70 text-cyan-100 shadow-[0_25px_60px_rgba(59,130,246,0.18)]',
}

const variantLabels: Record<StatusVariant, string> = {
  info: 'Info',
  success: 'Success',
  error: 'Error',
  loading: 'Loading',
}

export function StatusBanner({
  variant,
  children,
  className = '',
}: StatusBannerProps) {
  if (!children) return null

  const baseClasses =
    'flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm backdrop-blur-md transition-shadow'

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role={variant === 'loading' ? 'status' : variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
        {variant === 'loading' ? <Spinner size="sm" /> : null}
        {variantLabels[variant]}
      </span>
      <span className="font-mono text-sm text-slate-100 tracking-[0.08em]">
        {children}
      </span>
    </div>
  )
}
