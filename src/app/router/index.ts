import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/app/layouts/AdminLayout.vue'
import { loginRoute } from '@/pages/login'
import { dashboardRoute } from '@/pages/dashboard'
import { noticeRoute } from '@/pages/notice'
import { sketchPicRoomRoute } from '@/pages/sketch-pic-room'
import { sketchPicWordsRoute } from '@/pages/sketch-pic-words'
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
      children: [dashboardRoute, noticeRoute, sketchPicRoomRoute, sketchPicWordsRoute],
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (to.name === ROUTE_NAME.LOGIN && auth.isAuthenticated) {
    return { name: ROUTE_NAME.DASHBOARD }
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: ROUTE_NAME.LOGIN }
  }

  return true
})

export default router
