<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'
import type { SketchPicWord, SketchPicWordRequest } from '@/entities/sketch-pic-word/model'

interface Props {
  modalId: number
  word?: SketchPicWord | null
}
const props = withDefaults(defineProps<Props>(), { word: null })
const modal = useModalStore()

const value = ref(props.word?.word ?? '')

const onSubmit = () => {
  const w = value.value.trim()
  if (!w) return
  modal.close(props.modalId, { word: w } satisfies SketchPicWordRequest)
}
</script>

<template>
  <form
    class="w-full md:w-md rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-bold text-text-primary">
      {{ word ? '단어 수정' : '단어 등록' }}
    </h2>

    <div class="mt-6">
      <label for="word-input" class="mb-2 block text-sm font-medium text-text-secondary">
        단어
      </label>
      <input
        id="word-input"
        v-model="value"
        type="text"
        required
        maxlength="30"
        placeholder="단어를 입력하세요 (최대 30자)"
        class="w-full rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand"
      />
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId, null)">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit">
        {{ word ? '수정' : '등록' }}
      </BaseButton>
    </div>
  </form>
</template>
