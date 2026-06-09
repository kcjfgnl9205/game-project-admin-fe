<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'
import type { InquiryCategory, InquiryCategoryRequest } from '@/entities/inquiry/model'

interface Props {
  modalId: number
  category?: InquiryCategory | null
}
const props = withDefaults(defineProps<Props>(), { category: null })
const modal = useModalStore()

const name = ref(props.category?.name ?? '')
const sortOrder = ref<number>(props.category?.sortOrder ?? 0)

const onSubmit = () => {
  const trimmed = name.value.trim()
  if (!trimmed) return
  modal.close(props.modalId, {
    name: trimmed,
    sortOrder: Number(sortOrder.value) || 0,
  } satisfies InquiryCategoryRequest)
}

const inputClass =
  'w-full rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand'
</script>

<template>
  <form
    class="w-full md:w-md rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-bold text-text-primary">
      {{ category ? '카테고리 수정' : '카테고리 등록' }}
    </h2>

    <div class="mt-6 space-y-4">
      <div>
        <label for="category-name-input" class="mb-2 block text-sm font-medium text-text-secondary">
          이름
        </label>
        <input
          id="category-name-input"
          v-model="name"
          type="text"
          required
          maxlength="50"
          placeholder="예: 결제 문의 (최대 50자)"
          :class="inputClass"
        />
      </div>
      <div>
        <label for="category-sort-input" class="mb-2 block text-sm font-medium text-text-secondary">
          정렬 순서
        </label>
        <input
          id="category-sort-input"
          v-model.number="sortOrder"
          type="number"
          placeholder="숫자가 작을수록 먼저 노출"
          :class="inputClass"
        />
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId, null)">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit">
        {{ category ? '수정' : '등록' }}
      </BaseButton>
    </div>
  </form>
</template>
