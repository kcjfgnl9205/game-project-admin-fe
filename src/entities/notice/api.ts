import { http } from '@/shared/api'
import type { PaginatedResponse, PaginationParams } from '@/shared/lib/pagination'
import type { Notice, NoticeRequest, NoticeUpdateRequest } from './model'

export const fetchNotices = async (params: PaginationParams = {}) => {
  const { data } = await http.get<PaginatedResponse<Notice>>('/notices', { params })
  return data
}

export const fetchNotice = async (id: string) => {
  const { data } = await http.get<Notice>(`/notices/${id}`)
  return data
}

export const createNotice = async (input: NoticeRequest) => {
  const { data } = await http.post<Notice>('/admin/notices', input)
  return data
}

export const updateNotice = async (id: string, input: NoticeUpdateRequest) => {
  const { data } = await http.patch<Notice>(`/admin/notices/${id}`, input)
  return data
}

export const deleteNotice = async (id: string) => {
  await http.delete(`/admin/notices/${id}`)
}
