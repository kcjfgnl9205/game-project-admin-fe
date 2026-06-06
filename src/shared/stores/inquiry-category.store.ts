import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchInquiryCategories,
  createInquiryCategory,
  updateInquiryCategory,
  deleteInquiryCategory,
} from '@/entities/inquiry/api'
import type { InquiryCategory, InquiryCategoryRequest } from '@/entities/inquiry/model'
import { messageFrom } from '@/shared/lib/error-message'
import { useToastStore } from './toast.store'

export const useInquiryCategoryStore = defineStore('inquiry-category', () => {
  const toast = useToastStore()

  const categories = ref<InquiryCategory[]>([])
  const loading = ref(false)

  const fetchList = async () => {
    loading.value = true
    try {
      categories.value = await fetchInquiryCategories()
    } catch (e) {
      toast.show('error', messageFrom(e, '카테고리를 불러오지 못했어요.'))
    } finally {
      loading.value = false
    }
  }

  const create = async (input: InquiryCategoryRequest) => {
    await createInquiryCategory(input)
    await fetchList()
  }

  const update = async (id: string, input: InquiryCategoryRequest) => {
    await updateInquiryCategory(id, input)
    await fetchList()
  }

  const remove = async (id: string) => {
    await deleteInquiryCategory(id)
    await fetchList()
  }

  return {
    categories,
    loading,
    fetchList,
    create,
    update,
    remove,
  }
})
