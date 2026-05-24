<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAME } from '@/app/router/router-name'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  const success = await auth.login(username.value, password.value)

  if (!success) {
    errorMessage.value = auth.error ?? '로그인에 실패했습니다.'
    return
  }

  await router.push({ name: ROUTE_NAME.DASHBOARD })
}
</script>

<template>
  <div class="min-h-screen bg-white px-4 py-12 text-text-primary sm:px-6 lg:px-8">
    <section
      class="mx-auto w-full max-w-md rounded-4xl border border-border bg-white p-8 shadow-sm"
    >
      <div class="mb-8">
        <h2 class="text-3xl font-semibold text-text-primary">관리자 로그인</h2>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-text-secondary">아이디</label>
          <input
            v-model="username"
            class="w-full rounded-3xl border border-border bg-bg px-4 py-4 text-base text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            autocomplete="username"
            placeholder="admin"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-text-secondary">비밀번호</label>
          <input
            v-model="password"
            type="password"
            class="w-full rounded-3xl border border-border bg-bg px-4 py-4 text-base text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <div class="space-y-3">
          <BaseButton type="submit" class="w-full">로그인</BaseButton>
          <p v-if="errorMessage" class="text-sm text-warning">{{ errorMessage }}</p>
        </div>
      </form>
    </section>
  </div>
</template>
