import '@/assets/styles/main.css'

import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'

import { router, setupRouter } from '@/router'
import { setupStore } from '@/stores'

import { i18n } from '@i18n/renderer'

import App from './App.vue'

async function bootstrap() {
  const app = createApp(App)

  // 加载NuxtUI
  app.use(ui)

  // 加载i18n
  app.use(i18n)

  // 加载Store
  setupStore(app)

  // 加载Router
  setupRouter(app)

  await router.isReady()

  app.mount('#app')
}

bootstrap()
