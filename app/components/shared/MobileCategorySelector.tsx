 'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

interface MobileCategorySelectorProps {
  label?: string
  value?: string
  options?: string[]
  onSelect?: (value: string) => void
  className?: string
}

const MobileCategorySelector: React.FC<MobileCategorySelectorProps> = ({
  label,
  value,
  options = [],
  onSelect,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? label ?? '')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const hasOptions = options.length > 0
  const selectedLabel = useMemo(() => value ?? internalValue ?? label ?? '', [internalValue, label, value])

  const handleSelect = (nextValue: string) => {
    if (onSelect) {
      onSelect(nextValue)
    } else {
      setInternalValue(nextValue)
    }
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <button
        type="button"
        onClick={() => hasOptions && setIsOpen((prev) => !prev)}
        className="h-[46px] w-full flex items-center justify-between rounded-[80px] border border-[#FCC660] px-[24px] text-[#FCC660] font-poppins text-[16px] font-normal leading-[26px]"
      >
        <span>{selectedLabel}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M12.6673 6L8.00065 10.6667L3.33398 6" stroke="#FCC660" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {hasOptions && isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full rounded-[16px] px-4 py-2 text-left font-poppins text-[16px] leading-[26px] transition-colors ${
                option === selectedLabel
                  ? 'bg-[#F29F04] text-[#070707] font-medium'
                  : 'text-[#FCFCFC] font-normal hover:bg-white/5'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MobileCategorySelector
