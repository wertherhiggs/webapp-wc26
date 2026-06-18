<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MappaStadi from '@/components/MappaStadi.vue'
import { useMatchesStore } from '@/stores/matches'

const router = useRouter()
const matches = useMatchesStore()
const filter = ref<'all' | 'CAN' | 'USA' | 'MEX'>('all')

const COUNTRY = {
  CAN: { color: 'var(--turq)', name: 'Canada' },
  USA: { color: 'var(--gold)', name: 'Stati Uniti' },
  MEX: { color: 'var(--coral)', name: 'Messico' },
} as const

const matchCount = computed(() => {
  const m = new Map<string, number>()
  for (const match of matches.matches) {
    if (!match.venueId) continue
    m.set(match.venueId, (m.get(match.venueId) ?? 0) + 1)
  }
  return m
})

const cities = computed(() =>
  matches.venues
    .filter((v) => filter.value === 'all' || v.country === filter.value)
    .map((v) => ({ ...v, count: matchCount.value.get(v.id) ?? 0, color: COUNTRY[v.country].color })),
)
</script>

<template>
  <div class="page">
    <button class="back" @click="router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      <span>{{ $t('common.back') }}</span>
    </button>

    <MappaStadi v-model="filter" class="hero" />

    <div class="list">
      <button v-for="s in cities" :key="s.id" class="srow card" @click="router.push({ name: 'stadio', params: { id: s.id } })">
        <span class="sicon" :style="{ background: s.color }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>
        </span>
        <div class="sinfo"><div class="scity">{{ s.city }}</div><div class="muted sstad">{{ s.stadium }}</div></div>
        <div class="cnt"><div class="n">{{ s.count }}</div><div class="label">gare</div></div>
        <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>
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
  padding: 6px 2px 10px;
}
.hero { margin-bottom: 20px; }
.list { display: flex; flex-direction: column; gap: 10px; }
.srow {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 15px;
  border-radius: 18px;
  width: 100%;
  text-align: left;
}
.chev { flex-shrink: 0; }
.sicon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sinfo { flex: 1; }
.scity { font-size: 15px; font-weight: 900; }
.sstad { font-size: 12px; }
.cnt { text-align: right; }
.cnt .n { font-size: 20px; font-weight: 900; color: var(--coral); line-height: 1; }
</style>
