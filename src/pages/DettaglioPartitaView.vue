<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { getTv } from '@/data/tv'
import { teamName } from '@/data/teams'
import { statusVm, showScore } from '@/utils/matchVm'
import { romeTime } from '@/services/time'
import { SEED_LINEUPS } from '@/data/seed'
import type { EventKind } from '@/types'

const props = defineProps<{ id: string }>()
const router = useRouter()
const matches = useMatchesStore()

const match = computed(() => matches.getById(props.id))
const tv = computed(() => (match.value ? getTv(match.value) : null))
const status = computed(() => (match.value ? statusVm(match.value) : null))
const venue = computed(() => matches.venueById(match.value?.venueId))
const events = computed(() => matches.eventsFor(props.id))
const lineups = computed(() => SEED_LINEUPS[props.id])

function openTeam(code: string) {
  router.push({ name: 'squadra', params: { code } })
}

const highlightsUrl = computed(() => {
  const m = match.value
  if (!m) return 'https://www.youtube.com'
  const q = `${teamName(m.home)} ${teamName(m.away)} highlights World Cup 2026`
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
})

const evMeta: Record<EventKind, { bg: string; label: string }> = {
  goal: { bg: 'var(--lime)', label: 'Gol' },
  penalty: { bg: 'var(--lime)', label: 'Gol su rigore' },
  own_goal: { bg: 'var(--lime)', label: 'Autogol' },
  yellow: { bg: 'var(--gold)', label: 'Ammonizione' },
  red: { bg: 'var(--err)', label: 'Espulsione' },
  sub: { bg: 'var(--turq)', label: 'Sostituzione' },
}
function evText(kind: EventKind, player: string): string {
  const m = evMeta[kind]?.label ?? ''
  return `${m} — ${player}`
}
</script>

<template>
  <div v-if="match" class="page">
    <div class="topbar">
      <button class="back" @click="router.back()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        <span>{{ $t('common.back') }}</span>
      </button>
    </div>

    <div class="hero">
      <div class="center">
        <span class="status" :class="status?.cls">
          <span v-if="match.status === 'live'" class="dot blink" />{{ status?.label }}
        </span>
      </div>
      <div class="grid">
        <button class="team" @click="openTeam(match.home)"><TeamFlag :code="match.home" size="lg" /><span>{{ teamName(match.home) }}</span></button>
        <div class="score">
          <template v-if="showScore(match)">
            <span class="n">{{ match.hs }}</span><span class="d">-</span><span class="n">{{ match.as }}</span>
          </template>
          <span v-else class="time">{{ romeTime(match.kickoff) }}</span>
        </div>
        <button class="team" @click="openTeam(match.away)"><TeamFlag :code="match.away" size="lg" /><span>{{ teamName(match.away) }}</span></button>
      </div>
      <p class="taphint muted">Tocca una squadra per seguirla</p>
      <div class="chrow">
        <span class="chan"><span class="sq" :style="{ background: tv?.color }" />{{ tv?.canale }} · {{ romeTime(match.kickoff) }}</span>
        <span v-if="tv?.inChiaro" class="rai">{{ $t('common.freeRai') }}</span>
      </div>
      <button v-if="venue" class="venue" @click="router.push({ name: 'stadi' })">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9A92" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>
        {{ venue.city }} · {{ venue.stadium }}
      </button>
    </div>

    <h2 class="h2 sec">{{ $t('detail.report') }}</h2>
    <div class="card report">
      <template v-if="events.length">
        <div v-for="(e, i) in events" :key="i" class="ev">
          <span class="min">{{ e.min }}</span>
          <span class="icon" :style="{ background: evMeta[e.kind]?.bg }">
            <svg v-if="e.kind === 'goal' || e.kind === 'penalty'" width="13" height="13" viewBox="0 0 24 24" fill="#111"><circle cx="12" cy="12" r="9" fill="none" stroke="#111" stroke-width="2" /><path d="M12 7l3 2.2-1.1 3.5h-3.8L9 9.2z" /></svg>
            <span v-else-if="e.kind === 'yellow' || e.kind === 'red'" class="cardicon" />
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10l-3-3M17 17H7l3 3" /></svg>
          </span>
          <div class="etxt">
            <div class="eb">{{ evText(e.kind, e.player) }}</div>
            <div v-if="e.detail" class="muted es">{{ e.detail }}</div>
          </div>
        </div>
      </template>
      <p v-else class="muted nodata">{{ $t('common.noData') }}</p>
    </div>

    <template v-if="lineups">
      <h2 class="h2 sec">{{ $t('detail.lineups') }}</h2>
      <div class="lineups">
        <div v-for="side in [lineups.home, lineups.away]" :key="side.code" class="lu card">
          <div class="luhd"><TeamFlag :code="side.code" size="sm" /><span class="mod">{{ side.module }}</span></div>
          <div v-for="p in side.players" :key="p" class="player muted">{{ p }}</div>
        </div>
      </div>
    </template>

    <a class="hlbtn" :href="highlightsUrl" target="_blank" rel="noopener">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
      {{ $t('detail.highlights') }}
    </a>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 2px 14px;
}
.back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
}
.hero {
  background: #111111;
  border-radius: var(--r-card);
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 20px;
  color: #fff;
}
.hero .center {
  display: flex;
  justify-content: center;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.status.live { background: var(--coral); color: #fff; }
.status.ft { background: #222220; color: #cfcec8; }
.status.sched { background: #222220; color: #9a9a92; }
.dot { width: 6px; height: 6px; border-radius: 999px; background: #fff; }
.grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 900;
  text-align: center;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  padding: 0;
}
.taphint {
  text-align: center;
  font-size: 11px;
  color: #9a9a92;
  margin: -6px 0 0;
}
.score {
  display: flex;
  align-items: center;
  gap: 12px;
}
.score .n { font-size: 44px; font-weight: 900; color: var(--gold); line-height: 1; }
.score .d { font-size: 24px; font-weight: 700; color: #5a5a56; }
.time { font-size: 30px; font-weight: 900; color: var(--gold); }
.chrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.chan {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 999px;
  background: #222220;
  color: #e6e5df;
  font-size: 12px;
  font-weight: 700;
}
.sq { width: 7px; height: 7px; border-radius: 2px; }
.rai {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--rai);
  color: #fff;
}
.venue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: 0;
  color: #9a9a92;
  font-size: 12px;
  font-weight: 700;
}
.sec { margin: 0 2px 14px; }
.report { padding: 18px 16px; margin-bottom: 20px; }
.ev {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 14px;
}
.ev:last-child { padding-bottom: 0; }
.min { width: 34px; font-size: 13px; font-weight: 900; text-align: right; flex-shrink: 0; }
.icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cardicon { width: 9px; height: 12px; border-radius: 2px; background: #111; }
.etxt { flex: 1; padding-top: 2px; }
.eb { font-size: 14px; font-weight: 700; }
.es { font-size: 12px; margin-top: 1px; }
.nodata { text-align: center; padding: 8px 0; }
.lineups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.lu { padding: 14px 13px; }
.luhd { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.mod { font-size: 13px; font-weight: 900; }
.player {
  font-size: 12.5px;
  padding: 4px 0;
  border-top: 0.5px solid var(--border);
}
.hlbtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--coral);
  border-radius: 999px;
  padding: 15px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}
</style>
