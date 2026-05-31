<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAME } from '@/app/router/router-name'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const ok = await auth.login({ email: email.value.trim(), password: password.value })
    if (ok) await router.push({ name: ROUTE_NAME.DASHBOARD })
  } finally {
    submitting.value = false
  }
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
          <label class="block text-sm font-medium text-text-secondary">이메일</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-3xl border border-border bg-bg px-4 py-4 text-base text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            autocomplete="email"
            placeholder="admin@puzmu.com"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-text-secondary">비밀번호</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-3xl border border-border bg-bg px-4 py-4 text-base text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <div class="space-y-3">
          <BaseButton type="submit" class="w-full" :disabled="submitting">
            {{ submitting ? '로그인 중…' : '로그인' }}
          </BaseButton>
          <p v-if="auth.error" class="text-sm text-warning">{{ auth.error }}</p>
        </div>
      </form>
    </section>
  </div>
</template>
