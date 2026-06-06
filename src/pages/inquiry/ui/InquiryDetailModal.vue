<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore, useInquiryStore } from '@/shared/stores'
import { useToast } from '@/shared/composables'
import type { Inquiry, InquiryStatus } from '@/entities/inquiry/model'
import { formatDateYYYYMMDD } from '@/shared/lib/date'

interface Props {
  modalId: number
  inquiry: Inquiry
}
const props = defineProps<Props>()
const modal = useModalStore()
const store = useInquiryStore()
const toast = useToast()

const status = ref<InquiryStatus>(props.inquiry.status)
const saving = ref(false)

const onSave = async () => {
  saving.value = true
  try {
    await store.updateStatus(props.inquiry.id, status.value)
    toast.success('상태가 저장되었어요.')
    modal.close(props.modalId)
  } catch (e) {
    toast.error(e, '상태 저장에 실패했어요.')
  } finally {
    saving.value = false
  }
}

const selectClass =
  'rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand'
</script>

<template>
  <div class="w-full md:w-lg rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4">
    <h2 class="text-xl font-bold text-text-primary">문의 상세</h2>

    <dl class="mt-6 space-y-4 text-sm">
      <div class="flex gap-3">
        <dt class="w-20 shrink-0 font-medium text-text-secondary">카테고리</dt>
        <dd class="text-text-primary">{{ inquiry.category.name }}</dd>
      </div>
      <div class="flex gap-3">
        <dt class="w-20 shrink-0 font-medium text-text-secondary">이메일</dt>
        <dd class="break-all text-text-primary">{{ inquiry.email }}</dd>
      </div>
      <div class="flex gap-3">
        <dt class="w-20 shrink-0 font-medium text-text-secondary">제목</dt>
        <dd class="font-semibold text-text-primary">{{ inquiry.title }}</dd>
      </div>
      <div class="flex gap-3">
        <dt class="w-20 shrink-0 font-medium text-text-secondary">내용</dt>
        <dd class="whitespace-pre-wrap break-words text-text-primary">{{ inquiry.content }}</dd>
      </div>
      <div class="flex gap-3">
        <dt class="w-20 shrink-0 font-medium text-text-secondary">등록일</dt>
        <dd class="text-text-muted">
          {{ formatDateYYYYMMDD(inquiry.createdAt) }} · 수정
          {{ formatDateYYYYMMDD(inquiry.updatedAt) }}
        </dd>
      </div>
    </dl>

    <div class="mt-6">
      <label for="status-select" class="mb-2 block text-sm font-medium text-text-secondary">
        상태
      </label>
      <select id="status-select" v-model="status" :class="selectClass">
        <option value="PENDING">미처리</option>
        <option value="DONE">처리완료</option>
      </select>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId)">
        닫기
      </BaseButton>
      <BaseButton variant="primary" type="button" :disabled="saving" @click="onSave">
        상태 저장
      </BaseButton>
    </div>
  </div>
</template>
