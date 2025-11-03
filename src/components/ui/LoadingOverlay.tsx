import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

type LoadingOverlayProps = {
  label?: string
  children?: ReactNode
  className?: string
}

export function LoadingOverlay({
  label = 'Loading...',
  children,
  className = '',
}: LoadingOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
        <Spinner size="md" />
        <span>{children ?? label}</span>
      </div>
    </div>
  )
}
