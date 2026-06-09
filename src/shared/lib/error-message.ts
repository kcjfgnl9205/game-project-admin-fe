import { ApiError } from '@/shared/api'

export const messageFrom = (e: unknown, fallback: string): string => {
  if (e instanceof ApiError) {
    const body = e.body as { message?: string | string[] } | undefined
    const msg = body?.message
    if (Array.isArray(msg)) return msg.join(', ')
    return msg ?? e.statusText ?? fallback
  }
  if (e instanceof Error) return e.message
  return fallback
}
