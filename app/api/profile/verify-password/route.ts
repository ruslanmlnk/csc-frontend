import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { loginUser, getCurrentUser } from '@/lib/backend/users'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get current user email
        const meResponse = await getCurrentUser(token)
        if (!meResponse.ok || !meResponse.data) {
            return NextResponse.json({ error: 'Failed to fetch user' }, { status: meResponse.status })
        }

        const user = 'user' in meResponse.data ? meResponse.data.user : meResponse.data
        const email = user?.email

        if (!email) {
            return NextResponse.json({ error: 'Email not found' }, { status: 400 })
        }

        const { password } = await request.json()

        // Try to login with current password to verify it
        const loginRes = await loginUser({ email, password })

        if (loginRes.ok) {
            return NextResponse.json({ valid: true })
        } else {
            return NextResponse.json({ valid: false, message: 'Invalid current password' }, { status: 401 })
        }
    } catch (error) {
        console.error('Password verification error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
