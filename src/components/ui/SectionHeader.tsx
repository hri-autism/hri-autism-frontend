import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const alignment =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <header
      className={`flex flex-col gap-4 ${alignment} ${className}`}
    >
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      {description ? (
        <p className="max-w-3xl text-base text-slate-600">{description}</p>
      ) : null}
    </header>
  )
}
