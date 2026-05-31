import { http } from '@/shared/api'
import type {
  Notice,
  NoticeListParams,
  NoticeListResponse,
  NoticeRequest,
  NoticeUpdateRequest,
} from './model'

export const fetchNotices = async (params: NoticeListParams = {}) => {
  const { data } = await http.get<NoticeListResponse>('/notices', { params })
  return data
}

export const fetchNotice = async (id: string) => {
  const { data } = await http.get<Notice>(`/notices/${id}`)
  return data
}

export const createNotice = async (input: NoticeRequest) => {
  const { data } = await http.post<Notice>('/notices', input)
  return data
}

export const updateNotice = async (id: string, input: NoticeUpdateRequest) => {
  const { data } = await http.patch<Notice>(`/notices/${id}`, input)
  return data
}

export const deleteNotice = async (id: string) => {
  await http.delete(`/notices/${id}`)
}
