import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

export const inquiryCategoriesRoute: RouteRecordRaw = {
  path: '/inquiries/categories',
  name: ROUTE_NAME.INQUIRY_CATEGORIES,
  component: () => import('./ui/InquiryCategoriesPage.vue'),
}

export const inquiryListRoute: RouteRecordRaw = {
  path: '/inquiries',
  name: ROUTE_NAME.INQUIRY_LIST,
  component: () => import('./ui/InquiryListPage.vue'),
}
