const API_BASE = import.meta.env.VITE_API_BASE ?? ''

type HttpMethod = 'GET' | 'POST'

type RequestOptions<TBody> = {
  method?: HttpMethod
  body?: TBody
  signal?: AbortSignal
}

type JsonRecord = Record<string, unknown>

function assertApiBase() {
  if (!API_BASE) {
    throw new Error('Missing VITE_API_BASE environment variable')
  }
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions<JsonRecord | undefined> = {},
): Promise<TResponse> {
  assertApiBase()

  const { method = 'GET', body, signal } = options
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  const init: RequestInit = {
    method,
    headers,
    signal,
  }

  if (body !== undefined) {
    init.body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${path}`, init)

  if (!response.ok) {
    const errorPayload = await safeParseJson(response)
    const message =
      typeof errorPayload?.detail === 'string'
        ? errorPayload.detail
        : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return (await safeParseJson(response)) as TResponse
}

async function safeParseJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export type { JsonRecord, RequestOptions }
