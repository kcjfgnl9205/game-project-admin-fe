import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

export const whoDrewWordsRoute: RouteRecordRaw = {
  path: '/games/who-drew/words',
  name: ROUTE_NAME.WHO_DREW_WORDS,
  component: () => import('./ui/WhoDrewWordsPage.vue'),
}
