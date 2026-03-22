export const formatConferenceDate = (
  value?: string | null,
  language: 'en' | 'uk' = 'en',
): string => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
