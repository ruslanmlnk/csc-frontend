import { getBackendUrl } from '@/lib/auth-server'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface BackendRequestOptions
  extends Omit<RequestInit, 'method' | 'headers' | 'body' | 'cache'> {
  method?: HttpMethod
  data?: unknown
  token?: string
  headers?: HeadersInit
  cache?: RequestCache
}

export interface BackendResult<T> {
  ok: boolean
  status: number
  data: T | null
}

const normalizePath = (path: string): string => (path.startsWith('/') ? path : `/${path}`)

export async function backendRequest<T>(
  path: string,
  options: BackendRequestOptions = {},
): Promise<BackendResult<T>> {
  const { method = 'GET', data, token, headers: customHeaders, cache, ...rest } = options
  const headers = new Headers(customHeaders)

  if (token) {
    headers.set('Authorization', `JWT ${token}`)
  }

  let body: string | undefined

  if (data !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(data)
  }

  const response = await fetch(`${getBackendUrl()}${normalizePath(path)}`, {
    ...rest,
    method,
    headers,
    body,
    cache,
  })

  const responseData = (await response.json().catch(() => null)) as T | null

  return {
    ok: response.ok,
    status: response.status,
    data: responseData,
  }
}
