<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { ConfirmDialog } from '@/shared/ui-modal'
import { useModalStore, useNoticeStore } from '@/shared/stores'
import { useToast } from '@/shared/composables'
import type { Notice, NoticeRequest } from '@/entities/notice/model'
import { formatDateYYYYMMDD } from '@/shared/lib/date'
import NoticeFormModal from './NoticeFormModal.vue'

const noticeStore = useNoticeStore()
const modal = useModalStore()
const toast = useToast()

onMounted(() => noticeStore.fetchList())

const onCreate = async () => {
  const result = await modal.open<NoticeRequest | null>(NoticeFormModal, {})
  if (!result) return
  try {
    await noticeStore.create(result)
    toast.success('공지가 등록되었어요.')
  } catch (e) {
    toast.error(e, '공지 등록에 실패했어요.')
  }
}

const onEdit = async (notice: Notice) => {
  const result = await modal.open<NoticeRequest | null>(NoticeFormModal, { notice })
  if (!result) return
  try {
    await noticeStore.update(notice.id, result)
    toast.success('수정되었어요.')
  } catch (e) {
    toast.error(e, '공지 수정에 실패했어요.')
  }
}

const onDelete = async (notice: Notice) => {
  const ok = await modal.open<boolean>(ConfirmDialog, {
    title: '공지 삭제',
    message: `"${notice.title}" 공지를 정말 삭제하시겠어요?`,
    confirmText: '삭제',
  })
  if (!ok) return
  try {
    await noticeStore.remove(notice.id)
    toast.success('삭제되었어요.')
  } catch (e) {
    toast.error(e, '공지 삭제에 실패했어요.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-text-primary">공지사항 관리</h2>
        <p class="mt-1 text-sm text-text-secondary">공지 목록을 등록/수정/삭제하세요.</p>
      </div>
      <BaseButton variant="primary" @click="onCreate">+ 공지 등록</BaseButton>
    </div>

    <div class="overflow-hidden rounded-3xl border border-border bg-bg-card">
      <div v-if="noticeStore.loading" class="p-12 text-center text-sm text-text-secondary">
        불러오는 중…
      </div>
      <div
        v-else-if="noticeStore.notices.length === 0"
        class="p-12 text-center text-sm text-text-secondary"
      >
        등록된 공지가 없습니다.
      </div>
      <ul v-else class="divide-y divide-border">
        <li
          v-for="notice in noticeStore.notices"
          :key="notice.id"
          class="p-6 transition-colors hover:bg-bg-card-hover"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-semibold text-text-primary">{{ notice.title }}</h3>
              <p
                class="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary line-clamp-2"
              >
                {{ notice.content }}
              </p>
              <p class="mt-3 text-xs text-text-muted">
                {{ notice.author?.nickname ?? '관리자' }} ·
                {{ formatDateYYYYMMDD(notice.createdAt) }}
              </p>
            </div>
            <div class="flex shrink-0 gap-2">
              <BaseButton variant="secondary" size="sm" @click="onEdit(notice)">수정</BaseButton>
              <BaseButton variant="ghost" size="sm" @click="onDelete(notice)">삭제</BaseButton>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="noticeStore.total > 0"
      class="flex items-center justify-between text-sm text-text-secondary"
    >
      <span>
        총 {{ noticeStore.total }}건 · {{ noticeStore.page }} / {{ noticeStore.totalPages }} 페이지
      </span>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="noticeStore.page <= 1 || noticeStore.loading"
          @click="noticeStore.setPage(noticeStore.page - 1)"
        >
          이전
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="sm"
          :disabled="noticeStore.page >= noticeStore.totalPages || noticeStore.loading"
          @click="noticeStore.setPage(noticeStore.page + 1)"
        >
          다음
        </BaseButton>
      </div>
    </div>
  </div>
</template>
