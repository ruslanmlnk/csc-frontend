import { NextResponse } from 'next/server'
import { getProfilePageGlobals } from '@/lib/backend/profilePageGlobals'
import { resolveLanguage } from '@/lib/i18n'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = resolveLanguage(searchParams.get('locale'))
    const globals = await getProfilePageGlobals(locale)

    return NextResponse.json(globals)
  } catch (error) {
    console.error('Profile page globals error:', error)
    return NextResponse.json({ banner: null, error: 'Internal Server Error' }, { status: 500 })
  }
}
