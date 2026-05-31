export interface User {
  id: string
  email?: string
  nickname: string
  role?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}
