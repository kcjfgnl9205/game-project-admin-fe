<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'
import type { Notice, NoticeRequest } from '@/entities/notice/model'

interface Props {
  modalId: number
  notice?: Notice | null
}
const props = withDefaults(defineProps<Props>(), { notice: null })
const modal = useModalStore()

const title = ref(props.notice?.title ?? '')
const content = ref(props.notice?.content ?? '')

const onSubmit = () => {
  const t = title.value.trim()
  const c = content.value.trim()
  if (!t || !c) return
  modal.close(props.modalId, { title: t, content: c } satisfies NoticeRequest)
}
</script>

<template>
  <form
    class="w-full md:w-2xl rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-bold text-text-primary">
      {{ notice ? '공지 수정' : '공지 등록' }}
    </h2>

    <div class="mt-6 space-y-4">
      <div>
        <label for="notice-title" class="mb-2 block text-sm font-medium text-text-secondary">
          제목
        </label>
        <input
          id="notice-title"
          v-model="title"
          type="text"
          required
          maxlength="200"
          placeholder="제목을 입력하세요"
          class="w-full rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand"
        />
      </div>
      <div>
        <label for="notice-content" class="mb-2 block text-sm font-medium text-text-secondary">
          내용
        </label>
        <textarea
          id="notice-content"
          v-model="content"
          required
          rows="8"
          placeholder="내용을 입력하세요"
          class="w-full resize-none rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm leading-relaxed text-text-primary outline-none transition-colors focus:border-brand"
        />
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId, null)">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit">
        {{ notice ? '수정' : '등록' }}
      </BaseButton>
    </div>
  </form>
</template>
