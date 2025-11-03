import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

type StatusVariant = 'info' | 'success' | 'error' | 'loading'

type StatusBannerProps = {
  variant: StatusVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<StatusVariant, string> = {
  info: 'border-slate-300 bg-slate-50 text-slate-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  loading: 'border-blue-200 bg-blue-50 text-blue-700',
}

const variantLabels: Record<StatusVariant, string> = {
  info: 'Info',
  success: 'Success',
  error: 'Error',
  loading: 'Loading',
}

export function StatusBanner({
  variant,
  children,
  className = '',
}: StatusBannerProps) {
  if (!children) return null

  const baseClasses =
    'rounded-md border px-4 py-3 text-sm flex items-start gap-3'

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role={variant === 'loading' ? 'status' : variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <span className="flex items-center gap-2 font-semibold">
        {variant === 'loading' ? <Spinner size="sm" /> : null}
        {variantLabels[variant]}
      </span>
      <span>{children}</span>
    </div>
  )
}
