export interface User {
  id: string
  nickname: string
  role: 'admin' | 'moderator' | 'player'
  status: 'active' | 'inactive'
  lastSeen: string
}
