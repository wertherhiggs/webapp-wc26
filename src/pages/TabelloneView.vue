<script setup lang="ts">
import { computed } from 'vue'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'

const matches = useMatchesStore()

interface Slot {
  code: string | null
  placeholder: string
}
interface BMatch {
  home: Slot
  away: Slot
  note?: string
}
interface Round {
  name: string
  matches: BMatch[]
}

const slot = (code: string | null, placeholder: string): Slot => ({ code, placeholder })

const bracket = computed<Round[]>(() => {
  const leaders = matches.standings.map((g) => ({
    group: g.group,
    first: g.rows[0]?.code ?? null,
    second: g.rows[1]?.code ?? null,
  }))

  // Ottavi: accoppiamento provvisorio 1°gruppo X vs 2°gruppo successivo
  const ottavi: BMatch[] = []
  for (let i = 0; i < leaders.length; i++) {
    const a = leaders[i]
    const b = leaders[(i + 1) % leaders.length]
    ottavi.push({
      home: slot(a.first, `1° ${a.group}`),
      away: slot(b.second, `2° ${b.group}`),
    })
  }

  const empties = (n: number, note: string): BMatch[] =>
    Array.from({ length: n }, () => ({
      home: slot(null, 'Da definire'),
      away: slot(null, 'Da definire'),
      note,
    }))

  return [
    { name: 'Ottavi', matches: ottavi.length ? ottavi : empties(4, 'A fine gironi') },
    { name: 'Quarti', matches: empties(Math.max(1, Math.ceil(ottavi.length / 2)), 'A fine gironi') },
    { name: 'Semifinale', matches: empties(2, 'A fine gironi') },
    { name: 'Finale', matches: [{ home: slot(null, '—'), away: slot(null, '—'), note: 'Dom 19 lug · New York' }] },
  ]
})
</script>

<template>
  <div class="page">
    <div class="title">
      <h1 class="h1">{{ $t('tabellone.title') }}</h1>
      <div class="muted sub">{{ $t('tabellone.scroll') }}</div>
    </div>

    <div class="note">Tabellone provvisorio: si popola al termine della fase a gironi.</div>

    <div data-hscroll class="board">
      <div v-for="r in bracket" :key="r.name" class="col">
        <div class="rname label">{{ r.name }}</div>
        <div v-for="(m, i) in r.matches" :key="i" class="bm card">
          <div class="line">
            <span class="t">
              <TeamFlag v-if="m.home.code" :code="m.home.code" size="sm" />
              <span class="ph" :class="{ filled: m.home.code }">{{ m.home.code ?? m.home.placeholder }}</span>
            </span>
          </div>
          <div class="line">
            <span class="t">
              <TeamFlag v-if="m.away.code" :code="m.away.code" size="sm" />
              <span class="ph" :class="{ filled: m.away.code }">{{ m.away.code ?? m.away.placeholder }}</span>
            </span>
          </div>
          <div v-if="m.note" class="bnote">{{ m.note }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  padding: 8px 2px 6px;
}
.sub {
  font-size: 13px;
  margin-top: 2px;
}
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
.rname {
  text-align: center;
  margin-bottom: 2px;
}
.bm {
  border-radius: var(--r-sm);
  padding: 12px 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.t {
  display: flex;
  align-items: center;
  gap: 9px;
}
.ph {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.ph.filled {
  font-weight: 900;
  color: var(--text);
}
.bnote {
  font-size: 10px;
  font-weight: 700;
  color: var(--muted);
  text-align: center;
  padding-top: 5px;
  border-top: 0.5px solid var(--border);
}
</style>
