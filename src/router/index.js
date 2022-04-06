import { createRouter, createWebHashHistory } from 'vue-router'
import UserLocation from '../pages/UserLocation.vue'

const routes = [
  {
    path: '/',
    component: UserLocation,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
