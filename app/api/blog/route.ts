import { NextResponse } from 'next/server'
import { getArticles, getBlogPageData } from '@/lib/backend/blog'

export async function GET() {
  try {
    const [articles, blogPageData] = await Promise.all([getArticles(), getBlogPageData()])
    return NextResponse.json({ articles, banner: blogPageData.banner || null })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load blog articles.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
