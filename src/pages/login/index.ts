import type { RouteRecordRaw } from 'vue-router'
import LoginPage from './ui/LoginPage.vue'
import { ROUTE_NAME } from '@/app/router/router-name'

export const loginRoute: RouteRecordRaw = {
  path: '/login',
  name: ROUTE_NAME.LOGIN,
  component: LoginPage,
}
