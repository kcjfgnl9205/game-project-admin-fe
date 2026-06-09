import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

export const sketchPicWordsRoute: RouteRecordRaw = {
  path: '/games/sketch-pic/words',
  name: ROUTE_NAME.SKETCH_PIC_WORDS,
  component: () => import('./ui/SketchPicWordsPage.vue'),
}
