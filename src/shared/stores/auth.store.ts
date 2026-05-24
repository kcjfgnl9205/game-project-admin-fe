import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'admin-auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const username = ref('')
  const error = ref<string | null>(null)

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed?.username) {
        username.value = parsed.username
        isAuthenticated.value = true
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  watch(
    [isAuthenticated, username],
    ([auth, user]) => {
      if (auth) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: user }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    { flush: 'sync' },
  )

  const login = async (nextUsername: string, password: string) => {
    const trimmed = nextUsername.trim()
    const isValid = trimmed.toLowerCase() === 'admin' && password === 'admin'

    if (!isValid) {
      error.value = '아이디 또는 비밀번호가 일치하지 않습니다.'
      return false
    }

    username.value = trimmed
    isAuthenticated.value = true
    error.value = null
    return true
  }

  const logout = () => {
    isAuthenticated.value = false
    username.value = ''
    error.value = null
  }

  return {
    isAuthenticated,
    username,
    error,
    login,
    logout,
  }
})
