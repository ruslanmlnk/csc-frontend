import { messages } from './messages'

export const SITE_LANGUAGES = ['en', 'uk'] as const

export type SiteLanguage = (typeof SITE_LANGUAGES)[number]
export type SiteMessages = (typeof messages)[SiteLanguage]

export const LANGUAGE_COOKIE_NAME = 'inferra_lang'
export const DEFAULT_LANGUAGE: SiteLanguage = 'en'

export const resolveLanguage = (value?: string | null): SiteLanguage => {
  if (!value) return DEFAULT_LANGUAGE
  return SITE_LANGUAGES.includes(value as SiteLanguage) ? (value as SiteLanguage) : DEFAULT_LANGUAGE
}

export const getLanguageFromCookieString = (cookieHeader?: string | null): SiteLanguage => {
  if (!cookieHeader) {
    return DEFAULT_LANGUAGE
  }

  const chunks = cookieHeader.split(';')

  for (const chunk of chunks) {
    const [rawKey, ...rawValueParts] = chunk.split('=')
    if (rawKey?.trim() !== LANGUAGE_COOKIE_NAME) {
      continue
    }

    const rawValue = rawValueParts.join('=').trim()
    return resolveLanguage(rawValue ? decodeURIComponent(rawValue) : null)
  }

  return DEFAULT_LANGUAGE
}

export const getLocaleForLanguage = (language: SiteLanguage): string =>
  language === 'uk' ? 'uk-UA' : 'en-US'

export const formatDateValue = (
  value: string | number | Date,
  language: SiteLanguage,
  options: Intl.DateTimeFormatOptions,
): string => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(getLocaleForLanguage(language), options).format(date)
}

export const formatNumberValue = (value: number, language: SiteLanguage): string =>
  new Intl.NumberFormat(getLocaleForLanguage(language)).format(value)

export { messages }
