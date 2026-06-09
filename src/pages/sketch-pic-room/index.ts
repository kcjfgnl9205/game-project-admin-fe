import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/app/router/router-name'

export const sketchPicRoomRoute: RouteRecordRaw = {
  path: '/games/sketch-pic/room',
  name: ROUTE_NAME.SKETCH_PIC_ROOM,
  component: () => import('./ui/SketchPicRoomPage.vue'),
}
