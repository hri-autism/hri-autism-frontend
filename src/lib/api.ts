const API_BASE = import.meta.env.VITE_API_BASE ?? ''
const ACCESS_TOKEN_KEY = 'auth_access_token'

type HttpMethod = 'GET' | 'POST'

type RequestOptions<TBody> = {
  method?: HttpMethod
  body?: TBody
  signal?: AbortSignal
  skipAuthHandling?: boolean
}

type JsonRecord = Record<string, unknown>
type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function assertApiBase() {
  if (!API_BASE) {
    throw new Error('Missing VITE_API_BASE environment variable')
  }
}

function getStoredToken() {
  return typeof localStorage !== 'undefined'
    ? localStorage.getItem(ACCESS_TOKEN_KEY)
    : null
}

function storeToken(token: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

function clearStoredToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

function handleUnauthorized() {
  clearStoredToken()
  if (unauthorizedHandler) {
    unauthorizedHandler()
    return
  }
  window.location.href = '/login'
}

export function setAccessToken(token: string) {
  storeToken(token)
}

export function clearAccessToken() {
  clearStoredToken()
}

export function getAccessToken() {
  return getStoredToken()
}

export function onUnauthorized(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions<JsonRecord | undefined> = {},
): Promise<TResponse> {
  assertApiBase()

  const { method = 'GET', body, signal, skipAuthHandling = false } = options
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
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

  if ((response.status === 401 || response.status === 403) && !skipAuthHandling) {
    handleUnauthorized()
  }

  if (!response.ok) {
    const errorPayload = await safeParseJson(response)
    const message =
      typeof errorPayload?.detail === 'string'
        ? errorPayload.detail
        : `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
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
export { ApiError }
