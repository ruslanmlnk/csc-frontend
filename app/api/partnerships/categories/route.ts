import { NextResponse } from 'next/server'
import { getPartnershipCategories } from '@/lib/backend/partnerships'

export async function GET() {
  try {
    const categories = await getPartnershipCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load partnership categories.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
