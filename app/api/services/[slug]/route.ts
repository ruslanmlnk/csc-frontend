import { NextResponse } from 'next/server'
import { getServiceBySlug } from '@/lib/backend/services'

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ error: 'Service slug is required.' }, { status: 400 })
    }

    const service = await getServiceBySlug(slug)

    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load service.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
