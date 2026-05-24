import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'
import { loginRoute } from '@/pages/login'
import { dashboardRoute } from '@/pages/dashboard'
import { noticeRoute } from '@/pages/notice'
import { ROUTE_NAME } from '@/app/router/router-name'
import { useAuthStore } from '@/shared/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    loginRoute,
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [dashboardRoute, noticeRoute],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.name === ROUTE_NAME.LOGIN && auth.isAuthenticated) {
    return { name: ROUTE_NAME.DASHBOARD }
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: ROUTE_NAME.LOGIN }
  }

  return true
})

export default router
