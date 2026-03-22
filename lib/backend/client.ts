import { getBackendUrl } from '@/lib/auth-server'
import { getServerLanguage } from '@/lib/i18n/server'

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

const buildRequestURL = async (path: string, method: HttpMethod): Promise<string> => {
  const baseURL = getBackendUrl()
  const url = new URL(`${baseURL}${normalizePath(path)}`)

  if (method === 'GET') {
    const locale = await getServerLanguage()

    if (!url.searchParams.has('locale')) {
      url.searchParams.set('locale', locale)
    }

    if (!url.searchParams.has('fallback-locale')) {
      url.searchParams.set('fallback-locale', 'en')
    }
  }

  return url.toString()
}

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

  const response = await fetch(await buildRequestURL(path, method), {
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
