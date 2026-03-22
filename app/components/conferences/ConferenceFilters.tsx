'use client'

import React from 'react'
import ConferenceFilterSelect from './ConferenceFilterSelect'
import { useLanguage } from '@/app/components/i18n/LanguageProvider'

interface ConferenceFiltersProps {
  dateValue: string
  locationValue: string
  verticalValue: string
  dateOptions: string[]
  locationOptions: string[]
  verticalOptions: string[]
  onDateChange: (value: string) => void
  onLocationChange: (value: string) => void
  onVerticalChange: (value: string) => void
}

const ConferenceFilters: React.FC<ConferenceFiltersProps> = ({
  dateValue,
  locationValue,
  verticalValue,
  dateOptions,
  locationOptions,
  verticalOptions,
  onDateChange,
  onLocationChange,
  onVerticalChange,
}) => {
  const { messages: t } = useLanguage()

  return (
    <div className="w-full">
      <div className="inline-flex max-w-full flex-wrap items-start gap-4 rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-[7.2px] pr-[15.2px]">
        <ConferenceFilterSelect
          placeholder={t.conferences.datePlaceholder}
          value={dateValue}
          options={dateOptions}
          onChange={onDateChange}
        />
        <ConferenceFilterSelect
          placeholder={t.conferences.locationPlaceholder}
          value={locationValue}
          options={locationOptions}
          onChange={onLocationChange}
        />
        <ConferenceFilterSelect
          placeholder={t.conferences.verticalPlaceholder}
          value={verticalValue}
          options={verticalOptions}
          onChange={onVerticalChange}
        />
      </div>
    </div>
  )
}

export default ConferenceFilters
