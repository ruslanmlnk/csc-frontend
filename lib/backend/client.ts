import { getBackendUrl } from '@/lib/auth-server'
import {
  DEFAULT_LANGUAGE,
  getLanguageFromCookieString,
  type SiteLanguage,
} from '@/lib/i18n'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface BackendRequestOptions
  extends Omit<RequestInit, 'method' | 'headers' | 'body' | 'cache'> {
  method?: HttpMethod
  data?: unknown
  token?: string
  locale?: SiteLanguage
  headers?: HeadersInit
  cache?: RequestCache
}

export interface BackendResult<T> {
  ok: boolean
  status: number
  data: T | null
}

const normalizePath = (path: string): string => (path.startsWith('/') ? path : `/${path}`)

const getCookieHeaderValue = (headers?: HeadersInit): string | null => {
  if (!headers) {
    return null
  }

  const normalizedHeaders = new Headers(headers)
  return normalizedHeaders.get('cookie')
}

const resolveRequestLanguage = (
  locale: SiteLanguage | undefined,
  headers?: HeadersInit,
): SiteLanguage => {
  if (locale) {
    return locale
  }

  const cookieHeader = getCookieHeaderValue(headers)
  if (cookieHeader) {
    return getLanguageFromCookieString(cookieHeader)
  }

  if (typeof document !== 'undefined') {
    return getLanguageFromCookieString(document.cookie)
  }

  return DEFAULT_LANGUAGE
}

const buildRequestURL = (
  path: string,
  method: HttpMethod,
  locale: SiteLanguage | undefined,
  headers?: HeadersInit,
): string => {
  const baseURL = getBackendUrl()
  const url = new URL(`${baseURL}${normalizePath(path)}`)

  if (method === 'GET') {
    const resolvedLocale = resolveRequestLanguage(locale, headers)

    if (!url.searchParams.has('locale')) {
      url.searchParams.set('locale', resolvedLocale)
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
  const { method = 'GET', data, token, locale, headers: customHeaders, cache, ...rest } = options
  const headers = new Headers(customHeaders)

  if (token) {
    headers.set('Authorization', `JWT ${token}`)
  }

  let body: string | undefined

  if (data !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(data)
  }

  const response = await fetch(buildRequestURL(path, method, locale, customHeaders), {
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
