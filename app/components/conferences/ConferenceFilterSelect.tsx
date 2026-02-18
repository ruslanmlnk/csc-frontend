'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

interface ConferenceFilterSelectProps {
  placeholder: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const ConferenceFilterSelect: React.FC<ConferenceFilterSelectProps> = ({
  placeholder,
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
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

  const selectedLabel = useMemo(() => (value === '__all__' ? placeholder : value), [placeholder, value])
  const hasOptions = options.length > 0

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => hasOptions && setIsOpen((prev) => !prev)}
        className="flex items-center justify-center gap-[10px] rounded-[80px] px-4 py-2 text-[#FCFCFC]"
      >
        <span className={`font-poppins text-[16px] leading-[26px] ${value === '__all__' ? 'font-medium' : 'font-normal'}`}>
          {selectedLabel}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M10.96 2.88049C11.2172 2.62333 11.634 2.62333 11.8911 2.88049C12.1483 3.13765 12.1483 3.55446 11.8911 3.81161L6.08398 9.61875L0.276852 3.81161C0.0196944 3.55446 0.0196959 3.13765 0.276852 2.88049C0.53401 2.62333 0.950815 2.62334 1.20798 2.88049L6.08398 7.7565L10.96 2.88049Z" fill="white" />
        </svg>
      </button>

      {hasOptions && isOpen ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[210px] rounded-[20px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] p-2">
          <button
            type="button"
            onClick={() => {
              onChange('__all__')
              setIsOpen(false)
            }}
            className={`w-full rounded-[14px] px-4 py-2 text-left font-poppins text-[16px] leading-[26px] transition-colors ${
              value === '__all__'
                ? 'bg-[#F29F04] font-medium text-[#070707]'
                : 'font-normal text-[#FCFCFC] hover:bg-white/5'
            }`}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={`w-full rounded-[14px] px-4 py-2 text-left font-poppins text-[16px] leading-[26px] transition-colors ${
                value === option
                  ? 'bg-[#F29F04] font-medium text-[#070707]'
                  : 'font-normal text-[#FCFCFC] hover:bg-white/5'
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

export default ConferenceFilterSelect
