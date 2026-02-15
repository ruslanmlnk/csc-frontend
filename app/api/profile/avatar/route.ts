import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { uploadProfilePhoto, deleteMedia } from '@/lib/backend/profile'
import { getBackendErrorMessage } from '@/lib/backend/errors'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const alt = formData.get('altText') as string || 'Profile photo'

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 })
        }

        const uploadResult = await uploadProfilePhoto(file, token, alt)

        if (!uploadResult.ok) {
            return NextResponse.json(
                {
                    message: getBackendErrorMessage(uploadResult.data, 'Failed to upload profile photo.'),
                },
                { status: uploadResult.status },
            )
        }

        return NextResponse.json(uploadResult.data, { status: uploadResult.status })
    } catch (error) {
        console.error('Avatar upload error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('csc_auth')?.value
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 })

        const success = await deleteMedia(id, token)
        return NextResponse.json({ success })
    } catch (error) {
        console.error('Avatar delete error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
