import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonAs = 'button' | 'link'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  className?: string
  children: ReactNode
  as?: ButtonAs
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200',
  secondary:
    'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-200',
  ghost:
    'text-blue-600 hover:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-3.5 text-lg',
}

type ButtonClassOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonClassOptions = {}) {
  const variantClass = variantClasses[variant]
  const sizeClass = sizeClasses[size]
  return `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  type = 'button',
  as = 'button',
  href,
  ...rest
}: ButtonProps) {
  const composedClassName = buttonClasses({ variant, size, className })
  const isDisabled = disabled ?? loading

  const content = (
    <>
      {loading ? <Spinner size="sm" /> : icon}
      <span>{children}</span>
    </>
  )

  if (as === 'link') {
    return (
      <a
        href={href}
        className={composedClassName}
        aria-disabled={isDisabled || undefined}
        {...rest}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault()
            return
          }
          rest.onClick?.(event as any)
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={composedClassName}
      disabled={isDisabled}
      {...rest}
    >
      {content}
    </button>
  )
}
