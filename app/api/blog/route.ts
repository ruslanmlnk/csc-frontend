import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/backend/blog'

export async function GET() {
  try {
    const articles = await getArticles()
    return NextResponse.json({ articles })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load blog articles.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

