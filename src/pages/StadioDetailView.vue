<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '@/components/MatchCard.vue'
import { useMatchesStore } from '@/stores/matches'

const props = defineProps<{ id: string }>()
const router = useRouter()
const matches = useMatchesStore()

const COUNTRY = { CAN: 'Canada', USA: 'Stati Uniti', MEX: 'Messico' } as const

const venue = computed(() => matches.venueById(props.id))
const games = computed(() =>
  matches.sortedByKickoff.filter((m) => m.venueId === props.id),
)
</script>

<template>
  <div v-if="venue" class="page">
    <button class="back" @click="router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      <span>{{ $t('common.back') }}</span>
    </button>

    <div class="hero card">
      <span class="pin">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>
      </span>
      <div class="htitle">
        <div class="h1">{{ venue.stadium }}</div>
        <div class="muted">{{ venue.city }} · {{ COUNTRY[venue.country] }}</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat card">
        <div class="snum">{{ games.length }}</div>
        <div class="label">gare totali</div>
      </div>
      <div class="stat card">
        <div class="snum">{{ venue.capacity ? venue.capacity.toLocaleString('it-IT') : '—' }}</div>
        <div class="label">capienza</div>
      </div>
    </div>

    <h2 class="h2 sec">Partite in questo stadio</h2>
    <div class="list">
      <MatchCard v-for="m in games" :key="m.id" :match="m" />
      <p v-if="games.length === 0" class="muted none">Nessuna gara assegnata a questa sede.</p>
    </div>
  </div>
</template>

<style scoped>
.back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  padding: 6px 2px 16px;
}
.hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  margin-bottom: 14px;
}
.pin {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--turq);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.htitle { min-width: 0; }
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 22px;
}
.stat {
  padding: 16px;
  text-align: center;
}
.snum {
  font-size: 28px;
  font-weight: 900;
  color: var(--coral);
  line-height: 1;
  margin-bottom: 4px;
}
.sec { margin: 0 2px 12px; }
.list { display: flex; flex-direction: column; gap: 12px; }
.none { padding: 4px 2px; }
</style>
