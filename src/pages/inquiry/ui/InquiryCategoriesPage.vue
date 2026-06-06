<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { ConfirmDialog } from '@/shared/ui-modal'
import { useModalStore, useInquiryCategoryStore } from '@/shared/stores'
import { useToast } from '@/shared/composables'
import type { InquiryCategory, InquiryCategoryRequest } from '@/entities/inquiry/model'
import { formatDateYYYYMMDD } from '@/shared/lib/date'
import InquiryCategoryFormModal from './InquiryCategoryFormModal.vue'

const store = useInquiryCategoryStore()
const modal = useModalStore()
const toast = useToast()

onMounted(() => store.fetchList())

const onCreate = async () => {
  const result = await modal.open<InquiryCategoryRequest | null>(InquiryCategoryFormModal, {})
  if (!result) return
  try {
    await store.create(result)
    toast.success('카테고리가 등록되었어요.')
  } catch (e) {
    toast.error(e, '카테고리 등록에 실패했어요.')
  }
}

const onEdit = async (category: InquiryCategory) => {
  const result = await modal.open<InquiryCategoryRequest | null>(InquiryCategoryFormModal, {
    category,
  })
  if (!result) return
  try {
    await store.update(category.id, result)
    toast.success('수정되었어요.')
  } catch (e) {
    toast.error(e, '카테고리 수정에 실패했어요.')
  }
}

const onDelete = async (category: InquiryCategory) => {
  const ok = await modal.open<boolean>(ConfirmDialog, {
    title: '카테고리 삭제',
    message: `"${category.name}" 카테고리를 삭제하시겠어요?`,
    confirmText: '삭제',
  })
  if (!ok) return
  try {
    await store.remove(category.id)
    toast.success('삭제되었어요.')
  } catch (e) {
    toast.error(e, '카테고리 삭제에 실패했어요.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-text-primary">문의 카테고리 관리</h2>
        <p class="mt-1 text-sm text-text-secondary">문의 분류에 사용되는 카테고리를 관리하세요.</p>
      </div>
      <div class="flex gap-2">
        <BaseButton variant="primary" @click="onCreate">+ 카테고리 등록</BaseButton>
      </div>
    </div>

    <div class="overflow-hidden rounded-3xl border border-border bg-bg-card">
      <div v-if="store.loading" class="p-12 text-center text-sm text-text-secondary">
        불러오는 중…
      </div>
      <div
        v-else-if="store.categories.length === 0"
        class="p-12 text-center text-sm text-text-secondary"
      >
        등록된 카테고리가 없습니다.
      </div>
      <ul v-else class="divide-y divide-border">
        <li
          v-for="category in store.categories"
          :key="category.id"
          class="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-bg-card-hover"
        >
          <div class="min-w-0 flex-1">
            <p class="flex items-center gap-2 truncate text-base font-semibold text-text-primary">
              <span>{{ category.name }}</span>
              <span class="text-xs font-normal text-text-muted">정렬 {{ category.sortOrder }}</span>
            </p>
            <p class="mt-1 text-xs text-text-muted">
              등록 {{ formatDateYYYYMMDD(category.createdAt) }} · 수정
              {{ formatDateYYYYMMDD(category.updatedAt) }}
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <BaseButton variant="secondary" size="sm" @click="onEdit(category)">수정</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="onDelete(category)">삭제</BaseButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
