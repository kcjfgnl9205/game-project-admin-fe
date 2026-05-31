import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    _retry?: boolean
  }
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean
    _retry?: boolean
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
    public original?: unknown,
  ) {
    super(`${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  withCredentials: true,
})

let getAccessToken: () => string | null = () => null
let onUnauthorized: () => Promise<string | null> = async () => null

export const configureAuth = (deps: {
  getAccessToken: () => string | null
  onUnauthorized: () => Promise<string | null>
}) => {
  getAccessToken = deps.getAccessToken
  onUnauthorized = deps.onUnauthorized
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = getAccessToken()
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig | undefined
    const status = error.response?.status

    if (status === 401 && original && !original._retry && !original.skipAuth) {
      original._retry = true
      const newToken = await onUnauthorized()
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`)
        return http.request(original)
      }
    }

    if (error.response) {
      const { status, statusText, data } = error.response
      const message = (data as { message?: string } | undefined)?.message
      throw new ApiError(status, message ?? statusText, data, error)
    }
    if (error.code === 'ECONNABORTED') {
      throw new ApiError(0, '요청 시간이 초과되었습니다.', undefined, error)
    }
    throw new ApiError(0, error.message || '네트워크 오류가 발생했습니다.', undefined, error)
  },
)
