import type { ReactNode } from 'react'

type TagVariant = 'neutral' | 'info' | 'success' | 'danger'

type TagProps = {
  variant?: TagVariant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const variantClasses: Record<TagVariant, string> = {
  neutral: 'bg-slate-200 text-slate-700',
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-100 text-red-700',
}

export function Tag({
  variant = 'neutral',
  icon,
  children,
  className = '',
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {icon ? <span className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
    </span>
  )
}
