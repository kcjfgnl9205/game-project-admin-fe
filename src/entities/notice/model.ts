export interface Notice {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
}

export interface NoticeRequest {
  title: string
  content: string
}
