import { NextResponse } from 'next/server'

const DEFAULT_BACKEND_URL = 'http://localhost:3000'

export const getBackendUrl = () => {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL
  return raw.replace(/\/$/, '')
}

export const setAuthCookie = (res: NextResponse, token: string) => {
  res.cookies.set({
    name: 'csc_auth',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export const clearAuthCookie = (res: NextResponse) => {
  res.cookies.set({
    name: 'csc_auth',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
