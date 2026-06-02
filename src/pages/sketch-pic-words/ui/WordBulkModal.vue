<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'

interface Props {
  modalId: number
}
const props = defineProps<Props>()
const modal = useModalStore()

const text = ref('')

const words = computed(() =>
  text.value
    .split('\n')
    .map((w) => w.trim())
    .filter((w) => w.length > 0),
)

const tooLong = computed(() => words.value.some((w) => w.length > 30))
const tooMany = computed(() => words.value.length > 500)
const disabled = computed(() => words.value.length === 0 || tooLong.value || tooMany.value)

const onSubmit = () => {
  if (disabled.value) return
  modal.close(props.modalId, words.value)
}
</script>

<template>
  <form
    class="w-full md:w-2xl rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-bold text-text-primary">단어 일괄 등록</h2>
    <p class="mt-2 text-sm text-text-secondary">
      한 줄에 하나씩 입력하세요. 공백은 자동 제거되고, 중복은 서버에서 자동 skip됩니다.
    </p>

    <div class="mt-6">
      <textarea
        v-model="text"
        rows="12"
        placeholder="강아지&#10;고양이&#10;사과&#10;..."
        class="w-full resize-none rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm leading-relaxed text-text-primary outline-none transition-colors focus:border-brand"
      />
      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="text-text-muted">총 {{ words.length }}개 · 최대 500개, 각 30자 이내</span>
        <span v-if="tooLong" class="text-warning">30자를 초과한 단어가 있어요</span>
        <span v-else-if="tooMany" class="text-warning">500개를 초과했어요</span>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" type="button" @click="modal.close(props.modalId, null)">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit" :disabled="disabled"> 등록 </BaseButton>
    </div>
  </form>
</template>
