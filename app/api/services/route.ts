import { NextResponse } from 'next/server'
import { getServices } from '@/lib/backend/services'

export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json({ services })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load services.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
