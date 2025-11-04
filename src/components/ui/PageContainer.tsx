import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  variant?: 'light' | 'dark'
  className?: string
  contentClassName?: string
}

const variantClasses: Record<NonNullable<PageContainerProps['variant']>, string> =
  {
    light: 'bg-slate-50 text-slate-900',
    dark: 'bg-slate-950 text-slate-100',
  }

export function PageContainer({
  children,
  variant = 'light',
  className = '',
  contentClassName = '',
}: PageContainerProps) {
  return (
    <main
      className={`min-h-screen py-16 px-4 ${variantClasses[variant]} ${className}`}
    >
      <div className={`mx-auto max-w-5xl space-y-10 ${contentClassName}`}>
        {children}
      </div>
    </main>
  )
}
