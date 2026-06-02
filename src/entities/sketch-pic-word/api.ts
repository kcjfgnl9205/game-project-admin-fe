import { http } from '@/shared/api'
import type { PaginatedResponse, PaginationParams } from '@/shared/lib/pagination'
import type {
  SketchPicWord,
  SketchPicWordBulkRequest,
  SketchPicWordBulkResponse,
  SketchPicWordRequest,
} from './model'

const BASE = '/admin/sketch-pic/words'

export const fetchSketchPicWords = async (params: PaginationParams = {}) => {
  const { data } = await http.get<PaginatedResponse<SketchPicWord>>(BASE, { params })
  return data
}

export const createSketchPicWord = async (input: SketchPicWordRequest) => {
  const { data } = await http.post<SketchPicWord>(BASE, input)
  return data
}

export const createSketchPicWordsBulk = async (input: SketchPicWordBulkRequest) => {
  const { data } = await http.post<SketchPicWordBulkResponse>(`${BASE}/bulk`, input)
  return data
}

export const updateSketchPicWord = async (id: string, input: SketchPicWordRequest) => {
  const { data } = await http.patch<SketchPicWord>(`${BASE}/${id}`, input)
  return data
}

export const deleteSketchPicWord = async (id: string) => {
  await http.delete(`${BASE}/${id}`)
}
