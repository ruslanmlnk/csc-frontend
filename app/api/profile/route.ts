import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/backend/users'
import { updateProfile } from '@/lib/backend/profile'

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get current user to get ID
        const meResponse = await getCurrentUser(token)
        if (!meResponse.ok || !meResponse.data) {
            return NextResponse.json({ error: 'Failed to fetch user' }, { status: meResponse.status })
        }

        // meResponse.data might be the user directly or { user: ... }
        // Based on normalizeMeUser logic in users.ts
        const user = 'user' in meResponse.data ? meResponse.data.user : meResponse.data
        if (!user || !user.id) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
        }

        const body = await request.json()

        const updateResponse = await updateProfile(user.id, body, token)

        if (!updateResponse.ok) {
            return NextResponse.json(updateResponse.data || { error: 'Update failed' }, { status: updateResponse.status })
        }

        return NextResponse.json(updateResponse.data)
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
