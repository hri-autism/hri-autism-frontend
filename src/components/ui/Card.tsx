import type { ReactNode } from 'react'

type CardProps = {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({
  title,
  description,
  children,
  footer,
  className = '',
}: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-shadow ${className}`}
    >
      <div className="space-y-4">
        {(title || description) && (
          <div className="space-y-1">
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
        )}
        <div className="space-y-4">{children}</div>
        {footer ? <div className="pt-2">{footer}</div> : null}
      </div>
    </section>
  )
}
