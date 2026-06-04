<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useModalStore } from '@/shared/stores'
import type { WhoDrewWordPairRequest } from '@/entities/who-drew-word-pair/model'

interface Props {
  modalId: number
}
const props = defineProps<Props>()
const modal = useModalStore()

const text = ref('')

// "일반인,마피아" 형식을 한 줄에 하나씩. 콤마로 구분.
interface ParsedLine {
  civilianWord: string
  mafiaWord: string
  valid: boolean
}
const lines = computed<ParsedLine[]>(() =>
  text.value
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => {
      const [civilianWord = '', mafiaWord = ''] = l.split(',').map((w) => w.trim())
      return {
        civilianWord,
        mafiaWord,
        valid: !!civilianWord && !!mafiaWord,
      }
    }),
)

const pairs = computed<WhoDrewWordPairRequest[]>(() =>
  lines.value
    .filter((l) => l.valid)
    .map(({ civilianWord, mafiaWord }) => ({ civilianWord, mafiaWord })),
)

const hasInvalid = computed(() => lines.value.some((l) => !l.valid))
const tooLong = computed(() =>
  pairs.value.some((p) => p.civilianWord.length > 30 || p.mafiaWord.length > 30),
)
const tooMany = computed(() => pairs.value.length > 500)
const disabled = computed(() => pairs.value.length === 0 || tooLong.value || tooMany.value)

const onSubmit = () => {
  if (disabled.value) return
  modal.close(props.modalId, pairs.value)
}
</script>

<template>
  <form
    class="w-full md:w-2xl rounded-2xl border border-border bg-bg-card p-8 shadow-xl md:mx-4"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-bold text-text-primary">단어쌍 일괄 등록</h2>
    <p class="mt-2 text-sm text-text-secondary">
      한 줄에 하나씩 <code class="text-brand">일반인,마피아</code> 형식으로 입력하세요. 공백은 자동
      제거되고, 중복은 서버에서 자동 skip됩니다.
    </p>

    <div class="mt-6">
      <textarea
        v-model="text"
        rows="12"
        placeholder="사자,호랑이&#10;버스,트럭&#10;사과,배&#10;..."
        class="w-full resize-none rounded-lg border border-border-strong bg-bg px-4 py-2.5 text-sm leading-relaxed text-text-primary outline-none transition-colors focus:border-brand"
      />
      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="text-text-muted">
          유효 {{ pairs.length }}쌍 · 최대 500쌍, 각 단어 30자 이내
        </span>
        <span v-if="hasInvalid" class="text-warning">
          형식(일반인,마피아)이 잘못된 줄이 있어요
        </span>
        <span v-else-if="tooLong" class="text-warning">30자를 초과한 단어가 있어요</span>
        <span v-else-if="tooMany" class="text-warning">500쌍을 초과했어요</span>
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
