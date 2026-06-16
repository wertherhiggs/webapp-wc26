<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { romeShortDay, romeTime } from '@/services/time'
import type { Match } from '@/types'

const router = useRouter()
const matches = useMatchesStore()

const STAGES: { key: string; name: string }[] = [
  { key: 'R32', name: 'Sedicesimi' },
  { key: 'R16', name: 'Ottavi' },
  { key: 'QF', name: 'Quarti' },
  { key: 'SF', name: 'Semifinale' },
  { key: '3P', name: 'Finale 3°/4°' },
  { key: 'F', name: 'Finale' },
]

const hasReal = computed(() => matches.knockoutMatches.length > 0)

const rounds = computed(() =>
  STAGES.map((s) => ({
    name: s.name,
    matches: matches.knockoutMatches.filter((m) => m.stage === s.key),
  })).filter((r) => r.matches.length > 0),
)

function score(m: Match, side: 'h' | 'a'): string {
  if (m.status === 'ft' && m.hs != null && m.as != null) return String(side === 'h' ? m.hs : m.as)
  return ''
}
function winner(m: Match): 'h' | 'a' | null {
  if (m.status !== 'ft' || m.hs == null || m.as == null) return null
  return m.hs > m.as ? 'h' : m.as > m.hs ? 'a' : null
}
function note(m: Match): string {
  return m.status === 'ft' ? '' : `${romeShortDay(m.kickoff)} · ${romeTime(m.kickoff)}`
}
</script>

<template>
  <div class="page">
    <div class="title">
      <h1 class="h1">{{ $t('tabellone.title') }}</h1>
      <div v-if="hasReal" class="muted sub">{{ $t('tabellone.scroll') }}</div>
    </div>

    <div v-if="hasReal" data-hscroll class="board">
      <div v-for="r in rounds" :key="r.name" class="col">
        <div class="rname label">{{ r.name }}</div>
        <button v-for="m in r.matches" :key="m.id" class="bm card" @click="router.push({ name: 'dettaglio', params: { id: m.id } })">
          <div class="line">
            <span class="t">
              <TeamFlag v-if="!m.homePlaceholder" :code="m.home" size="sm" />
              <span class="nm" :class="{ win: winner(m) === 'h', ph: m.homePlaceholder }">{{ m.homePlaceholder ?? m.home }}</span>
            </span>
            <span class="sc" :class="{ win: winner(m) === 'h' }">{{ score(m, 'h') }}</span>
          </div>
          <div class="line">
            <span class="t">
              <TeamFlag v-if="!m.awayPlaceholder" :code="m.away" size="sm" />
              <span class="nm" :class="{ win: winner(m) === 'a', ph: m.awayPlaceholder }">{{ m.awayPlaceholder ?? m.away }}</span>
            </span>
            <span class="sc" :class="{ win: winner(m) === 'a' }">{{ score(m, 'a') }}</span>
          </div>
          <div v-if="note(m)" class="bnote">{{ note(m) }}</div>
        </button>
      </div>
    </div>

    <div v-else class="empty card">
      <span class="eicon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6v6H4z" /><path d="M4 13h6v6H4z" /><path d="M14 9h6M17 9v6M14 15h6" /></svg>
      </span>
      <div class="et">Tabellone non ancora disponibile</div>
      <p class="muted es">Gli accoppiamenti dai sedicesimi alla finale compaiono quando il calendario della fase a eliminazione è pubblicato (dopo i gironi).</p>
    </div>
  </div>
</template>

<style scoped>
.title { padding: 8px 2px 6px; }
.sub { font-size: 13px; margin-top: 2px; }
.board {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 18px 16px;
  margin: 0 -16px;
}
.col {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 14px;
  flex-shrink: 0;
  width: 188px;
}
.rname { text-align: center; margin-bottom: 2px; }
.bm {
  border-radius: var(--r-sm);
  padding: 12px 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
  text-align: left;
}
.line { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.t { display: flex; align-items: center; gap: 9px; min-width: 0; }
.nm { font-size: 13px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nm.win { font-weight: 900; color: var(--coral); }
.nm.ph { font-weight: 700; color: var(--muted); }
.sc { font-size: 15px; font-weight: 900; color: var(--muted); min-width: 14px; text-align: center; }
.sc.win { color: var(--coral); }
.bnote {
  font-size: 10px;
  font-weight: 700;
  color: var(--muted);
  text-align: center;
  padding-top: 5px;
  border-top: 0.5px solid var(--border);
}
.empty {
  margin-top: 16px;
  padding: 40px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
.eicon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
}
.et { font-size: 16px; font-weight: 700; }
.es { font-size: 13px; max-width: 280px; margin: 0; line-height: 1.5; }
</style>
