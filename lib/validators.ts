export const isValidEmail = (value: string) => {
  if (!value) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const isValidPassword = (value: string) => {
  if (!value) return false
  return value.length >= 8
}

export const isValidUsername = (value: string) => {
  if (!value) return false
  return /^[a-zA-Z0-9._-]{3,24}$/.test(value)
}
