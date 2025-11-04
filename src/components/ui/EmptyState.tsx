import type { ReactNode } from 'react'
import { Button } from './Button'

export type EmptyStateAction = {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

type EmptyStateProps = {
  title: string
  description?: ReactNode
  icon?: ReactNode
  actions?: EmptyStateAction[]
  className?: string
  tone?: 'light' | 'dark'
}

export function EmptyState({
  title,
  description,
  icon,
  actions = [],
  className = '',
  tone = 'light',
}: EmptyStateProps) {
  const toneClasses =
    tone === 'dark'
      ? 'border-slate-700/60 bg-slate-900/60 text-slate-100'
      : 'border-slate-300 bg-white/70 text-slate-900'

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-10 text-center backdrop-blur ${toneClasses} ${className}`}
    >
      {icon ? (
        <div className={`text-3xl ${tone === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm opacity-80">{description}</p>
        ) : null}
      </div>
      {actions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {actions.map(({ label, onClick, href, variant = 'primary' }) => (
            <Button
              key={label}
              as={href ? 'link' : 'button'}
              href={href}
              onClick={onClick}
              variant={variant}
            >
              {label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
