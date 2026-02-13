import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { createUser, loginUser } from '@/lib/backend/users'
import { isValidUsername } from '@/lib/validators'

type TelegramPayload = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60

const buildDataCheckString = (payload: Record<string, string>) =>
  Object.keys(payload)
    .sort()
    .map((key) => `${key}=${payload[key]}`)
    .join('\n')

const verifyTelegramPayload = (payload: TelegramPayload, botToken: string) => {
  const { hash, ...rest } = payload
  const data: Record<string, string> = {}

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    data[key] = String(value)
  })

  const authDate = Number(data.auth_date)
  if (!authDate || Number.isNaN(authDate)) {
    return { ok: false, error: 'Invalid auth timestamp.' }
  }

  const now = Math.floor(Date.now() / 1000)
  if (now - authDate > MAX_AUTH_AGE_SECONDS) {
    return { ok: false, error: 'Telegram login expired.' }
  }

  const secret = crypto.createHash('sha256').update(botToken).digest()
  const dataCheckString = buildDataCheckString(data)
  const computedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')

  if (computedHash !== hash) {
    return { ok: false, error: 'Telegram signature invalid.' }
  }

  return { ok: true }
}

const buildTelegramPassword = (telegramId: string, secret: string) =>
  `${crypto.createHmac('sha256', secret).update(telegramId).digest('hex')}Tg!`

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as TelegramPayload | null

  if (!payload) {
    return NextResponse.json({ error: 'Invalid Telegram payload.' }, { status: 400 })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    return NextResponse.json({ error: 'Telegram integration not configured.' }, { status: 503 })
  }

  const verification = verifyTelegramPayload(payload, botToken)
  if (!verification.ok) {
    return NextResponse.json({ error: verification.error }, { status: 401 })
  }

  const telegramId = String(payload.id)
  const passwordSecret = process.env.TELEGRAM_PASSWORD_SECRET || botToken
  const password = buildTelegramPassword(telegramId, passwordSecret)
  const email = `tg_${telegramId}@telegram.local`
  const username = payload.username && isValidUsername(payload.username) ? payload.username : `tg${telegramId}`

  let loginResult = await loginUser({ email, password })

  if (!loginResult.ok) {
    const createResult = await createUser({
      email,
      password,
      username,
      authProvider: 'telegram',
      telegramId,
      telegramUsername: payload.username,
      telegramFirstName: payload.first_name,
      telegramLastName: payload.last_name,
      telegramPhotoUrl: payload.photo_url,
    })

    if (!createResult.ok) {
      return NextResponse.json(
        {
          error: getBackendErrorMessage(createResult.data, 'Unable to create Telegram account.'),
        },
        { status: createResult.status },
      )
    }

    loginResult = await loginUser({ email, password })

    if (!loginResult.ok) {
      return NextResponse.json(
        { error: getBackendErrorMessage(loginResult.data, 'Telegram login failed.') },
        { status: loginResult.status },
      )
    }
  }

  const res = NextResponse.json({ user: loginResult.data?.user ?? null })
  if (loginResult.data?.token) {
    setAuthCookie(res, loginResult.data.token)
  }
  return res
}
