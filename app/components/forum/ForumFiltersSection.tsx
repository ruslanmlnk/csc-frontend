import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type ForumTagSuggestion = {
  label: string
  count: number
}

const normalizeTagValue = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

interface ForumFiltersSectionProps {
  searchPlaceholder: string
  searchButtonLabel: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  tagLabel: string
  tagPlaceholder: string
  tagInputValue: string
  selectedTags: string[]
  tagSuggestions: ForumTagSuggestion[]
  onTagInputChange: (value: string) => void
  onTagAdd: (value: string) => void
  onTagRemove: (value: string) => void
  bannerImage: string
  bannerAlt?: string
  bannerHref?: string
}

const ForumFiltersSection: React.FC<ForumFiltersSectionProps> = ({
  searchPlaceholder,
  searchButtonLabel,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  tagLabel,
  tagPlaceholder,
  tagInputValue,
  selectedTags,
  tagSuggestions,
  onTagInputChange,
  onTagAdd,
  onTagRemove,
  bannerImage,
  bannerAlt = 'Community Banner',
  bannerHref,
}) => {
  const [isTagFieldFocused, setIsTagFieldFocused] = useState(false)
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(0)
  const tagFieldRef = useRef<HTMLDivElement | null>(null)
  const normalizedHref = bannerHref?.trim()
  const isExternalLink = Boolean(normalizedHref && /^https?:\/\//i.test(normalizedHref))
  const bannerClassName = 'hidden lg:block relative w-full h-[158px] rounded-[40px] overflow-hidden'
  const bannerImageContent = (
    <Image
      src={bannerImage}
      alt={bannerAlt}
      fill
      className="object-cover"
    />
  )

  useEffect(() => {
    if (!isTagFieldFocused) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target && tagFieldRef.current?.contains(target)) {
        return
      }

      setIsTagFieldFocused(false)
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isTagFieldFocused])

  const activeSuggestionIndex =
    tagSuggestions.length === 0
      ? 0
      : Math.min(highlightedSuggestionIndex, tagSuggestions.length - 1)

  const commitTagSelection = (preferredIndex?: number) => {
    const trimmedValue = tagInputValue.trim()

    if (!trimmedValue && tagSuggestions.length === 0) {
      return
    }

    const normalizedValue = normalizeTagValue(trimmedValue)
    const activeSuggestion =
      typeof preferredIndex === 'number' && tagSuggestions[preferredIndex]
        ? tagSuggestions[preferredIndex]
        : tagSuggestions[activeSuggestionIndex] || tagSuggestions[0]
    const exactSuggestion = trimmedValue
      ? tagSuggestions.find((tag) => normalizeTagValue(tag.label) === normalizedValue)
      : null

    if (exactSuggestion) {
      onTagAdd(exactSuggestion.label)
      return
    }

    if (activeSuggestion) {
      onTagAdd(activeSuggestion.label)
    }
  }

  const showTagSuggestions = isTagFieldFocused && tagSuggestions.length > 0

  return (
    <div className="w-full max-w-[1280px] px-5 flex flex-col items-center gap-[64px] mb-[64px]">
      {normalizedHref ? (
        <a
          href={normalizedHref}
          target={isExternalLink ? '_blank' : undefined}
          rel={isExternalLink ? 'noopener noreferrer' : undefined}
          aria-label={bannerAlt}
          className={bannerClassName}
        >
          {bannerImageContent}
        </a>
      ) : (
        <div className={bannerClassName}>
          {bannerImageContent}
        </div>
      )}

      <div className="w-full flex flex-col gap-[24px]">
        <div className="w-full flex flex-col gap-[10px] lg:grid lg:grid-cols-6 lg:gap-[10px]">
          <div className="h-[46px] lg:h-[58px] min-w-0 flex items-center gap-[16px] rounded-[80px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-[24px] lg:p-[8px] lg:pr-[16px] lg:col-span-4">
            <div className="w-full flex items-center gap-[10px] lg:rounded-[80px] lg:px-[16px] lg:py-[8px]">
              <svg className="w-[22px] h-[22px] lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5299 20.4693L16.8358 15.7762C18.1963 14.1428 18.8748 12.0478 18.73 9.92691C18.5852 7.80604 17.6283 5.82265 16.0584 4.38932C14.4885 2.95599 12.4264 2.18308 10.3012 2.23138C8.1759 2.27968 6.15108 3.14547 4.64791 4.64864C3.14474 6.15181 2.27895 8.17663 2.23065 10.3019C2.18235 12.4271 2.95526 14.4892 4.38859 16.0591C5.82191 17.629 7.80531 18.5859 9.92618 18.7307C12.047 18.8755 14.1421 18.1971 15.7755 16.8365L20.4686 21.5306C20.5383 21.6003 20.621 21.6556 20.7121 21.6933C20.8031 21.731 20.9007 21.7504 20.9992 21.7504C21.0978 21.7504 21.1954 21.731 21.2864 21.6933C21.3775 21.6556 21.4602 21.6003 21.5299 21.5306C21.5995 21.4609 21.6548 21.3782 21.6925 21.2871C21.7302 21.1961 21.7497 21.0985 21.7497 21C21.7497 20.9014 21.7302 20.8038 21.6925 20.7128C21.6548 20.6218 21.5995 20.539 21.5299 20.4693ZM3.74924 10.5C3.74924 9.16495 4.14512 7.8599 4.88682 6.74987C5.62852 5.63984 6.68272 4.77467 7.91612 4.26378C9.14953 3.75289 10.5067 3.61922 11.8161 3.87967C13.1255 4.14012 14.3282 4.78299 15.2722 5.727C16.2162 6.671 16.8591 7.87374 17.1195 9.18311C17.38 10.4925 17.2463 11.8497 16.7354 13.0831C16.2245 14.3165 15.3594 15.3707 14.2493 16.1124C13.1393 16.8541 11.8343 17.25 10.4992 17.25C8.70964 17.248 6.9939 16.5362 5.72846 15.2708C4.46302 14.0053 3.75122 12.2896 3.74924 10.5Z" fill="#9E9E9E" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    onSearchSubmit()
                  }
                }}
                placeholder={searchPlaceholder}
                className="bg-transparent border-none outline-none text-white placeholder-white w-full font-poppins text-[16px] leading-[26px] font-normal lg:font-medium"
              />
            </div>
          </div>

          <div className="min-w-0 flex flex-col gap-[10px] lg:h-[58px] lg:col-span-2">
            <button
              type="button"
              onClick={onSearchSubmit}
              className="h-[50px] lg:h-full w-full inline-flex items-center justify-center gap-[12px] bg-[#F29F04] text-[#0D0D0D] rounded-[80px] px-[24px] font-medium text-[16px] leading-[26px] hover:brightness-110 transition-all"
            >
              {searchButtonLabel}
            </button>
          </div>
        </div>

        <div ref={tagFieldRef} className="relative w-full">
          <div className="mb-3 px-1 font-poppins text-[14px] font-normal leading-[20px] text-[#9E9E9E]">
            {tagLabel}
          </div>

          <div className="min-h-[58px] w-full rounded-[30px] border-[0.5px] border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] px-[20px] py-[14px]">
            <div className="flex flex-wrap items-center gap-2">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagRemove(tag)}
                  className="inline-flex h-[38px] items-center gap-2 rounded-[999px] bg-[#F29F04] px-4 text-[14px] font-medium leading-[20px] text-[#0D0D0D] transition-opacity hover:opacity-90"
                >
                  <span>{tag}</span>
                  <span className="text-[16px] leading-none">x</span>
                </button>
              ))}

              <input
                type="text"
                value={tagInputValue}
                onChange={(event) => onTagInputChange(event.target.value)}
                onFocus={() => {
                  setIsTagFieldFocused(true)
                  setHighlightedSuggestionIndex(0)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    if (tagSuggestions.length === 0) {
                      return
                    }

                    event.preventDefault()
                    setIsTagFieldFocused(true)
                    setHighlightedSuggestionIndex((current) =>
                      current + 1 < tagSuggestions.length ? current + 1 : 0,
                    )
                    return
                  }

                  if (event.key === 'ArrowUp') {
                    if (tagSuggestions.length === 0) {
                      return
                    }

                    event.preventDefault()
                    setIsTagFieldFocused(true)
                    setHighlightedSuggestionIndex((current) =>
                      current - 1 >= 0 ? current - 1 : tagSuggestions.length - 1,
                    )
                    return
                  }

                  if (event.key === 'Tab') {
                    if (tagSuggestions.length === 0) {
                      return
                    }

                    event.preventDefault()
                    commitTagSelection()
                    return
                  }

                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault()
                    commitTagSelection()
                    return
                  }

                  if (event.key === 'Escape') {
                    setIsTagFieldFocused(false)
                    return
                  }

                  if (event.key === 'Backspace' && !tagInputValue && selectedTags.length > 0) {
                    onTagRemove(selectedTags[selectedTags.length - 1])
                  }
                }}
                placeholder={tagPlaceholder}
                className="min-w-[180px] flex-1 bg-transparent border-none outline-none text-white placeholder-[#8D8D8D] font-poppins text-[16px] leading-[26px] font-normal"
              />
            </div>
          </div>

          {showTagSuggestions ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[24px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col py-2">
                {tagSuggestions.map((tag, index) => (
                  <button
                    key={tag.label}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedSuggestionIndex(index)}
                    onClick={() => onTagAdd(tag.label)}
                    className={`flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                      activeSuggestionIndex === index
                        ? 'bg-[#252525]'
                        : 'hover:bg-[#252525]'
                    }`}
                  >
                    <span className="font-poppins text-[15px] font-medium leading-[22px] text-white">
                      {tag.label}
                    </span>
                    <span className="shrink-0 font-poppins text-[13px] font-normal leading-[18px] text-[#8D8D8D]">
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ForumFiltersSection
