export interface User extends UserSummary {
  role: 'ADMIN' | 'USER'
  provider: 'GOOGLE' | 'APPLE' | 'KAKAO' | 'LOCAL'
}

export interface UserSummary {
  id: string
  nickname: string
}
