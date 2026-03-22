'use client'

import React from 'react'
import type { SiteLanguage } from '@/lib/i18n'
import { useLanguage } from './LanguageProvider'

type LanguageSwitcherProps = {
  className?: string
}

const options: { label: string; value: SiteLanguage }[] = [
  { label: 'EN', value: 'en' },
  { label: 'UA', value: 'uk' },
]

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, messages: t, setLanguage } = useLanguage()

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-1 ${className}`.trim()}
      aria-label={t.navigation.language}
    >
      {options.map((option) => {
        const isActive = option.value === language

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            className={`rounded-[80px] px-3 py-2 font-poppins text-[13px] font-medium leading-[16px] transition-colors ${
              isActive ? 'bg-[#F29F04] text-[#0D0D0D]' : 'text-[#BDBDBD] hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
