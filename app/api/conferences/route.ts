import { NextResponse } from 'next/server'
import { getConferences } from '@/lib/backend/conferences'

export async function GET() {
  try {
    const conferences = await getConferences()
    return NextResponse.json({ conferences })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load conferences.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
