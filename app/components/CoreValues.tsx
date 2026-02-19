import React from 'react'
import Image from 'next/image'

type CoreValueCardInput = {
  id?: string | null
  title?: string | null
  description?: string | null
  icon?: {
    url?: string | null
  } | null
}

interface CoreValuesProps {
  data?: {
    badgeText?: string | null
    title?: string | null
    cards?: CoreValueCardInput[] | null
  } | null
  backendUrl?: string
}

type CoreValueCard = {
  id: string
  title: string
  description: string
  iconUrl?: string
}

const FALLBACK_CARDS: CoreValueCard[] = [
  {
    id: 'expertise',
    title: 'Expertise',
    description: 'Strategies created by specialists working with live traffic every day',
  },
  {
    id: 'data-first',
    title: 'Data-first approach',
    description: 'Tracking and metrics guide every step, from testing to scaling',
  },
  {
    id: 'speed-testing',
    title: 'Speed & testing',
    description: 'Rapid testing helps identify winners and cut losses early',
  },
  {
    id: 'scalability',
    title: 'Scalability',
    description: 'We build systems ready for safe and predictable scaling',
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description: 'Clear KPIs and full visibility across all performance metrics',
  },
  {
    id: 'long-term',
    title: 'Long-term mindset',
    description: 'Focused on sustainable growth, not short-term spikes',
  },
]

const toText = (value: string | null | undefined): string => value?.trim() || ''

const withBackendUrl = (url: string | undefined, backendUrl: string): string | undefined => {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`
}

const DEFAULT_ICON = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M20 4.16666L24.8438 13.9792L35.625 15.5417L27.8125 23.1458L29.6563 33.875L20 28.7917L10.3438 33.875L12.1875 23.1458L4.375 15.5417L15.1563 13.9792L20 4.16666Z"
      fill="white"
    />
  </svg>
)

const CoreValues: React.FC<CoreValuesProps> = ({ data, backendUrl = '' }) => {
  const badgeText = toText(data?.badgeText) || 'Core Values'
  const sectionTitle = toText(data?.title) || 'The Values that Drive Everything We Do'

  const cardsFromCms = (data?.cards || [])
    .map((card, index): CoreValueCard => {
      const title = toText(card?.title)
      const description = toText(card?.description)
      const iconPath = toText(card?.icon?.url) || undefined

      return {
        id: card?.id || `${title || 'core-value'}-${index}`,
        title,
        description,
        iconUrl: withBackendUrl(iconPath, backendUrl),
      }
    })
    .filter((card) => card.title.length > 0 || card.description.length > 0)

  const cards = cardsFromCms.length > 0 ? cardsFromCms : FALLBACK_CARDS
  const rows: CoreValueCard[][] = []

  for (let i = 0; i < cards.length; i += 3) {
    rows.push(cards.slice(i, i + 3))
  }

  return (
    <section className="flex flex-col items-start gap-[64px] self-stretch relative px-[20px] py-[80px] lg:py-0 max-w-[1280px] mx-auto">
      <div className="flex flex-col justify-center items-center gap-[24px] self-stretch relative">
        <div className="flex p-[4px] flex-col justify-center items-center gap-[10px] rounded-[40px] bg-[rgba(242,159,4,0.25)]">
          <div className="flex py-[6px] px-[16px] justify-center items-center gap-[10px] rounded-[24px] border border-[#F29F04]">
            <span className="text-center font-['Poppins'] text-[16px] font-normal leading-[26px] text-white">
              {badgeText}
            </span>
          </div>
        </div>

        <div className="w-full max-w-[870px] text-center">
          <span className="bg-gradient-to-b from-white via-white to-[#999] bg-clip-text font-['Poppins'] text-[40px] font-medium leading-[48px] tracking-[-0.8px] text-transparent lg:text-[56px] lg:leading-[72px] lg:tracking-[-2.24px]">
            {sectionTitle}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-[32px] self-stretch">
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-[32px] self-stretch"
          >
            {row.map((value) => (
              <div
                key={value.id}
                className="flex pt-[39.2px] pb-[39.2px] pl-[39.2px] pr-[31.2px] flex-col justify-center items-start gap-[32px] self-stretch lg:flex-1 rounded-[40px] border border-[rgba(74,74,74,0.70)] bg-[#1A1A1A]"
              >
                <div className="flex p-[16px] justify-end items-center gap-[32px] rounded-[10px] bg-[#F29F04]">
                  {value.iconUrl ? (
                    <Image
                      src={value.iconUrl}
                      alt={`${value.title || 'Core value'} icon`}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    DEFAULT_ICON
                  )}
                </div>
                <div className="flex flex-col justify-center items-start gap-[12px] self-stretch">
                  <div className="self-stretch text-white font-['Poppins'] text-[24px] font-semibold leading-[32px]">
                    {value.title || 'Core Value'}
                  </div>
                  <div className="self-stretch text-[#BDBDBD] font-['Poppins'] text-[16px] font-normal leading-[26px]">
                    {value.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default CoreValues
