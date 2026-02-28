import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({
    el: '#app',
    top: 0,
    behavior: 'smooth'
  })
})

export async function setupRouter(app: App) {
  app.use(router)
}
