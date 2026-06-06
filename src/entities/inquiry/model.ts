export interface InquiryCategory {
  id: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface InquiryCategoryRequest {
  name: string
  sortOrder?: number
}

export type InquiryStatus = 'PENDING' | 'DONE'

export interface Inquiry {
  id: string
  email: string
  title: string
  content: string
  status: InquiryStatus
  categoryId: string
  category: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export interface InquiryUpdateRequest {
  status: InquiryStatus
}
