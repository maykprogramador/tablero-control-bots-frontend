// main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dashboardBot from './components/tablero-bot/tablero.vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia() // 💡 Guardas la instancia
app.use(pinia)

app.use(router)
app.component('dashboard-Bot', dashboardBot)

app.mount('#app')

// 👇 Exportas pinia para usarlo en otros archivos
export { pinia }
