import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { uploadProfilePhoto } from '@/lib/backend/profile'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const uploadResponse = await uploadProfilePhoto(file, token)

        return NextResponse.json(uploadResponse)
    } catch (error) {
        console.error('Avatar upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
