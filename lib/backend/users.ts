import { backendRequest } from './client'

export interface BackendUser {
  id?: number | string
  email?: string
  role?: 'admin' | 'user' | string
  name?: string
  bio?: string
  company?: string
  position?: string
  directions?: string
  instagram?: string
  telegram?: string
  tiktok?: string
  website?: string
  avatar?: string | { url?: string; id?: string }
  [key: string]: unknown
}

export interface BackendErrorShape {
  errors?: Array<{ message?: string }>
  message?: string
}

export interface BackendLoginResponse extends BackendErrorShape {
  token?: string
  user?: BackendUser | null
}

export interface BackendCreateUserResponse extends BackendErrorShape {
  doc?: BackendUser | null
}

export type BackendMeResponse = BackendErrorShape & {
  user?: BackendUser | null
}

export type LoginInput = {
  email: string
  password: string
}

export type CreateUserInput = LoginInput & Record<string, unknown>

export const loginUser = (credentials: LoginInput) =>
  backendRequest<BackendLoginResponse>('/api/users/login', {
    method: 'POST',
    data: credentials,
  })

export const createUser = (payload: CreateUserInput) =>
  backendRequest<BackendCreateUserResponse>('/api/users', {
    method: 'POST',
    data: payload,
  })

export const getCurrentUser = (token: string) =>
  backendRequest<BackendMeResponse | BackendUser>('/api/users/me?depth=1', {
    token,
    cache: 'no-store',
  })

const isBackendUser = (value: unknown): value is BackendUser =>
  Boolean(value) && typeof value === 'object'

export const normalizeMeUser = (payload: BackendMeResponse | BackendUser | null): BackendUser | null => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if ('user' in payload) {
    const nestedUser = (payload as { user?: unknown }).user

    if (!nestedUser) {
      return null
    }

    return isBackendUser(nestedUser) ? nestedUser : null
  }

  return payload as BackendUser
}
