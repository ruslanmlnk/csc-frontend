const DEFAULT_SITE_URL = 'http://localhost:3001'

const withProtocol = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value}`
}

const normalize = (value: string) => withProtocol(value.trim()).replace(/\/+$/, '')

export const getSiteUrl = () => {
  const rawCandidates = [
    process.env.SITE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]

  for (const candidate of rawCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return normalize(candidate)
    }
  }

  return DEFAULT_SITE_URL
}

