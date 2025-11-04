type SpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

const sizeClassMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
}

export function Spinner({ size = 'sm', className = '' }: SpinnerProps) {
  const sizeClasses = sizeClassMap[size]

  return (
    <span
      className={`relative inline-flex ${sizeClasses} items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-full border border-cyan-400/40 blur-[2px]" />
      <span className="absolute inset-0 animate-[pulseGlow_2.2s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-500/20 blur-sm" />
      <span className="relative h-1/2 w-1/2 rounded-full bg-gradient-to-br from-cyan-200/90 via-blue-300/60 to-purple-300/60 shadow-[0_0_18px_rgba(56,189,248,0.45)]" />
    </span>
  )
}
