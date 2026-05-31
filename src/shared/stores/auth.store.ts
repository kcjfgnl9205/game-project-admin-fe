import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  login as apiLogin,
  refresh as apiRefresh,
  logout as apiLogout,
  fetchMe,
} from '@/entities/auth/api'
import type { LoginRequest, User } from '@/entities/auth/model'
import { ApiError } from '@/shared/api'

const ADMIN_ROLE = 'ADMIN'

const messageFrom = (e: unknown, fallback: string) => {
  if (e instanceof ApiError) {
    const body = e.body as { message?: string } | undefined
    return body?.message ?? e.statusText ?? fallback
  }
  if (e instanceof Error) return e.message
  return fallback
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => accessToken.value !== null)
  const isAdmin = computed(() => user.value?.role === ADMIN_ROLE)

  let refreshPromise: Promise<string | null> | null = null

  const clearSession = () => {
    accessToken.value = null
    user.value = null
  }

  const loadMe = async () => {
    user.value = await fetchMe()
  }

  const rejectNonAdmin = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore — best-effort invalidation of refresh cookie
    }
    clearSession()
    error.value = '관리자 권한이 없습니다.'
  }

  const login = async (input: LoginRequest) => {
    error.value = null
    try {
      const { accessToken: token } = await apiLogin(input)
      accessToken.value = token
      await loadMe()
      if (!isAdmin.value) {
        await rejectNonAdmin()
        return false
      }
      return true
    } catch (e) {
      error.value = messageFrom(e, '로그인에 실패했습니다.')
      clearSession()
      return false
    }
  }

  const refresh = async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const { accessToken: token } = await apiRefresh()
        accessToken.value = token
        try {
          await loadMe()
        } catch {
          clearSession()
          return null
        }
        if (!isAdmin.value) {
          clearSession()
          return null
        }
        return token
      } catch {
        clearSession()
        return null
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore — clear session regardless
    }
    clearSession()
  }

  return {
    accessToken,
    user,
    error,
    isAuthenticated,
    isAdmin,
    login,
    refresh,
    logout,
  }
})
