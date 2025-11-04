import type { InputHTMLAttributes } from 'react'

type TextInputProps = {
  label: string
  hint?: string
  error?: string | null
  tone?: 'light' | 'dark'
} & InputHTMLAttributes<HTMLInputElement>

export function TextInput({
  label,
  hint,
  error,
  tone = 'light',
  className,
  id,
  ...rest
}: TextInputProps) {
  const controlId = id ?? rest.name ?? undefined
  const isDark = tone === 'dark'
  const labelClass = isDark
    ? 'text-xs font-semibold uppercase tracking-[0.32em] text-slate-300'
    : 'text-sm font-medium text-slate-700'
  const hintClass = isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'
  const errorClass = isDark ? 'text-xs text-rose-300' : 'text-xs text-red-600'

  const classes = [
    'rounded-2xl border px-4 py-3 text-sm shadow-sm focus:outline-none transition duration-200 disabled:cursor-not-allowed',
    error
      ? isDark
        ? 'border-rose-400/70 focus:border-rose-300 focus:ring-rose-300/40 bg-rose-500/10 text-rose-100'
        : 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50'
      : isDark
        ? 'border-cyan-400/25 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300'
        : 'border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
    isDark ? 'shadow-[0_18px_40px_rgba(8,23,53,0.4)]' : '',
    isDark ? 'disabled:bg-slate-900/60' : 'disabled:bg-slate-100',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={controlId}
        className={labelClass}
      >
        {label}
      </label>
      <input
        id={controlId}
        {...rest}
        className={classes}
      />
      {hint ? <p className={hintClass}>{hint}</p> : null}
      {error ? <p className={errorClass}>{error}</p> : null}
    </div>
  )
}
