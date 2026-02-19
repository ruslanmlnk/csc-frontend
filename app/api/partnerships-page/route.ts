import { NextResponse } from 'next/server'
import { backendRequest } from '@/lib/backend/client'
import { getBackendErrorMessage } from '@/lib/backend/errors'

type UnknownRecord = Record<string, unknown>

type PartnershipsPageHeroV2 = {
  title: string
  description: string
}

const asRecord = (value: unknown): UnknownRecord | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as UnknownRecord
}

const asString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return null
}

export async function GET() {
  const { ok, status, data } = await backendRequest<Record<string, unknown>>(
    '/api/globals/partnerships-page?depth=0',
    {
      cache: 'no-store',
    },
  )

  if (!ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(data, 'Unable to load partnerships page data.') },
      { status },
    )
  }

  const payload = asRecord(data)
  const heroV2Record = asRecord(payload?.heroV2)

  const heroV2: PartnershipsPageHeroV2 | null = heroV2Record
    ? {
        title: asString(heroV2Record.title) || '',
        description: asString(heroV2Record.description) || '',
      }
    : null

  const hasValidHero = Boolean(heroV2?.title && heroV2.description)

  return NextResponse.json({
    heroV2: hasValidHero ? heroV2 : null,
  })
}
