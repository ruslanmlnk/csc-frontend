import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getBackendUrl, setAuthCookie } from '@/lib/auth-server'
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

  // Create data-check-string
  const dataCheckArr: string[] = []
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      dataCheckArr.push(`${key}=${String(value)}`)
    }
  })
  dataCheckArr.sort()
  const dataCheckString = dataCheckArr.join('\n')

  // Create secret key
  const secretKey = crypto.createHash('sha256').update(botToken).digest()

  // Create hash
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

    // Check auth date
    const now = Math.floor(Date.now() / 1000)
    if (now - payload.auth_date > MAX_AUTH_AGE_SECONDS) {
      return NextResponse.json({ error: 'Telegram login expired.' }, { status: 401 })
    }

    // Verify signature
    if (!verifyTelegramOAuth(payload, botToken)) {
      return NextResponse.json({ error: 'Invalid Telegram signature.' }, { status: 401 })
    }

    const telegramId = String(payload.id)
    const passwordSecret = process.env.TELEGRAM_PASSWORD_SECRET || botToken
    const password = buildTelegramPassword(telegramId, passwordSecret)
    const email = `tg_oauth_${telegramId}@telegram.local`
    const username =
      payload.username && isValidUsername(payload.username) ? payload.username : `tg${telegramId}`

    // Try to login
    const loginResponse = await fetch(`${getBackendUrl()}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    let loginData = await loginResponse.json().catch(() => null)

    // If login failed, create new user
    if (!loginResponse.ok) {
      const createResponse = await fetch(`${getBackendUrl()}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          authProvider: 'telegram-oauth',
          telegramId,
          telegramUsername: payload.username,
          telegramFirstName: payload.first_name,
          telegramLastName: payload.last_name,
          telegramPhotoUrl: payload.photo_url,
        }),
      })

      const createData = await createResponse.json().catch(() => null)

      if (!createResponse.ok) {
        return NextResponse.json(
          {
            error:
              createData?.errors?.[0]?.message ||
              createData?.message ||
              'Unable to create Telegram account.',
          },
          { status: createResponse.status }
        )
      }

      // Retry login after creating user
      const retryLogin = await fetch(`${getBackendUrl()}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      loginData = await retryLogin.json().catch(() => null)

      if (!retryLogin.ok) {
        return NextResponse.json(
          {
            error:
              loginData?.errors?.[0]?.message || loginData?.message || 'Telegram OAuth login failed.',
          },
          { status: retryLogin.status }
        )
      }
    }

    const res = NextResponse.json({ user: loginData?.user ?? null })
    if (loginData?.token) {
      setAuthCookie(res, loginData.token)
    }
    return res
  } catch (error) {
    console.error('Telegram OAuth error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
