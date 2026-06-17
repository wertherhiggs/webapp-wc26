<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { key: 'home', label: 'Home', to: { name: 'home' }, paths: ['home', 'dettaglio'], d: ['M3 10.6 12 3l9 7.6', 'M5.5 9.3V20h13V9.3'] },
  { key: 'calendario', label: 'Calendario', to: { name: 'calendario' }, paths: ['calendario'], d: ['M4 6.5h16v14H4z', 'M4 10.5h16', 'M8 3.2v3', 'M16 3.2v3'] },
  { key: 'tabellone', label: 'Tabellone', to: { name: 'tabellone' }, paths: ['tabellone'], d: ['M4 5h6v6H4z', 'M4 13h6v6H4z', 'M14 9h6', 'M17 9v6', 'M14 15h6'] },
  { key: 'classifiche', label: 'Classifiche', to: { name: 'classifiche' }, paths: ['classifiche', 'squadra'], d: ['M6 20V10', 'M12 20V4', 'M18 20v-8', 'M3.5 20h17'] },
  { key: 'pronostici', label: 'Pronostici', to: { name: 'pronostici' }, paths: ['pronostici'], d: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
  { key: 'stadi', label: 'Stadi', to: { name: 'stadi' }, paths: ['stadi', 'stadio'], d: ['M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z', 'M12 9.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z'] },
  { key: 'preferiti', label: 'Preferiti', to: { name: 'preferiti' }, paths: ['preferiti'], d: ['M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z'] },
]

const activeKey = computed(() => {
  const name = String(route.name ?? '')
  return items.find((i) => i.paths.includes(name))?.key ?? 'home'
})
</script>

<template>
  <nav class="wrap">
    <div class="bar">
      <RouterLink
        v-for="it in items"
        :key="it.key"
        :to="it.to"
        class="item"
        :class="{ active: activeKey === it.key }"
      >
        <span class="ind"><span v-if="activeKey === it.key" class="d" /></span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="(p, i) in it.d" :key="i" :d="p" />
        </svg>
        <span class="lbl">{{ it.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.wrap {
  position: sticky;
  bottom: 0;
  padding: 8px 12px calc(14px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 60%, transparent);
}
.bar {
  max-width: var(--maxw);
  margin: 0 auto;
  background: #111111;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 2px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
  text-decoration: none;
  color: #6e6e68;
}
.item.active {
  color: var(--gold);
}
.ind {
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.d {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--gold);
}
.lbl {
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
