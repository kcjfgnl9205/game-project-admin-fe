import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

export const dashboardRoute: RouteRecordRaw = {
  path: '',
  name: ROUTE_NAME.DASHBOARD,
  component: () => import('./ui/DashboardPage.vue'),
}
