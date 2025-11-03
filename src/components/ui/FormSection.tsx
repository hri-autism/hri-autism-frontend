import type { ReactNode } from 'react'

type FormSectionProps = {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm ${className}`}
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
      </div>
    </section>
  )
}
