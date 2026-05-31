import type { Room } from '@/entities/room/model'

interface DashboardUser {
  id: string
  nickname: string
  role: string
  status: 'active' | 'inactive'
  lastSeen: string
}

const rooms: Room[] = [
  { id: 'R-001', name: '로비 A', players: 8, status: 'open', createdAt: '2026-05-23' },
  { id: 'R-002', name: '스크린잉크 테스트', players: 5, status: 'open', createdAt: '2026-05-24' },
  { id: 'R-003', name: '챌린지 매치', players: 0, status: 'closed', createdAt: '2026-05-22' },
  { id: 'R-004', name: '커스텀 모드', players: 12, status: 'open', createdAt: '2026-05-24' },
]

const users: DashboardUser[] = [
  { id: 'U-001', nickname: '김관리자', role: 'admin', status: 'active', lastSeen: '방금' },
  { id: 'U-002', nickname: '슬레이어', role: 'player', status: 'active', lastSeen: '2분 전' },
  { id: 'U-003', nickname: '치트킬', role: 'player', status: 'inactive', lastSeen: '1시간 전' },
  { id: 'U-004', nickname: '모더레이터', role: 'moderator', status: 'active', lastSeen: '5분 전' },
]

export interface DashboardSnapshot {
  roomsCount: number
  activeUsers: number
  openRooms: number
  latestRooms: Room[]
  recentUsers: DashboardUser[]
}

export const getDashboardSnapshot = (): DashboardSnapshot => ({
  roomsCount: rooms.length,
  activeUsers: users.filter((user) => user.status === 'active').length,
  openRooms: rooms.filter((room) => room.status === 'open').length,
  latestRooms: rooms.slice(0, 3),
  recentUsers: users.slice(0, 3),
})
