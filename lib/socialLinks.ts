const TELEGRAM_HOSTS = new Set(['t.me', 'telegram.me', 'telegram.dog'])

const sanitizeTelegramHandle = (value?: string | null): string | null => {
  if (!value) return null

  const cleaned = value.trim().replace(/^@+/, '').replace(/^\/+/, '').split(/[/?#]/)[0]
  if (!cleaned) return null

  return /^[A-Za-z0-9_]+$/.test(cleaned) ? cleaned : null
}

const extractTelegramHandleFromUrl = (value: string): string | null => {
  const withProtocol = /^(https?:\/\/|tg:\/\/)/i.test(value) ? value : `https://${value}`

  try {
    const parsed = new URL(withProtocol)

    if (parsed.protocol === 'tg:') {
      return sanitizeTelegramHandle(parsed.searchParams.get('domain'))
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')
    if (!TELEGRAM_HOSTS.has(hostname)) {
      return null
    }

    const [firstPathSegment] = parsed.pathname.split('/').filter(Boolean)
    return sanitizeTelegramHandle(firstPathSegment)
  } catch {
    return null
  }
}

export const normalizeTelegramHandle = (value?: string | null): string | null => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const parsedHandle = extractTelegramHandleFromUrl(trimmed)
  if (parsedHandle) {
    return parsedHandle
  }

  const withoutTelegramDomain = trimmed.replace(
    /^(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me|telegram\.dog)\//i,
    '',
  )

  return sanitizeTelegramHandle(withoutTelegramDomain)
}

export const toTelegramHref = (value?: string | null): string | null => {
  const handle = normalizeTelegramHandle(value)
  return handle ? `https://t.me/${handle}` : null
}
