<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ChipFiltro from '@/components/ChipFiltro.vue'
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

const chips: { key: 'all' | 'CAN' | 'USA' | 'MEX'; label: string }[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'CAN', label: 'Canada' },
  { key: 'USA', label: 'USA' },
  { key: 'MEX', label: 'Messico' },
]
</script>

<template>
  <div class="page">
    <button class="back" @click="router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      <span>{{ $t('common.back') }}</span>
    </button>
    <div class="title">
      <h1 class="h1">{{ $t('stadi.title') }}</h1>
      <div class="muted sub">{{ $t('stadi.sub') }}</div>
    </div>

    <div class="map">
      <span class="blob b1" /><span class="blob b2" /><span class="blob b3" />
      <span class="pin" style="left: 30%; top: 18%; background: var(--turq)" />
      <span class="pin" style="left: 62%; top: 24%; background: var(--turq)" />
      <span class="pin" style="left: 24%; top: 48%; background: var(--gold)" />
      <span class="pin" style="left: 46%; top: 42%; background: var(--gold)" />
      <span class="pin" style="left: 68%; top: 52%; background: var(--gold)" />
      <span class="pin" style="left: 30%; top: 78%; background: var(--coral)" />
      <span class="pin" style="left: 44%; top: 84%; background: var(--coral)" />
      <span class="caption label">Nord America · anteprima</span>
    </div>
    <div class="legend">
      <span><span class="ld" style="background: var(--turq)" />Canada</span>
      <span><span class="ld" style="background: var(--gold)" />Stati Uniti</span>
      <span><span class="ld" style="background: var(--coral)" />Messico</span>
    </div>

    <div data-hscroll class="chips">
      <ChipFiltro v-for="c in chips" :key="c.key" :label="c.label" :active="filter === c.key" @select="filter = c.key" />
    </div>

    <div class="list">
      <div v-for="s in cities" :key="s.id" class="srow card">
        <span class="sicon" :style="{ background: s.color }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>
        </span>
        <div class="sinfo"><div class="scity">{{ s.city }}</div><div class="muted sstad">{{ s.stadium }}</div></div>
        <div class="cnt"><div class="n">{{ s.count }}</div><div class="label">gare</div></div>
      </div>
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
.title { padding: 0 2px 14px; }
.sub { font-size: 13px; margin-top: 2px; }
.map {
  position: relative;
  height: 212px;
  border-radius: var(--r-card);
  overflow: hidden;
  border: 0.5px solid var(--border);
  margin-bottom: 12px;
  background: var(--surface);
  background-image: radial-gradient(rgba(120, 140, 135, 0.28) 1px, transparent 1px);
  background-size: 13px 13px;
}
.blob { position: absolute; border-radius: 46% 42% 50% 44%; }
.b1 { left: 16%; top: 6%; width: 62%; height: 30%; background: rgba(62, 200, 192, 0.3); }
.b2 { left: 10%; top: 33%; width: 70%; height: 38%; background: rgba(244, 201, 75, 0.32); }
.b3 { left: 14%; top: 66%; width: 42%; height: 28%; background: rgba(232, 97, 74, 0.32); }
.pin {
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  border: 2px solid #fff;
}
.caption {
  position: absolute;
  left: 14px;
  bottom: 12px;
  background: var(--card);
  padding: 5px 9px;
  border-radius: 999px;
}
.legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 18px;
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}
.ld { width: 9px; height: 9px; border-radius: 999px; }
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px 16px;
  margin: 0 -16px;
}
.list { display: flex; flex-direction: column; gap: 10px; }
.srow {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 15px;
  border-radius: 18px;
}
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
