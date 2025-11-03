type SpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

const sizeClassMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-[3px]',
}

export function Spinner({ size = 'sm', className = '' }: SpinnerProps) {
  const sizeClasses = sizeClassMap[size]
  return (
    <span
      className={`inline-block animate-spin rounded-full border-slate-300 border-t-blue-500 ${sizeClasses} ${className}`}
      aria-hidden="true"
    />
  )
}
