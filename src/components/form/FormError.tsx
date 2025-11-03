import type { ReactNode } from 'react'

type FormErrorProps = {
  children: ReactNode
  className?: string
}

export function FormError({ children, className }: FormErrorProps) {
  if (!children) return null

  const classes = [
    'rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}
