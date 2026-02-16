import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/backend/blog'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load categories.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
