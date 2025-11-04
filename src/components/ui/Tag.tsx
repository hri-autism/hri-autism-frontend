import type { ReactNode } from 'react'

type TagVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'danger'
  | 'glow'
  | 'baseline'
  | 'mood'
  | 'environment'

type TagProps = {
  variant?: TagVariant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const variantClasses: Record<TagVariant, string> = {
  neutral: 'bg-slate-200 text-slate-700',
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
  glow:
    'border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_25px_rgba(56,189,248,0.35)]',
  baseline:
    'border border-purple-400/30 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 text-purple-100 uppercase tracking-[0.25em]',
  mood:
    'border border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/10 text-emerald-100',
  environment:
    'border border-cyan-400/35 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/5 text-cyan-200',
}

export function Tag({
  variant = 'neutral',
  icon,
  children,
  className = '',
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {icon ? <span className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
    </span>
  )
}
