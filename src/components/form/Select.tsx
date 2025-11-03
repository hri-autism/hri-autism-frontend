import type { SelectHTMLAttributes } from 'react'

type Option = {
  label: string
  value: string
}

type SelectProps = {
  label: string
  options: Option[]
  placeholder?: string
  hint?: string
  error?: string | null
} & SelectHTMLAttributes<HTMLSelectElement>

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  id,
  ...rest
}: SelectProps) {
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
      <select
        id={controlId}
        {...rest}
        className={classes}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
