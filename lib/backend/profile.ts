import { backendRequest } from './client'
import { BackendUser, BackendErrorShape } from './users'
import { getBackendUrl } from '@/lib/auth-server'

export interface ProfileUpdateInput {
    name?: string
    bio?: string
    company?: string
    position?: string
    directions?: string
    instagram?: string
    telegram?: string
    tiktok?: string
    website?: string
    avatar?: string // ID of the media document
}

export interface ProfileUpdateResponse extends BackendErrorShape {
    doc?: BackendUser | null
}

export interface UploadProfilePhotoResponse extends BackendErrorShape {
    id?: string | number
}

export interface UploadProfilePhotoResult {
    ok: boolean
    status: number
    data: UploadProfilePhotoResponse | null
}

/**
 * Updates the current user's profile data
 * @param userId ID of the user to update
 * @param data Profile data to update
 * @param token Authentication token
 */
export const updateProfile = (userId: string | number, data: ProfileUpdateInput, token: string) =>
    backendRequest<ProfileUpdateResponse>(`/api/users/${userId}`, {
        method: 'PATCH',
        data,
        token,
    })


/**
 * Uploads a profile photo to the Media collection
 * @param file File object to upload
 * @param token Authentication token
 * @param alt Alt text for the image
 */
export const uploadProfilePhoto = async (file: File, token: string, alt: string = 'Profile photo') => {
    const formData = new FormData()
    formData.append('altText', alt)
    formData.append('file', file, file.name)

    const response = await fetch(`${getBackendUrl()}/api/media`, {
        method: 'POST',
        headers: {
            Authorization: `JWT ${token}`,
        },
        body: formData,
    })

    const data = (await response.json().catch(() => null)) as UploadProfilePhotoResponse | null

    return {
        ok: response.ok,
        status: response.status,
        data,
    } satisfies UploadProfilePhotoResult
}

/**
 * Deletes a media item by ID
 * @param mediaId ID of the media to delete
 * @param token Authentication token
 */
export const deleteMedia = async (mediaId: string | number, token: string) => {
    const response = await fetch(`${getBackendUrl()}/api/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `JWT ${token}`,
        },
    })

    return response.ok
}
