import { http } from '@/shared/api'
import type { PaginatedResponse, PaginationParams } from '@/shared/lib/pagination'
import type {
  WhoDrewWordPair,
  WhoDrewWordPairBulkRequest,
  WhoDrewWordPairBulkResponse,
  WhoDrewWordPairRequest,
} from './model'

const BASE = '/admin/who-drew/words'

export const fetchWhoDrewWordPairs = async (params: PaginationParams = {}) => {
  const { data } = await http.get<PaginatedResponse<WhoDrewWordPair>>(BASE, { params })
  return data
}

export const createWhoDrewWordPair = async (input: WhoDrewWordPairRequest) => {
  const { data } = await http.post<WhoDrewWordPair>(BASE, input)
  return data
}

export const createWhoDrewWordPairsBulk = async (input: WhoDrewWordPairBulkRequest) => {
  const { data } = await http.post<WhoDrewWordPairBulkResponse>(`${BASE}/bulk`, input)
  return data
}

export const updateWhoDrewWordPair = async (id: string, input: WhoDrewWordPairRequest) => {
  const { data } = await http.patch<WhoDrewWordPair>(`${BASE}/${id}`, input)
  return data
}

export const deleteWhoDrewWordPair = async (id: string) => {
  await http.delete(`${BASE}/${id}`)
}
