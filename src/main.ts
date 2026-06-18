import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './theme/theme.css'

declare global {
  interface Window {
    hideWC2026Splash?: () => void
  }
}

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')

// Nasconde lo splash di avvio dopo una breve permanenza (così l'animazione si
// vede). Fallback al load in index.html se questo non gira.
setTimeout(() => window.hideWC2026Splash?.(), 900)
