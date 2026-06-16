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

// --- Bracket reale (da dati openfootball) ---
const realRounds = computed(() =>
  STAGES.map((s) => ({
    name: s.name,
    matches: matches.knockoutMatches.filter((m) => m.stage === s.key),
  })).filter((r) => r.matches.length > 0),
)

// --- Proiezione provvisoria da classifiche (offline / pre-knockout) ---
interface Slot { code: string | null; placeholder: string }
interface BMatch { home: Slot; away: Slot; note?: string }
const slot = (code: string | null, placeholder: string): Slot => ({ code, placeholder })

const projection = computed(() => {
  const leaders = matches.standings.map((g) => ({
    group: g.group,
    first: g.rows[0]?.code ?? null,
    second: g.rows[1]?.code ?? null,
  }))
  const ottavi: BMatch[] = leaders.map((a, i) => {
    const b = leaders[(i + 1) % leaders.length]
    return { home: slot(a.first, `1° ${a.group}`), away: slot(b.second, `2° ${b.group}`) }
  })
  const empties = (n: number): BMatch[] =>
    Array.from({ length: n }, () => ({ home: slot(null, 'Da definire'), away: slot(null, 'Da definire'), note: 'A fine gironi' }))
  return [
    { name: 'Ottavi', matches: ottavi.length ? ottavi : empties(4) },
    { name: 'Quarti', matches: empties(Math.max(1, Math.ceil(ottavi.length / 2))) },
    { name: 'Semifinale', matches: empties(2) },
    { name: 'Finale', matches: [{ home: slot(null, '—'), away: slot(null, '—'), note: 'Dom 19 lug · New York' }] },
  ]
})

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
      <div class="muted sub">{{ $t('tabellone.scroll') }}</div>
    </div>

    <!-- Bracket reale -->
    <div v-if="hasReal" data-hscroll class="board">
      <div v-for="r in realRounds" :key="r.name" class="col">
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

    <!-- Proiezione provvisoria -->
    <template v-else>
      <div class="note">Tabellone provvisorio: si popola al termine della fase a gironi.</div>
      <div data-hscroll class="board">
        <div v-for="r in projection" :key="r.name" class="col">
          <div class="rname label">{{ r.name }}</div>
          <div v-for="(m, i) in r.matches" :key="i" class="bm card">
            <div class="line">
              <span class="t">
                <TeamFlag v-if="m.home.code" :code="m.home.code" size="sm" />
                <span class="nm" :class="{ ph: !m.home.code }">{{ m.home.code ?? m.home.placeholder }}</span>
              </span>
            </div>
            <div class="line">
              <span class="t">
                <TeamFlag v-if="m.away.code" :code="m.away.code" size="sm" />
                <span class="nm" :class="{ ph: !m.away.code }">{{ m.away.code ?? m.away.placeholder }}</span>
              </span>
            </div>
            <div v-if="m.note" class="bnote">{{ m.note }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.title { padding: 8px 2px 6px; }
.sub { font-size: 13px; margin-top: 2px; }
.note {
  background: var(--surface);
  border-radius: var(--r-sm);
  padding: 12px 14px;
  font-size: 13px;
  color: var(--muted);
  margin: 12px 0 4px;
}
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
</style>
