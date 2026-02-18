import { NextResponse } from 'next/server'
import { getServiceCategories } from '@/lib/backend/services'

export async function GET() {
  try {
    const categories = await getServiceCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load service categories.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
