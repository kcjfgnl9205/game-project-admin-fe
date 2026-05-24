import type { Room } from '@/entities/room/model'
import type { User } from '@/entities/user/model'
import type { Notice } from '@/entities/notice/model'

const rooms: Room[] = [
  { id: 'R-001', name: '로비 A', players: 8, status: 'open', createdAt: '2026-05-23' },
  { id: 'R-002', name: '스크린잉크 테스트', players: 5, status: 'open', createdAt: '2026-05-24' },
  { id: 'R-003', name: '챌린지 매치', players: 0, status: 'closed', createdAt: '2026-05-22' },
  { id: 'R-004', name: '커스텀 모드', players: 12, status: 'open', createdAt: '2026-05-24' },
]

const users: User[] = [
  { id: 'U-001', nickname: '김관리자', role: 'admin', status: 'active', lastSeen: '방금' },
  { id: 'U-002', nickname: '슬레이어', role: 'player', status: 'active', lastSeen: '2분 전' },
  { id: 'U-003', nickname: '치트킬', role: 'player', status: 'inactive', lastSeen: '1시간 전' },
  { id: 'U-004', nickname: '모더레이터', role: 'moderator', status: 'active', lastSeen: '5분 전' },
]

const notices: Notice[] = [
  {
    id: 'N-001',
    title: '서버 점검이 03:00에 예정되어 있습니다.',
    content: '서버 안정성 향상을 위한 정기 점검이 예정되어 있습니다.',
    published: true,
    createdAt: '2026-05-21',
  },
  {
    id: 'N-002',
    title: '새 게임 모드가 추가되었습니다.',
    content: '신규 미니게임이 곧 공개됩니다. 많은 관심 부탁드립니다.',
    published: false,
    createdAt: '2026-05-24',
  },
  {
    id: 'N-003',
    title: '비밀번호 정책이 강화되었습니다.',
    content: '보안 강화를 위해 비밀번호 정책이 변경되었습니다.',
    published: true,
    createdAt: '2026-05-19',
  },
]

export interface DashboardSnapshot {
  roomsCount: number
  activeUsers: number
  pendingNotices: number
  openRooms: number
  latestRooms: Room[]
  recentUsers: User[]
}

export const getDashboardSnapshot = (): DashboardSnapshot => ({
  roomsCount: rooms.length,
  activeUsers: users.filter((user) => user.status === 'active').length,
  pendingNotices: notices.filter((notice) => !notice.published).length,
  openRooms: rooms.filter((room) => room.status === 'open').length,
  latestRooms: rooms.slice(0, 3),
  recentUsers: users.slice(0, 3),
})
