import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  variant?: ButtonVariant
  loading?: boolean
  icon?: ReactNode
  className?: string
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200',
  secondary:
    'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-200',
  ghost:
    'text-blue-600 hover:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  className = '',
) {
  const variantClass = variantClasses[variant]
  return `${baseClasses} ${variantClass} ${className}`.trim()
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const composedClassName = buttonClasses(variant, className)
  const isDisabled = disabled ?? loading

  return (
    <button
      type={type}
      className={composedClassName}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <Spinner size="sm" /> : icon}
      <span>{children}</span>
    </button>
  )
}
