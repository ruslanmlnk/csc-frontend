import { NextResponse } from 'next/server'
import { getConferenceFilters } from '@/lib/backend/conferences'

export async function GET() {
  try {
    const filters = await getConferenceFilters()

    return NextResponse.json({
      locations: filters.locations.map((item) => item.name),
      verticals: filters.verticals.map((item) => item.name),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load conference filters.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
