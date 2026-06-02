import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  login as apiLogin,
  refresh as apiRefresh,
  logout as apiLogout,
  fetchMe,
} from '@/entities/auth/api'
import type { LoginRequest, User } from '@/entities/auth/model'
import { messageFrom } from '@/shared/lib/error-message'
import { useToastStore } from './toast.store'

const ADMIN_ROLE = 'ADMIN'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToastStore()

  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => accessToken.value !== null)
  const isAdmin = computed(() => user.value?.role === ADMIN_ROLE)

  let refreshPromise: Promise<string | null> | null = null
  let initPromise: Promise<unknown> | null = null

  const init = () => {
    if (initPromise === null) initPromise = refresh()
    return initPromise
  }

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
    toast.show('error', '관리자 권한이 없습니다.')
  }

  const login = async (input: LoginRequest) => {
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
      toast.show('error', messageFrom(e, '로그인에 실패했습니다.'))
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
    isAuthenticated,
    isAdmin,
    init,
    login,
    refresh,
    logout,
  }
})
