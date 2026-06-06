import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchInquiries, updateInquiry, deleteInquiry } from '@/entities/inquiry/api'
import type { Inquiry, InquiryStatus } from '@/entities/inquiry/model'
import { messageFrom } from '@/shared/lib/error-message'
import { useToastStore } from './toast.store'

export const useInquiryStore = defineStore('inquiry', () => {
  const toast = useToastStore()

  const inquiries = ref<Inquiry[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const loading = ref(false)
  const statusFilter = ref<'' | InquiryStatus>('')
  const categoryFilter = ref('')

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

  const fetchList = async () => {
    loading.value = true
    try {
      const res = await fetchInquiries({
        page: page.value,
        limit: limit.value,
        status: statusFilter.value || undefined,
        categoryId: categoryFilter.value || undefined,
      })
      inquiries.value = res.items
      total.value = res.total
    } catch (e) {
      toast.show('error', messageFrom(e, '문의 목록을 불러오지 못했어요.'))
    } finally {
      loading.value = false
    }
  }

  const setPage = (next: number) => {
    if (next < 1 || next > totalPages.value || next === page.value) return
    page.value = next
    return fetchList()
  }

  const setStatusFilter = (value: '' | InquiryStatus) => {
    statusFilter.value = value
    page.value = 1
    return fetchList()
  }

  const setCategoryFilter = (value: string) => {
    categoryFilter.value = value
    page.value = 1
    return fetchList()
  }

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await updateInquiry(id, { status })
    await fetchList()
  }

  const remove = async (id: string) => {
    await deleteInquiry(id)
    if (inquiries.value.length === 1 && page.value > 1) page.value -= 1
    await fetchList()
  }

  return {
    inquiries,
    total,
    page,
    limit,
    loading,
    statusFilter,
    categoryFilter,
    totalPages,
    fetchList,
    setPage,
    setStatusFilter,
    setCategoryFilter,
    updateStatus,
    remove,
  }
})
