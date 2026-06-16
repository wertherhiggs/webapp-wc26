<script setup lang="ts">
import { ref, computed } from 'vue'
import MatchCard from '@/components/MatchCard.vue'
import ChipFiltro from '@/components/ChipFiltro.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useMatchesStore } from '@/stores/matches'
import { getTv } from '@/data/tv'
import { romeDayKey, romeDayLabel } from '@/services/time'
import type { Match } from '@/types'

const matches = useMatchesStore()
const group = ref<string>('all')
const raiOnly = ref(false)

const groups = computed(() => {
  const set = new Set<string>()
  matches.matches.forEach((m) => m.group && set.add(m.group))
  return [...set].sort()
})

const filtered = computed(() =>
  matches.sortedByKickoff.filter((m) => {
    if (raiOnly.value && !getTv(m.id).inChiaro) return false
    if (group.value !== 'all' && m.group !== group.value) return false
    return true
  }),
)

interface Day {
  key: string
  label: string
  matches: Match[]
}
const days = computed<Day[]>(() => {
  const map = new Map<string, Match[]>()
  for (const m of filtered.value) {
    const k = romeDayKey(m.kickoff)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(m)
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, ms]) => ({ key, label: romeDayLabel(ms[0].kickoff), matches: ms }))
})
</script>

<template>
  <div class="page">
    <h1 class="h1 title">{{ $t('calendario.title') }}</h1>

    <div data-hscroll class="chips">
      <ChipFiltro :label="$t('calendario.all')" :active="group === 'all'" @select="group = 'all'" />
      <ChipFiltro
        v-for="g in groups"
        :key="g"
        :label="`Gruppo ${g}`"
        :active="group === g"
        @select="group = g"
      />
    </div>

    <button class="raibar card" @click="raiOnly = !raiOnly">
      <span class="left"><span class="sq" />{{ $t('calendario.onlyRai') }}</span>
      <ToggleSwitch v-model="raiOnly" @click.stop />
    </button>

    <div v-if="days.length === 0" class="empty">
      <div class="h2">{{ $t('calendario.empty') }}</div>
      <p class="muted">{{ $t('calendario.emptyText') }}</p>
    </div>

    <section v-for="d in days" :key="d.key" class="day">
      <div class="dhd"><span class="label">{{ d.label }}</span><span class="line" /></div>
      <div class="list">
        <MatchCard v-for="m in d.matches" :key="m.id" :match="m" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.title {
  padding: 8px 2px 14px;
}
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 16px 14px;
  margin: 0 -16px;
}
.raibar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 15px;
  margin-bottom: 18px;
  border-radius: var(--r-sm);
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
}
.sq {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  background: var(--rai);
}
.day {
  margin-bottom: 20px;
}
.dhd {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.line {
  flex: 1;
  height: 0.5px;
  background: var(--border);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty {
  text-align: center;
  padding: 48px 20px;
}
</style>
