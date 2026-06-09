import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchWhoDrewWordPairs,
  createWhoDrewWordPair,
  createWhoDrewWordPairsBulk,
  updateWhoDrewWordPair,
  deleteWhoDrewWordPair,
} from '@/entities/who-drew-word-pair/api'
import type {
  WhoDrewWordPair,
  WhoDrewWordPairRequest,
  WhoDrewWordPairBulkRequest,
  WhoDrewWordPairBulkResponse,
} from '@/entities/who-drew-word-pair/model'
import { messageFrom } from '@/shared/lib/error-message'
import { useToastStore } from './toast.store'

export const useWhoDrewWordPairStore = defineStore('who-drew-word-pair', () => {
  const toast = useToastStore()

  const pairs = ref<WhoDrewWordPair[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const loading = ref(false)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const fetchList = async () => {
    loading.value = true
    try {
      const res = await fetchWhoDrewWordPairs({ page: page.value, limit: limit.value })
      pairs.value = res.items
      total.value = res.total
    } catch (e) {
      toast.show('error', messageFrom(e, '단어쌍을 불러오지 못했어요.'))
    } finally {
      loading.value = false
    }
  }

  const setPage = (next: number) => {
    if (next < 1 || next > totalPages.value || next === page.value) return
    page.value = next
    return fetchList()
  }

  const create = async (input: WhoDrewWordPairRequest) => {
    await createWhoDrewWordPair(input)
    page.value = 1
    await fetchList()
  }

  const bulkCreate = async (
    input: WhoDrewWordPairBulkRequest,
  ): Promise<WhoDrewWordPairBulkResponse> => {
    const res = await createWhoDrewWordPairsBulk(input)
    page.value = 1
    await fetchList()
    return res
  }

  const update = async (id: string, input: WhoDrewWordPairRequest) => {
    await updateWhoDrewWordPair(id, input)
    await fetchList()
  }

  const remove = async (id: string) => {
    await deleteWhoDrewWordPair(id)
    if (pairs.value.length === 1 && page.value > 1) page.value -= 1
    await fetchList()
  }

  return {
    pairs,
    total,
    page,
    limit,
    loading,
    totalPages,
    fetchList,
    setPage,
    create,
    bulkCreate,
    update,
    remove,
  }
})
