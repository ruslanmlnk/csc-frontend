import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { incrementArticleViews } from '@/lib/backend/blog'

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

const UNIQUE_VIEW_TTL_SECONDS = 60 * 60 * 24
const VIEW_COOKIE_PREFIX = 'csc_article_view_'

const toCookieSafeSlug = (slug: string): string => {
  const normalized = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')

  return normalized.slice(0, 80) || 'article'
}

export async function POST(_request: Request, context: RouteContext) {
  const params = await context.params
  const slug = params.slug?.trim()

  if (!slug) {
    return NextResponse.json({ error: 'Article slug is required.' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const cookieName = `${VIEW_COOKIE_PREFIX}${toCookieSafeSlug(slug)}`
  const alreadyCounted = cookieStore.get(cookieName)?.value === '1'

  if (alreadyCounted) {
    return NextResponse.json({ skipped: true })
  }

  const views = await incrementArticleViews(slug)
  if (views === null) {
    return NextResponse.json({ error: 'Unable to update article views.' }, { status: 502 })
  }

  const response = NextResponse.json({ views, skipped: false })
  response.cookies.set({
    name: cookieName,
    value: '1',
    maxAge: UNIQUE_VIEW_TTL_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return response
}
