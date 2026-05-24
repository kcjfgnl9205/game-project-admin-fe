export interface Notice {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
}

export interface NoticeInput {
  title: string
  content: string
}
