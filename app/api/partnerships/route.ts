import { NextResponse } from 'next/server'
import { getPartnerships } from '@/lib/backend/partnerships'

export async function GET() {
  try {
    const partnerships = await getPartnerships()
    return NextResponse.json({ partnerships })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load partnerships.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
