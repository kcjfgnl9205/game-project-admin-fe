import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchNotices,
  createNotice as apiCreate,
  updateNotice as apiUpdate,
  deleteNotice as apiDelete,
} from '@/entities/notice/api'
import type { Notice, NoticeRequest, NoticeUpdateRequest } from '@/entities/notice/model'
import { ApiError } from '@/shared/api'

const messageFrom = (e: unknown, fallback: string) => {
  if (e instanceof ApiError) {
    const body = e.body as { message?: string } | undefined
    return body?.message ?? e.statusText ?? fallback
  }
  if (e instanceof Error) return e.message
  return fallback
}

export const useNoticeStore = defineStore('notice', () => {
  const notices = ref<Notice[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const fetchList = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetchNotices({ page: page.value, limit: limit.value })
      notices.value = res.items
      total.value = res.total
    } catch (e) {
      error.value = messageFrom(e, '공지를 불러오지 못했어요.')
    } finally {
      loading.value = false
    }
  }

  const setPage = (next: number) => {
    if (next < 1 || next > totalPages.value || next === page.value) return
    page.value = next
    return fetchList()
  }

  const create = async (input: NoticeRequest) => {
    await apiCreate(input)
    page.value = 1
    await fetchList()
  }

  const update = async (id: string, input: NoticeUpdateRequest) => {
    await apiUpdate(id, input)
    await fetchList()
  }

  const remove = async (id: string) => {
    await apiDelete(id)
    if (notices.value.length === 1 && page.value > 1) page.value -= 1
    await fetchList()
  }

  return {
    notices,
    total,
    page,
    limit,
    loading,
    error,
    totalPages,
    fetchList,
    setPage,
    create,
    update,
    remove,
  }
})
