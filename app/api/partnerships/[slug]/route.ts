import { NextResponse } from 'next/server'
import { getPartnershipBySlug } from '@/lib/backend/partnerships'

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ error: 'Partnership slug is required.' }, { status: 400 })
    }

    const partnership = await getPartnershipBySlug(slug)

    if (!partnership) {
      return NextResponse.json({ error: 'Partnership not found.' }, { status: 404 })
    }

    return NextResponse.json({ partnership })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load partnership.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
