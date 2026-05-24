<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import AdminSidebar from '@/widgets/admin-sidebar/ui/AdminSidebar.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAME } from '@/app/router/router-name'

const router = useRouter()
const auth = useAuthStore()
const showSidebar = ref(false)

const route = useRoute()
const titleMap: Record<string, string> = {
  [ROUTE_NAME.DASHBOARD]: '대시보드',
  [ROUTE_NAME.NOTICE]: '공지사항',
}
const pageTitle = computed(() => titleMap[String(route.name)] ?? String(route.name ?? '관리자'))

const openSidebar = () => (showSidebar.value = true)
const closeSidebar = () => (showSidebar.value = false)

const handleLogout = () => {
  auth.logout()
  router.push({ name: ROUTE_NAME.LOGIN })
}
</script>

<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <div class="flex min-h-screen">
      <!-- Desktop sidebar -->
      <aside class="hidden md:block w-80 border-r border-border bg-bg-card px-6 py-8">
        <AdminSidebar />
      </aside>

      <!-- Mobile drawer -->
      <transition name="fade">
        <div v-if="showSidebar" class="fixed inset-0 z-50 flex md:hidden" aria-hidden="false">
          <div class="absolute inset-0 bg-black/40" @click="closeSidebar"></div>
          <div class="relative w-72 border-r border-border bg-bg-card p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold">관리자 메뉴</p>
              </div>
              <button class="text-sm text-text-secondary" @click="closeSidebar">닫기</button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      </transition>

      <div class="flex-1 bg-bg py-6">
        <div class="mb-6 flex items-center justify-between border-b border-border pb-4 px-6">
          <div class="flex items-center gap-4">
            <button
              class="inline-flex items-center justify-center rounded-md p-2 text-text-secondary md:hidden"
              aria-label="Open sidebar"
              @click="openSidebar"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <p class="text-sm font-semibold text-text-primary">{{ pageTitle }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-text-secondary">{{ auth.username || '관리자' }}님</span>
            <BaseButton variant="secondary" size="sm" @click="handleLogout">로그아웃</BaseButton>
          </div>
        </div>

        <main class="px-6">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
