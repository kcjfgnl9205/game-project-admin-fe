<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { ConfirmDialog } from '@/shared/ui-modal'
import { useModalStore, useInquiryStore, useInquiryCategoryStore } from '@/shared/stores'
import { useToast } from '@/shared/composables'
import type { Inquiry, InquiryStatus } from '@/entities/inquiry/model'
import { formatDateYYYYMMDD } from '@/shared/lib/date'
import InquiryDetailModal from './InquiryDetailModal.vue'

const store = useInquiryStore()
const categoryStore = useInquiryCategoryStore()
const modal = useModalStore()
const toast = useToast()

onMounted(() => {
  store.fetchList()
  categoryStore.fetchList()
})

const onStatusFilter = (event: Event) => {
  store.setStatusFilter((event.target as HTMLSelectElement).value as '' | InquiryStatus)
}

const onCategoryFilter = (event: Event) => {
  store.setCategoryFilter((event.target as HTMLSelectElement).value)
}

const statusLabel = (status: InquiryStatus) => (status === 'DONE' ? '처리완료' : '미처리')

const statusClass = (status: InquiryStatus) =>
  status === 'DONE'
    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
    : 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'

const onOpen = async (inquiry: Inquiry) => {
  await modal.open(InquiryDetailModal, { inquiry })
}

const onDelete = async (inquiry: Inquiry) => {
  const ok = await modal.open<boolean>(ConfirmDialog, {
    title: '문의 삭제',
    message: `"${inquiry.title}" 문의를 삭제하시겠어요?`,
    confirmText: '삭제',
  })
  if (!ok) return
  try {
    await store.remove(inquiry.id)
    toast.success('삭제되었어요.')
  } catch (e) {
    toast.error(e, '문의 삭제에 실패했어요.')
  }
}

const onPurge = async () => {
  const ok = await modal.open<boolean>(ConfirmDialog, {
    title: '이메일 보관기간 정리',
    message: '처리 완료 후 1년이 지난 문의의 이메일을 일괄 삭제(null)합니다. 계속할까요?',
    confirmText: '정리',
  })
  if (!ok) return
  try {
    const affected = await store.purgeEmails()
    toast.success(`${affected}건의 이메일을 정리했어요.`)
  } catch (e) {
    toast.error(e, '이메일 정리에 실패했어요.')
  }
}

const selectClass =
  'rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand'
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-text-primary">문의 목록</h2>
        <p class="mt-1 text-sm text-text-secondary">접수된 문의를 확인하고 상태를 관리하세요.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <BaseButton variant="secondary" @click="onPurge">이메일 보관기간 정리</BaseButton>
        <select :value="store.statusFilter" :class="selectClass" @change="onStatusFilter">
          <option value="">전체 상태</option>
          <option value="PENDING">미처리</option>
          <option value="DONE">처리완료</option>
        </select>
        <select :value="store.categoryFilter" :class="selectClass" @change="onCategoryFilter">
          <option value="">전체 카테고리</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="overflow-hidden rounded-3xl border border-border bg-bg-card">
      <div v-if="store.loading" class="p-12 text-center text-sm text-text-secondary">
        불러오는 중…
      </div>
      <div
        v-else-if="store.inquiries.length === 0"
        class="p-12 text-center text-sm text-text-secondary"
      >
        문의가 없습니다.
      </div>
      <ul v-else class="divide-y divide-border">
        <li
          v-for="inquiry in store.inquiries"
          :key="inquiry.id"
          class="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-bg-card-hover"
        >
          <button
            type="button"
            class="min-w-0 flex-1 text-left"
            @click="onOpen(inquiry)"
          >
            <p class="flex items-center gap-2 truncate text-base font-semibold text-text-primary">
              <span
                class="shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand"
              >
                {{ inquiry.category.name }}
              </span>
              <span class="truncate">{{ inquiry.title }}</span>
            </p>
            <p class="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <span
                class="rounded-full px-2 py-0.5 font-medium"
                :class="statusClass(inquiry.status)"
              >
                {{ statusLabel(inquiry.status) }}
              </span>
              <span class="truncate">{{ inquiry.email ?? '(보관기간 만료)' }}</span>
              <span>· {{ formatDateYYYYMMDD(inquiry.createdAt) }}</span>
            </p>
          </button>
          <div class="flex shrink-0 gap-2">
            <BaseButton variant="ghost" size="sm" @click="onDelete(inquiry)">삭제</BaseButton>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="store.total > 0"
      class="flex items-center justify-between text-sm text-text-secondary"
    >
      <span> 총 {{ store.total }}개 · {{ store.page }} / {{ store.totalPages }} 페이지 </span>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="store.page <= 1 || store.loading"
          @click="store.setPage(store.page - 1)"
        >
          이전
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="store.page >= store.totalPages || store.loading"
          @click="store.setPage(store.page + 1)"
        >
          다음
        </BaseButton>
      </div>
    </div>
  </div>
</template>
