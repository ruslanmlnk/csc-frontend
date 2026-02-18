'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PartnershipProgramCard from '@/app/components/partnerships/PartnershipProgramCard'

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const PartnershipPrograms: React.FC = () => {
  const programs = [
    {
      title: 'CPAgetti',
      rating: '4.8',
      foundedYear: '2014',
      geo: 'Worldwide',
      logo: '/images/cpagetti-logo.png',
      models: ['CPA'],
      minPayment: '$100',
      offers: ['Betting', 'Nutra'],
    },
    {
      title: 'Ping.Partners',
      rating: '4.8',
      foundedYear: '2023',
      geo: 'Worldwide',
      logo: '/images/ping-partners-logo.png',
      models: ['CPA'],
      minPayment: '$20',
      offers: ['Gambling'],
    },
    {
      title: 'Magic Click',
      rating: '4.8',
      foundedYear: '2021',
      geo: 'Worldwide',
      logo: '/images/magic-click-logo.png',
      models: ['CPA', 'CPL', 'RevShare'],
      minPayment: '$10',
      offers: ['Betting', 'Gambling'],
    },
  ]

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center overflow-hidden px-5 py-[120px]">
      <div className="mb-16 flex w-full items-center justify-between">
        <h2 className="bg-[linear-gradient(180deg,#FFF_25.5%,#999_118.5%)] bg-clip-text font-poppins text-[56px] font-medium leading-[72px] tracking-[-2.24px] text-transparent">
          Partnerships Programs
        </h2>
        <Link
          href="/partnerships"
          className="flex items-center justify-center gap-4 rounded-[80px] border border-[#FCC660] px-6 py-3 font-poppins text-[16px] font-medium leading-[26px] text-[#FCC660] transition-all hover:bg-[#FCC660]/10 active:scale-95"
        >
          See More
        </Link>
      </div>

      <div className="mb-16 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {programs.map((program) => (
          <PartnershipProgramCard
            key={program.title}
            title={program.title}
            rating={program.rating}
            foundedYear={program.foundedYear}
            geo={program.geo}
            logo={(
              <div className="relative h-[56px] w-full max-w-[244px]">
                <Image src={program.logo} alt={program.title} fill sizes="244px" className="object-contain object-left" />
              </div>
            )}
            models={program.models}
            minPayment={program.minPayment}
            offers={program.offers}
            detailsHref={`/partnerships/${toSlug(program.title)}`}
          />
        ))}
      </div>

      <div className="mt-[55px] w-full max-w-[1240px]">
        <div className="relative aspect-[675/86] w-full overflow-hidden rounded-[40px]">
          <Image src="/images/partnership-banner.png" alt="Partnership Banner" fill sizes="1240px" className="object-cover" />
        </div>
      </div>
    </section>
  )
}

export default PartnershipPrograms
