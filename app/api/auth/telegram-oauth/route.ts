import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth-server'
import { getBackendErrorMessage } from '@/lib/backend/errors'
import { createUser, loginUser } from '@/lib/backend/users'
import { isValidUsername } from '@/lib/validators'

type TelegramOAuthPayload = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60

/**
 * Verify Telegram OAuth data using official algorithm
 * https://core.telegram.org/widgets/login#checking-authorization
 */
const verifyTelegramOAuth = (payload: TelegramOAuthPayload, botToken: string): boolean => {
  const { hash, ...rest } = payload

  const dataCheckArr: string[] = []
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      dataCheckArr.push(`${key}=${String(value)}`)
    }
  })
  dataCheckArr.sort()
  const dataCheckString = dataCheckArr.join('\n')

  const secretKey = crypto.createHash('sha256').update(botToken).digest()
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  return computedHash === hash
}

const buildTelegramPassword = (telegramId: string, secret: string) =>
  `${crypto.createHmac('sha256', secret).update(telegramId).digest('hex')}TgOAuth!`

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as TelegramOAuthPayload | null

    if (!payload || !payload.id || !payload.hash || !payload.auth_date) {
      return NextResponse.json({ error: 'Invalid Telegram OAuth payload.' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: 'Telegram OAuth not configured.' }, { status: 503 })
    }

    const now = Math.floor(Date.now() / 1000)
    if (now - payload.auth_date > MAX_AUTH_AGE_SECONDS) {
      return NextResponse.json({ error: 'Telegram login expired.' }, { status: 401 })
    }

    if (!verifyTelegramOAuth(payload, botToken)) {
      return NextResponse.json({ error: 'Invalid Telegram signature.' }, { status: 401 })
    }

    const telegramId = String(payload.id)
    const passwordSecret = process.env.TELEGRAM_PASSWORD_SECRET || botToken
    const password = buildTelegramPassword(telegramId, passwordSecret)
    const email = `tg_oauth_${telegramId}@telegram.local`
    const username = payload.username && isValidUsername(payload.username) ? payload.username : `tg${telegramId}`

    let loginResult = await loginUser({ email, password })

    if (!loginResult.ok) {
      const createResult = await createUser({
        email,
        password,
        username,
        authProvider: 'telegram-oauth',
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
          {
            error: getBackendErrorMessage(loginResult.data, 'Telegram OAuth login failed.'),
          },
          { status: loginResult.status },
        )
      }
    }

    const res = NextResponse.json({ user: loginResult.data?.user ?? null })
    if (loginResult.data?.token) {
      setAuthCookie(res, loginResult.data.token)
    }
    return res
  } catch (error) {
    console.error('Telegram OAuth error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
