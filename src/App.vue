<script setup lang="ts">
import { onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import { useSettingsStore } from '@/stores/settings'
import { useMatchesStore } from '@/stores/matches'
import { useFavoritesStore } from '@/stores/favorites'
import { usePredictionsStore } from '@/stores/predictions'
import { checkAndNotify } from '@/services/notifications'

const settings = useSettingsStore()
const matches = useMatchesStore()
const favorites = useFavoritesStore()
const predictions = usePredictionsStore()

onMounted(async () => {
  await Promise.all([settings.load(), favorites.load(), predictions.load()])
  await matches.load()
  // aggiornamento dati in background (best-effort)
  matches.refresh().then(() => checkAndNotify(matches.matches))
  checkAndNotify(matches.matches)
})
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
