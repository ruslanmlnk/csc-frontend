import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { uploadProfilePhoto, deleteMedia } from '@/lib/backend/profile'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const alt = formData.get('altText') as string || 'Profile photo'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const uploadResponse = await uploadProfilePhoto(file, token, alt)

        return NextResponse.json(uploadResponse)
    } catch (error) {
        console.error('Avatar upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const success = await deleteMedia(id, token)
        return NextResponse.json({ success })
    } catch (error) {
        console.error('Avatar delete error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
