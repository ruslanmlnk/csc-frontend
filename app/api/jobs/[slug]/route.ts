import { NextResponse } from 'next/server'
import { getJobBySlug } from '@/lib/backend/jobs'

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params
    const slug = params.slug

    if (!slug) {
      return NextResponse.json({ error: 'Job slug is required.' }, { status: 400 })
    }

    const job = await getJobBySlug(slug)

    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load job.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
