import { NextResponse } from 'next/server'
import { getJobs } from '@/lib/backend/jobs'

export async function GET() {
  try {
    const jobs = await getJobs()
    return NextResponse.json({ jobs })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load jobs.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
