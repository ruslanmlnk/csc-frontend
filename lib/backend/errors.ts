type BackendErrorPayload = {
  errors?: Array<{ message?: string }>
  message?: string
}

export const getBackendErrorMessage = (payload: unknown, fallback: string): string => {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const data = payload as BackendErrorPayload
  return data.errors?.[0]?.message || data.message || fallback
}
