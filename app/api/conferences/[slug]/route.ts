import { NextResponse } from 'next/server'
import { getConferenceBySlug } from '@/lib/backend/conferences'

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ error: 'Conference slug is required.' }, { status: 400 })
    }

    const conference = await getConferenceBySlug(slug)

    if (!conference) {
      return NextResponse.json({ error: 'Conference not found.' }, { status: 404 })
    }

    return NextResponse.json({ conference })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load conference.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
