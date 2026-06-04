<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

interface MenuLeaf {
  label: string
  routeName: (typeof ROUTE_NAME)[keyof typeof ROUTE_NAME]
}
interface MenuGroup {
  label: string
  key: string
  children: MenuItem[]
}
type MenuItem = MenuLeaf | MenuGroup

const isGroup = (item: MenuItem): item is MenuGroup => 'children' in item

const items: MenuItem[] = [
  { label: '대시보드', routeName: ROUTE_NAME.DASHBOARD },
  { label: '공지사항', routeName: ROUTE_NAME.NOTICE },
  {
    label: '게임설정',
    key: 'games',
    children: [
      {
        label: '스케치픽',
        key: 'sketch-pic',
        children: [
          { label: '방정보', routeName: ROUTE_NAME.SKETCH_PIC_ROOM },
          { label: '단어 설정', routeName: ROUTE_NAME.SKETCH_PIC_WORDS },
        ],
      },
      {
        label: '누가그렸지',
        key: 'who-drew',
        children: [{ label: '단어 설정', routeName: ROUTE_NAME.WHO_DREW_WORDS }],
      },
      {
        label: '끝말잇기',
        key: 'word-chain',
        children: [],
      },
    ],
  },
]

const route = useRoute()
const expanded = ref<Set<string>>(new Set())

const toggle = (key: string) => {
  if (expanded.value.has(key)) expanded.value.delete(key)
  else expanded.value.add(key)
}

const findGroupPath = (list: MenuItem[], name: string): MenuGroup[] | null => {
  for (const item of list) {
    if (!isGroup(item)) {
      if (item.routeName === name) return []
    } else {
      const sub = findGroupPath(item.children, name)
      if (sub) return [item, ...sub]
    }
  }
  return null
}

watchEffect(() => {
  const path = findGroupPath(items, String(route.name ?? ''))
  if (path) path.forEach((g) => expanded.value.add(g.key))
})

const leafClass = (name: string) => [
  'block rounded-2xl px-4 py-3 text-sm font-medium transition',
  route.name === name ? 'bg-brand text-on-brand' : 'text-text-primary hover:bg-bg-card-hover',
]

const groupBtnClass =
  'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-text-primary transition hover:bg-bg-card-hover'
</script>

<template>
  <div class="flex h-full flex-col justify-between">
    <div>
      <div class="mb-10">
        <p class="text-xs uppercase tracking-[0.3em] text-text-secondary">Game Admin</p>
        <h2 class="mt-4 text-3xl font-semibold text-text-primary">관리자 페이지</h2>
      </div>

      <nav class="space-y-1">
        <template v-for="item in items" :key="item.label">
          <RouterLink
            v-if="!isGroup(item)"
            :to="{ name: item.routeName }"
            :class="leafClass(item.routeName)"
          >
            {{ item.label }}
          </RouterLink>

          <div v-else>
            <button type="button" :class="groupBtnClass" @click="toggle(item.key)">
              <span>{{ item.label }}</span>
              <span class="transition-transform" :class="expanded.has(item.key) ? 'rotate-90' : ''"
                >›</span
              >
            </button>

            <div
              v-show="expanded.has(item.key)"
              class="ml-3 mt-1 space-y-1 border-l border-border pl-3"
            >
              <template v-for="sub in item.children" :key="sub.label">
                <RouterLink
                  v-if="!isGroup(sub)"
                  :to="{ name: sub.routeName }"
                  :class="leafClass(sub.routeName)"
                >
                  {{ sub.label }}
                </RouterLink>

                <div v-else>
                  <button type="button" :class="groupBtnClass" @click="toggle(sub.key)">
                    <span>{{ sub.label }}</span>
                    <span
                      class="transition-transform"
                      :class="expanded.has(sub.key) ? 'rotate-90' : ''"
                      >›</span
                    >
                  </button>

                  <div
                    v-show="expanded.has(sub.key)"
                    class="ml-3 mt-1 space-y-1 border-l border-border pl-3"
                  >
                    <template v-if="sub.children.length > 0">
                      <RouterLink
                        v-for="leaf in sub.children"
                        :key="leaf.label"
                        :to="isGroup(leaf) ? '' : { name: leaf.routeName }"
                        :class="isGroup(leaf) ? '' : leafClass(leaf.routeName)"
                      >
                        {{ leaf.label }}
                      </RouterLink>
                    </template>
                    <p v-else class="px-4 py-2 text-xs text-text-muted">준비 중</p>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </nav>
    </div>

    <div class="rounded-3xl border border-border bg-bg p-5 text-sm text-text-secondary">
      <p class="font-semibold text-text-primary">운영자 전용</p>
      <p class="mt-3">로그아웃 후에도 다시 로그인해야 합니다.</p>
    </div>
  </div>
</template>
