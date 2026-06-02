import type { UserSummary } from '@/entities/user/model'

export interface Notice {
  id: string
  title: string
  content: string
  authorId: string
  author: UserSummary
  createdAt: string
  updatedAt: string
}

export interface NoticeRequest {
  title: string
  content: string
}

export interface NoticeUpdateRequest {
  title?: string
  content?: string
}
