import { http } from '@/shared/api'
import type { AuthResponse, LoginRequest, User } from './model'

export const login = async (input: LoginRequest) => {
  const { data } = await http.post<AuthResponse>('/auth/login', input, { skipAuth: true })
  return data
}

export const refresh = async () => {
  const { data } = await http.post<AuthResponse>('/auth/refresh', undefined, { skipAuth: true })
  return data
}

export const logout = async () => {
  await http.post('/auth/logout')
}

export const fetchMe = async () => {
  const { data } = await http.get<User>('/users/me')
  return data
}
