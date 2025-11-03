import type { InputHTMLAttributes } from 'react'

type TextInputProps = {
  label: string
  hint?: string
  error?: string | null
} & InputHTMLAttributes<HTMLInputElement>

export function TextInput({
  label,
  hint,
  error,
  className,
  id,
  ...rest
}: TextInputProps) {
  const controlId = id ?? rest.name ?? undefined
  const classes = [
    'rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100',
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={controlId}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={controlId}
        {...rest}
        className={classes}
      />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
