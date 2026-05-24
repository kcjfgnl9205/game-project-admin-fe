import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerProviders } from './providers'

const app = createApp(App)
registerProviders(app)
app.mount('#app')
