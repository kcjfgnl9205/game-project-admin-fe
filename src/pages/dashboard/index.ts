import type { RouteRecordRaw } from 'vue-router'
import DashboardPage from './ui/DashboardPage.vue'
import { ROUTE_NAME } from '@/app/router/router-name'

export const dashboardRoute: RouteRecordRaw = {
  path: '',
  name: ROUTE_NAME.DASHBOARD,
  component: DashboardPage,
}
