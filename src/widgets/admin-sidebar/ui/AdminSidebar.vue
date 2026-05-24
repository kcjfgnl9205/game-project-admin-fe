<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

const route = useRoute()
const items = [
  { label: '대시보드', name: ROUTE_NAME.DASHBOARD },
  { label: '공지사항', name: ROUTE_NAME.NOTICE },
]
</script>

<template>
  <div class="flex h-full flex-col justify-between">
    <div>
      <div class="mb-10">
        <p class="text-xs uppercase tracking-[0.3em] text-text-secondary">Game Admin</p>
        <h2 class="mt-4 text-3xl font-semibold text-text-primary">관리자 페이지</h2>
      </div>

      <nav class="space-y-2">
        <RouterLink
          v-for="item in items"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'flex items-center rounded-3xl px-4 py-4 text-sm font-semibold transition',
            route.name === item.name
              ? 'bg-brand text-on-brand'
              : 'text-text-primary hover:bg-bg-card-hover',
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <div class="rounded-3xl border border-border bg-bg p-5 text-sm text-text-secondary">
      <p class="font-semibold text-text-primary">운영자 전용</p>
      <p class="mt-3">로그아웃 후에도 다시 로그인해야 합니다.</p>
    </div>
  </div>
</template>
