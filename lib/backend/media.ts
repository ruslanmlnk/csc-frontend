import { getBackendUrl } from '@/lib/auth-server'

type UploadMediaResponse = {
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
  errors?: unknown
  message?: string
}

export const uploadMediaFile = async (file: File, token: string, altText: string) => {
  const formData = new FormData()
  formData.append('altText', altText)
  formData.append('file', file, file.name)

  const response = await fetch(`${getBackendUrl()}/api/media`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: formData,
  })

  const data = (await response.json().catch(() => null)) as UploadMediaResponse | null

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}
