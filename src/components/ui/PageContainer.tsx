import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function PageContainer({
  children,
  className = '',
  contentClassName = '',
}: PageContainerProps) {
  return (
    <main className={`min-h-screen bg-slate-50 py-16 px-4 ${className}`}>
      <div className={`mx-auto max-w-5xl space-y-10 ${contentClassName}`}>
        {children}
      </div>
    </main>
  )
}
