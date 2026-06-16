<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useSettingsStore } from '@/stores/settings'
import { useMatchesStore } from '@/stores/matches'
import { useFavoritesStore } from '@/stores/favorites'
import { usePredictionsStore } from '@/stores/predictions'
import { checkAndNotify, checkGoals, permission } from '@/services/notifications'

const settings = useSettingsStore()
const matches = useMatchesStore()
const favorites = useFavoritesStore()
const predictions = usePredictionsStore()

const GOAL_POLL_MS = 60_000
let goalTimer: number | undefined

function stopGoalPolling() {
  if (goalTimer) clearInterval(goalTimer)
  goalTimer = undefined
}
function startGoalPolling() {
  stopGoalPolling()
  checkGoals(matches.matches) // imposta la baseline subito
  goalTimer = window.setInterval(async () => {
    await matches.refresh()
    await checkGoals(matches.matches)
  }, GOAL_POLL_MS)
}

onMounted(async () => {
  await Promise.all([settings.load(), favorites.load(), predictions.load()])
  await matches.load()
  // aggiornamento dati in background (best-effort) + promemoria mezzogiorno
  matches.refresh().then(() => checkAndNotify(matches.matches))
  checkAndNotify(matches.matches)
  if (settings.notifGoals && permission() === 'granted') startGoalPolling()
})

onUnmounted(stopGoalPolling)

// avvia/ferma il polling gol quando il toggle cambia
watch(
  () => settings.notifGoals,
  (on) => (on && permission() === 'granted' ? startGoalPolling() : stopGoalPolling()),
)
</script>

<template>
  <div class="app">
    <main class="content" data-mscroll>
      <div class="container">
        <RouterView v-if="matches.loaded" />
        <div v-else class="loading">Caricamento…</div>
      </div>
    </main>
    <BottomNav />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}
.content {
  flex: 1;
  overflow-y: auto;
}
.container {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: max(12px, env(safe-area-inset-top)) 16px 12px;
}
.loading {
  padding: 80px 0;
  text-align: center;
  color: var(--muted);
}
</style>
