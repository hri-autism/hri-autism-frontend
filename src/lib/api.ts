const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export function buildUrl(path: string) {
  return `${API_BASE}${path}`
}
