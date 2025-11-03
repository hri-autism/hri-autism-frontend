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
}

export function EmptyState({
  title,
  description,
  icon,
  actions = [],
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center ${className}`}
    >
      {icon ? <div className="text-3xl text-slate-400">{icon}</div> : null}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-slate-600">{description}</p>
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
