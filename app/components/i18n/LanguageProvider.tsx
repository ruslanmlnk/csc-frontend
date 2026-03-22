'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  LANGUAGE_COOKIE_NAME,
  getLocaleForLanguage,
  messages,
  resolveLanguage,
  type SiteLanguage,
  type SiteMessages,
} from '@/lib/i18n'

type LanguageContextValue = {
  language: SiteLanguage
  locale: string
  messages: SiteMessages
  setLanguage: (language: SiteLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

type LanguageProviderProps = {
  children: React.ReactNode
  initialLanguage: SiteLanguage
}

const persistLanguage = (language: SiteLanguage) => {
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; SameSite=Lax`

  try {
    window.localStorage.setItem(LANGUAGE_COOKIE_NAME, language)
  } catch {
    // Ignore storage issues in privacy-restricted environments.
  }
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<SiteLanguage>(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    try {
      const stored = resolveLanguage(window.localStorage.getItem(LANGUAGE_COOKIE_NAME))

      if (stored !== language) {
        persistLanguage(stored)
        setLanguageState(stored)
        return
      }
    } catch {
      // Ignore storage issues and keep the server-provided language.
    }

    persistLanguage(language)
  }, [language])

  const setLanguage = (nextLanguage: SiteLanguage) => {
    if (nextLanguage === language) return

    persistLanguage(nextLanguage)
    setLanguageState(nextLanguage)
    window.location.reload()
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      locale: getLocaleForLanguage(language),
      messages: messages[language],
      setLanguage,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
