<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'
import { getDashboardSnapshot } from '@/shared/lib/dashboard'
import { fetchNotices } from '@/entities/notice/api'

const dashboard = getDashboardSnapshot()
const noticeTotal = ref(0)

onMounted(async () => {
  try {
    const res = await fetchNotices({ limit: 1 })
    noticeTotal.value = res.total
  } catch {
    // dashboard stat — silently fail
  }
})

const stats = computed(() => [
  { label: '전체 방', value: dashboard.roomsCount, tone: 'brand' },
  { label: '활성 사용자', value: dashboard.activeUsers, tone: 'neutral' },
  { label: '공지사항', value: noticeTotal.value, tone: 'warning' },
  { label: '열린 방', value: dashboard.openRooms, tone: 'brand' },
])
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.32em] text-text-secondary">대시보드</p>
        <h2 class="mt-2 text-3xl font-semibold text-text-primary">운영 현황</h2>
      </div>
      <BaseBadge tone="brand">최신 업데이트</BaseBadge>
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in stats"
        :key="item.label"
        class="rounded-3xl border border-border bg-bg-card p-6"
      >
        <p class="text-sm text-text-secondary">{{ item.label }}</p>
        <p class="mt-4 text-4xl font-semibold text-text-primary">{{ item.value }}</p>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <article class="rounded-3xl border border-border bg-bg-card p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-semibold text-text-primary">최신 방</h3>
            <p class="mt-1 text-sm text-text-secondary">최근 생성된 방 목록</p>
          </div>
          <BaseBadge tone="neutral">{{ dashboard.latestRooms.length }}개</BaseBadge>
        </div>

        <div class="mt-6 space-y-4">
          <div
            v-for="room in dashboard.latestRooms"
            :key="room.id"
            class="rounded-3xl border border-border-strong bg-bg p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm text-text-secondary">{{ room.id }}</p>
                <p class="mt-1 text-lg font-semibold text-text-primary">{{ room.name }}</p>
              </div>
              <BaseBadge :tone="room.status === 'open' ? 'brand' : 'warning'">
                {{ room.status === 'open' ? '진행 중' : '종료' }}
              </BaseBadge>
            </div>
            <div class="mt-3 flex items-center justify-between text-sm text-text-secondary">
              <span>플레이어 {{ room.players }}명</span>
              <span>{{ room.createdAt }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-border bg-bg-card p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-semibold text-text-primary">활성 사용자</h3>
            <p class="mt-1 text-sm text-text-secondary">최근 접속한 사용자</p>
          </div>
          <BaseBadge tone="brand">인기</BaseBadge>
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="user in dashboard.recentUsers"
            :key="user.id"
            class="flex items-center justify-between rounded-3xl border border-border-strong bg-bg p-4"
          >
            <div>
              <p class="font-semibold text-text-primary">{{ user.nickname }}</p>
              <p class="text-sm text-text-secondary">{{ user.role }} · {{ user.lastSeen }}</p>
            </div>
            <BaseBadge :tone="user.status === 'active' ? 'brand' : 'neutral'">
              {{ user.status === 'active' ? '활성' : '비활성' }}
            </BaseBadge>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
