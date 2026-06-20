import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import it from './i18n/it.json'
import './theme/theme.css'

declare global {
  interface Window {
    hideWC2026Splash?: () => void
  }
}

// Hash history: robusto su GitHub Pages (nessun 404 al refresh, path-agnostic).
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomeView.vue') },
    { path: '/calendario', name: 'calendario', component: () => import('@/pages/CalendarioView.vue') },
    { path: '/tabellone', name: 'tabellone', component: () => import('@/pages/TabelloneView.vue') },
    { path: '/classifiche', name: 'classifiche', component: () => import('@/pages/ClassificheView.vue') },
    { path: '/preferiti', name: 'preferiti', component: () => import('@/pages/PreferitiView.vue') },
    { path: '/pronostici', name: 'pronostici', component: () => import('@/pages/PronosticiView.vue') },
    { path: '/squadra/:code', name: 'squadra', component: () => import('@/pages/SquadraView.vue'), props: true },
    { path: '/stadi', name: 'stadi', component: () => import('@/pages/StadiView.vue') },
    { path: '/stadio/:id', name: 'stadio', component: () => import('@/pages/StadioDetailView.vue'), props: true },
    { path: '/partita/:id', name: 'dettaglio', component: () => import('@/pages/DettaglioPartitaView.vue'), props: true },
  ],
})

const i18n = createI18n({ legacy: false, locale: 'it', fallbackLocale: 'it', messages: { it } })

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')

// Nasconde lo splash di avvio dopo una breve permanenza (così l'animazione si
// vede). Fallback al load in index.html se questo non gira.
setTimeout(() => window.hideWC2026Splash?.(), 900)
