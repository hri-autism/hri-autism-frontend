import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  tone?: 'light' | 'dark'
}

export function SectionHeader({
  title,
  description,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeaderProps) {
  const alignment =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleClass = tone === 'dark' ? 'text-white' : 'text-slate-900'
  const descriptionClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-600'

  return (
    <header
      className={`flex flex-col gap-4 ${alignment} ${className}`}
    >
      <h1 className={`text-3xl font-semibold ${titleClass}`}>{title}</h1>
      {description ? (
        <p className={`max-w-3xl text-base ${descriptionClass}`}>{description}</p>
      ) : null}
    </header>
  )
}
