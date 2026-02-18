'use client'

import React from 'react'
import ConferenceFilterSelect from './ConferenceFilterSelect'

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
  return (
    <div className="w-full">
      <div className="inline-flex max-w-full flex-wrap items-start gap-4 rounded-[80px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-2 pr-4">
        <ConferenceFilterSelect
          placeholder="Date"
          value={dateValue}
          options={dateOptions}
          onChange={onDateChange}
        />
        <ConferenceFilterSelect
          placeholder="Location"
          value={locationValue}
          options={locationOptions}
          onChange={onLocationChange}
        />
        <ConferenceFilterSelect
          placeholder="Vertical"
          value={verticalValue}
          options={verticalOptions}
          onChange={onVerticalChange}
        />
      </div>
    </div>
  )
}

export default ConferenceFilters
