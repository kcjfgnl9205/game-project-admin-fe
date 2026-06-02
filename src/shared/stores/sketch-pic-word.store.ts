import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchSketchPicWords,
  createSketchPicWord,
  createSketchPicWordsBulk,
  updateSketchPicWord,
  deleteSketchPicWord,
} from '@/entities/sketch-pic-word/api'
import type {
  SketchPicWord,
  SketchPicWordRequest,
  SketchPicWordBulkRequest,
  SketchPicWordBulkResponse,
} from '@/entities/sketch-pic-word/model'
import { messageFrom } from '@/shared/lib/error-message'
import { useToastStore } from './toast.store'

export const useSketchPicWordStore = defineStore('sketch-pic-word', () => {
  const toast = useToastStore()

  const words = ref<SketchPicWord[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const loading = ref(false)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const fetchList = async () => {
    loading.value = true
    try {
      const res = await fetchSketchPicWords({ page: page.value, limit: limit.value })
      words.value = res.items
      total.value = res.total
    } catch (e) {
      toast.show('error', messageFrom(e, '단어를 불러오지 못했어요.'))
    } finally {
      loading.value = false
    }
  }

  const setPage = (next: number) => {
    if (next < 1 || next > totalPages.value || next === page.value) return
    page.value = next
    return fetchList()
  }

  const create = async (input: SketchPicWordRequest) => {
    await createSketchPicWord(input)
    page.value = 1
    await fetchList()
  }

  const bulkCreate = async (
    input: SketchPicWordBulkRequest,
  ): Promise<SketchPicWordBulkResponse> => {
    const res = await createSketchPicWordsBulk(input)
    page.value = 1
    await fetchList()
    return res
  }

  const update = async (id: string, input: SketchPicWordRequest) => {
    await updateSketchPicWord(id, input)
    await fetchList()
  }

  const remove = async (id: string) => {
    await deleteSketchPicWord(id)
    if (words.value.length === 1 && page.value > 1) page.value -= 1
    await fetchList()
  }

  return {
    words,
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
