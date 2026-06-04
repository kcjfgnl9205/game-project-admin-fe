<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { ConfirmDialog } from '@/shared/ui-modal'
import { useModalStore, useWhoDrewWordPairStore } from '@/shared/stores'
import { useToast } from '@/shared/composables'
import type { WhoDrewWordPair, WhoDrewWordPairRequest } from '@/entities/who-drew-word-pair/model'
import { formatDateYYYYMMDD } from '@/shared/lib/date'
import WordPairFormModal from './WordPairFormModal.vue'
import WordPairBulkModal from './WordPairBulkModal.vue'

const store = useWhoDrewWordPairStore()
const modal = useModalStore()
const toast = useToast()

onMounted(() => store.fetchList())

const onCreate = async () => {
  const result = await modal.open<WhoDrewWordPairRequest | null>(WordPairFormModal, {})
  if (!result) return
  try {
    await store.create(result)
    toast.success('단어쌍이 등록되었어요.')
  } catch (e) {
    toast.error(e, '단어쌍 등록에 실패했어요.')
  }
}

const onBulkCreate = async () => {
  const result = await modal.open<WhoDrewWordPairRequest[] | null>(WordPairBulkModal, {})
  if (!result || result.length === 0) return
  try {
    const res = await store.bulkCreate({ pairs: result })
    toast.success(`추가 ${res.inserted}개, 건너뜀 ${res.skipped}개`)
  } catch (e) {
    toast.error(e, '일괄 등록에 실패했어요.')
  }
}

const onEdit = async (pair: WhoDrewWordPair) => {
  const result = await modal.open<WhoDrewWordPairRequest | null>(WordPairFormModal, { pair })
  if (!result) return
  try {
    await store.update(pair.id, result)
    toast.success('수정되었어요.')
  } catch (e) {
    toast.error(e, '단어쌍 수정에 실패했어요.')
  }
}

const onDelete = async (pair: WhoDrewWordPair) => {
  const ok = await modal.open<boolean>(ConfirmDialog, {
    title: '단어쌍 삭제',
    message: `"${pair.civilianWord} / ${pair.mafiaWord}" 단어쌍을 삭제하시겠어요?`,
    confirmText: '삭제',
  })
  if (!ok) return
  try {
    await store.remove(pair.id)
    toast.success('삭제되었어요.')
  } catch (e) {
    toast.error(e, '단어쌍 삭제에 실패했어요.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-text-primary">누가그렸지 단어쌍 관리</h2>
        <p class="mt-1 text-sm text-text-secondary">
          일반인 단어 / 마피아 단어 쌍을 관리하세요. (마피아는 헷갈리는 관련 단어를 받습니다)
        </p>
      </div>
      <div class="flex gap-2">
        <BaseButton variant="secondary" @click="onBulkCreate">일괄 등록</BaseButton>
        <BaseButton variant="primary" @click="onCreate">+ 단어쌍 등록</BaseButton>
      </div>
    </div>

    <div class="overflow-hidden rounded-3xl border border-border bg-bg-card">
      <div v-if="store.loading" class="p-12 text-center text-sm text-text-secondary">
        불러오는 중…
      </div>
      <div
        v-else-if="store.pairs.length === 0"
        class="p-12 text-center text-sm text-text-secondary"
      >
        등록된 단어쌍이 없습니다.
      </div>
      <ul v-else class="divide-y divide-border">
        <li
          v-for="pair in store.pairs"
          :key="pair.id"
          class="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-bg-card-hover"
        >
          <div class="min-w-0 flex-1">
            <p class="flex items-center gap-2 truncate text-base font-semibold text-text-primary">
              <span>{{ pair.civilianWord }}</span>
              <span class="text-text-muted">/</span>
              <span class="text-brand">{{ pair.mafiaWord }}</span>
            </p>
            <p class="mt-1 text-xs text-text-muted">
              등록 {{ formatDateYYYYMMDD(pair.createdAt) }} · 수정
              {{ formatDateYYYYMMDD(pair.updatedAt) }}
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <BaseButton variant="secondary" size="sm" @click="onEdit(pair)">수정</BaseButton>
            <BaseButton variant="ghost" size="sm" @click="onDelete(pair)">삭제</BaseButton>
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
