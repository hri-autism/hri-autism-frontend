import type { ReactNode } from 'react'

type FormSectionProps = {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  tone?: 'light' | 'dark'
}

export function FormSection({
  title,
  description,
  children,
  tone = 'light',
  className = '',
}: FormSectionProps) {
  const toneClasses =
    tone === 'dark'
      ? 'border-slate-700/60 bg-slate-900/70 text-slate-100'
      : 'border-slate-200 bg-white/80 text-slate-800'

  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm ${toneClasses} ${className}`}
    >
      <div className="space-y-4">
        {(title || description) && (
          <div className="space-y-1">
            {title ? (
              <h2 className="text-lg font-semibold">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm opacity-80">{description}</p>
            ) : null}
          </div>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  )
}
