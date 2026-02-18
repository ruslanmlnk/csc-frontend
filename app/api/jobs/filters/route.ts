import { NextResponse } from 'next/server'
import { getJobFilters } from '@/lib/backend/jobs'

export async function GET() {
  try {
    const filters = await getJobFilters()
    const locations = Array.from(new Set(filters.locations.map((item) => item.name).filter(Boolean)))
    const experiences = Array.from(new Set(filters.experiences.map((item) => item.name).filter(Boolean)))
    const formats = Array.from(new Set(filters.formats.map((item) => item.name).filter(Boolean)))

    return NextResponse.json({
      locations,
      experiences,
      formats,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load job filters.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
