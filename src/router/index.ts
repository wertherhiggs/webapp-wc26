import { createRouter, createWebHashHistory } from 'vue-router'

// Hash history: robusto su GitHub Pages (nessun 404 al refresh, path-agnostic).
export const router = createRouter({
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
