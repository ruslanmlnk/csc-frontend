import { NextResponse } from 'next/server'
import { getArticles, getBlogPageData } from '@/lib/backend/blog'
import { getLanguageFromCookieString } from '@/lib/i18n'

export async function GET(request: Request) {
  try {
    const locale = getLanguageFromCookieString(request.headers.get('cookie'))
    const [articles, blogPageData] = await Promise.all([getArticles(), getBlogPageData(locale)])
    return NextResponse.json({
      articles,
      banner: blogPageData.banner || null,
      horizontalBanner: blogPageData.horizontalBanner || null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load blog articles.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
