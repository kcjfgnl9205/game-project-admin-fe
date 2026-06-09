import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerProviders } from './providers'
import { configureAuth } from '@/shared/api'
import { useAuthStore } from '@/shared/stores'

const app = createApp(App)
registerProviders(app)

const auth = useAuthStore()
configureAuth({
  getAccessToken: () => auth.accessToken,
  onUnauthorized: () => auth.refresh(),
})

auth.init().finally(() => app.mount('#app'))
