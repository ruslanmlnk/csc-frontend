import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { uploadMediaFile } from '@/lib/backend/media'

type UploadPayload = {
  id?: string | number
  doc?: {
    id?: string | number
    url?: string | null
    altText?: string | null
    width?: number | null
    height?: number | null
  } | null
  url?: string | null
  altText?: string | null
  width?: number | null
  height?: number | null
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('csc_auth')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const altTextRaw = formData.get('altText')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const altText = typeof altTextRaw === 'string' && altTextRaw.trim()
    ? altTextRaw.trim()
    : file.name

  const uploadResult = await uploadMediaFile(file, token, altText)
  if (!uploadResult.ok) {
    return NextResponse.json(
      { error: getBackendErrorMessage(uploadResult.data, 'Failed to upload image.') },
      { status: uploadResult.status },
    )
  }

  const payload = uploadResult.data as UploadPayload | null
  const doc = payload?.doc || payload
  const id = doc?.id ?? payload?.id ?? null
  const url = doc?.url ?? payload?.url ?? null

  if (!url) {
    return NextResponse.json({ error: 'Upload succeeded, but no file URL was returned.' }, { status: 500 })
  }

  return NextResponse.json({
    id,
    url,
    altText: doc?.altText ?? payload?.altText ?? altText,
    width: doc?.width ?? payload?.width ?? undefined,
    height: doc?.height ?? payload?.height ?? undefined,
  })
}
