import { cookies } from 'next/headers'
import { LANGUAGE_COOKIE_NAME, messages, resolveLanguage, type SiteLanguage, type SiteMessages } from './index'

export const getServerLanguage = async (): Promise<SiteLanguage> => {
  const cookieStore = await cookies()
  return resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value)
}

export const getServerMessages = async (): Promise<SiteMessages> => {
  const language = await getServerLanguage()
  return messages[language]
}

export const getServerI18n = async (): Promise<{ language: SiteLanguage; messages: SiteMessages }> => {
  const language = await getServerLanguage()

  return {
    language,
    messages: messages[language],
  }
}
