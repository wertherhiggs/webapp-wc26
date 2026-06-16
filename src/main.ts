import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './theme/theme.css'

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
