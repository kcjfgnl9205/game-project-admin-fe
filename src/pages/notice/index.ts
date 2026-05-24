import type { RouteRecordRaw } from 'vue-router'
import NoticePage from './ui/NoticePage.vue'
import { ROUTE_NAME } from '@/app/router/router-name'

export const noticeRoute: RouteRecordRaw = {
  path: '/notice',
  name: ROUTE_NAME.NOTICE,
  component: NoticePage,
}
