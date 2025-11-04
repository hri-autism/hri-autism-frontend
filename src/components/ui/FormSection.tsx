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
  const isDark = tone === 'dark'
  const baseClasses =
    'relative overflow-hidden rounded-3xl border transition-shadow duration-300'
  const toneClasses = isDark
    ? 'border-cyan-400/25 bg-slate-950/70 text-slate-100 shadow-[0_40px_120px_rgba(8,23,53,0.65)] backdrop-blur-xl'
    : 'border-slate-200/60 bg-white/85 text-slate-800 shadow-[0_35px_80px_rgba(15,23,42,0.12)]'
  const titleClass = isDark ? 'text-xl font-semibold text-white' : 'text-xl font-semibold text-slate-900'
  const descriptionClass = isDark
    ? 'text-sm text-slate-300/90'
    : 'text-sm text-slate-600'

  return (
    <section
      className={`${baseClasses} ${toneClasses} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_70%)]" />
      {isDark ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.08)_0%,rgba(129,140,248,0.12)_45%,rgba(14,116,144,0.08)_100%)]" />
      ) : null}
      <div className="relative space-y-6 p-6 md:p-8">
        {(title || description) && (
          <div className="space-y-2">
            {title ? (
              <h2 className={titleClass}>{title}</h2>
            ) : null}
            {description ? (
              <p className={descriptionClass}>{description}</p>
            ) : null}
          </div>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  )
}
