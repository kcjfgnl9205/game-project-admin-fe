<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'
import type { WhoDrewWordPair, WhoDrewWordPairRequest } from '@/entities/who-drew-word-pair/model'

interface Props {
  modalId: number
  pair?: WhoDrewWordPair | null
}
const props = withDefaults(defineProps<Props>(), { pair: null })
const modal = useModalStore()

const civilianWord = ref(props.pair?.civilianWord ?? '')
const mafiaWord = ref(props.pair?.mafiaWord ?? '')

const onSubmit = () => {
  const civilian = civilianWord.value.trim()
  const mafia = mafiaWord.value.trim()
  if (!civilian || !mafia) return
  modal.close(props.modalId, {
    civilianWord: civilian,
    mafiaWord: mafia,
  } satisfies WhoDrewWordPairRequest)
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
      {{ pair ? '단어쌍 수정' : '단어쌍 등록' }}
    </h2>

    <div class="mt-6 space-y-4">
      <div>
        <label for="civilian-input" class="mb-2 block text-sm font-medium text-text-secondary">
          일반인 단어
        </label>
        <input
          id="civilian-input"
          v-model="civilianWord"
          type="text"
          required
          maxlength="30"
          placeholder="예: 사자 (최대 30자)"
          :class="inputClass"
        />
      </div>
      <div>
        <label for="mafia-input" class="mb-2 block text-sm font-medium text-text-secondary">
          마피아 단어
        </label>
        <input
          id="mafia-input"
          v-model="mafiaWord"
          type="text"
          required
          maxlength="30"
          placeholder="예: 호랑이 (헷갈리는 관련 단어)"
          :class="inputClass"
        />
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId, null)">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit">
        {{ pair ? '수정' : '등록' }}
      </BaseButton>
    </div>
  </form>
</template>
