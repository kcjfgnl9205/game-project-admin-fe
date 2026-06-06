import { http } from '@/shared/api'
import type { PaginatedResponse, PaginationParams } from '@/shared/lib/pagination'
import type {
  Inquiry,
  InquiryCategory,
  InquiryCategoryRequest,
  InquiryStatus,
  InquiryUpdateRequest,
} from './model'

const CATEGORY_BASE = '/admin/inquiries/categories'
const INQUIRY_BASE = '/admin/inquiries'

export const fetchInquiryCategories = async () => {
  const { data } = await http.get<InquiryCategory[]>(CATEGORY_BASE)
  return data
}

export const createInquiryCategory = async (input: InquiryCategoryRequest) => {
  const { data } = await http.post<InquiryCategory>(CATEGORY_BASE, input)
  return data
}

export const updateInquiryCategory = async (id: string, input: InquiryCategoryRequest) => {
  const { data } = await http.patch<InquiryCategory>(`${CATEGORY_BASE}/${id}`, input)
  return data
}

export const deleteInquiryCategory = async (id: string) => {
  await http.delete(`${CATEGORY_BASE}/${id}`)
}

export interface InquiryListParams extends PaginationParams {
  status?: InquiryStatus
  categoryId?: string
}

export const fetchInquiries = async (params: InquiryListParams = {}) => {
  const { data } = await http.get<PaginatedResponse<Inquiry>>(INQUIRY_BASE, { params })
  return data
}

export const fetchInquiry = async (id: string) => {
  const { data } = await http.get<Inquiry>(`${INQUIRY_BASE}/${id}`)
  return data
}

export const updateInquiry = async (id: string, input: InquiryUpdateRequest) => {
  const { data } = await http.patch<Inquiry>(`${INQUIRY_BASE}/${id}`, input)
  return data
}

export const deleteInquiry = async (id: string) => {
  await http.delete(`${INQUIRY_BASE}/${id}`)
}
