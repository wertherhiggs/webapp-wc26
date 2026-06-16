<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '@/components/MatchCard.vue'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { useFavoritesStore } from '@/stores/favorites'
import { teamName } from '@/data/teams'
import { romeShortDay } from '@/services/time'
import newsJson from '@/data/team-news.json'
import type { NewsLink } from '@/types'

const props = defineProps<{ code: string }>()
const router = useRouter()
const matches = useMatchesStore()
const favorites = useFavoritesStore()

const teamMatches = computed(() => matches.matchesForTeam(props.code))
const group = computed(() => teamMatches.value.find((m) => m.group)?.group ?? '—')
const next = computed(() => teamMatches.value.filter((m) => m.status !== 'ft'))
const last = computed(() =>
  teamMatches.value
    .filter((m) => m.status === 'ft')
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff)),
)
const isFav = computed(() => favorites.isTeamFav(props.code))

const news = computed<NewsLink[]>(() => {
  const map = newsJson as Record<string, NewsLink[]>
  return (
    map[props.code] ?? [
      { name: `${teamName(props.code)} — Sito ufficiale`, site: 'Federazione nazionale', url: 'https://www.fifa.com/' },
      { name: 'FIFA.com', site: 'Scheda squadra e statistiche', url: 'https://www.fifa.com/' },
    ]
  )
})

function resultFor(m: { home: string; away: string; hs?: number; as?: number }) {
  const isHome = m.home === props.code
  const gf = (isHome ? m.hs : m.as) ?? 0
  const gs = (isHome ? m.as : m.hs) ?? 0
  const opp = isHome ? m.away : m.home
  const res = gf > gs ? 'V' : gf < gs ? 'P' : 'N'
  return { opp, score: `${gf} - ${gs}`, res }
}
</script>

<template>
  <div class="page">
    <button class="back" @click="router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      <span>{{ $t('common.back') }}</span>
    </button>

    <div class="hdr">
      <TeamFlag :code="code" size="lg" />
      <div class="ht">
        <div class="h1">{{ teamName(code) }}</div>
        <div class="muted">Gruppo {{ group }} · FIFA World Cup 2026</div>
      </div>
    </div>
    <button class="follow" :class="{ on: isFav }" @click="favorites.toggleTeam(code)">
      <svg width="17" height="17" viewBox="0 0 24 24" :fill="isFav ? '#111' : 'none'" :stroke="isFav ? '#111' : 'var(--text)'" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z" /></svg>
      {{ isFav ? $t('squadra.following') : $t('squadra.follow') }}
    </button>

    <h2 class="h2 sec">{{ $t('squadra.next') }}</h2>
    <div class="list">
      <MatchCard v-for="m in next" :key="m.id" :match="m" />
      <p v-if="next.length === 0" class="muted none">Nessuna gara in programma.</p>
    </div>

    <h2 class="h2 sec">{{ $t('squadra.last') }}</h2>
    <div v-if="last.length" class="card lastbox">
      <button v-for="m in last" :key="m.id" class="lrow" @click="router.push({ name: 'dettaglio', params: { id: m.id } })">
        <span class="res" :class="resultFor(m).res">{{ resultFor(m).res }}</span>
        <TeamFlag :code="resultFor(m).opp" />
        <span class="opp">{{ resultFor(m).opp }}</span>
        <span class="lscore">{{ resultFor(m).score }}</span>
        <span class="muted when">{{ romeShortDay(m.kickoff) }}</span>
      </button>
    </div>
    <div v-else class="card emptybox muted">{{ $t('squadra.noLast') }}</div>

    <h2 class="h2 sec">{{ $t('squadra.news') }}</h2>
    <div class="list">
      <a v-for="n in news" :key="n.url" class="nrow card" :href="n.url" target="_blank" rel="noopener">
        <span class="nicon">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
        </span>
        <div class="ninfo"><div class="nname">{{ n.name }}</div><div class="muted nsite">{{ n.site }}</div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg>
      </a>
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
.hdr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
  margin-bottom: 18px;
}
.ht { text-align: center; }
.follow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 26px;
}
.follow.on {
  background: var(--gold);
  color: #111;
  border-color: var(--gold);
}
.sec { margin: 0 2px 12px; }
.list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 26px; }
.none { padding: 4px 2px; }
.lastbox { padding: 4px 16px; margin-bottom: 26px; }
.lrow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-top: 0.5px solid var(--border);
  width: 100%;
  background: none;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
.lrow:first-child { border-top: 0; }
.res {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
}
.res.V { background: rgba(45, 158, 74, 0.16); color: var(--rai); }
.res.P { background: rgba(232, 66, 66, 0.16); color: var(--err); }
.res.N { background: rgba(136, 136, 128, 0.16); color: var(--muted); }
.opp { flex: 1; text-align: left; font-size: 14px; font-weight: 700; }
.lscore { font-size: 16px; font-weight: 900; }
.when { width: 56px; text-align: right; font-size: 12px; }
.emptybox { padding: 28px; text-align: center; margin-bottom: 26px; font-size: 13px; }
.nrow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 15px;
  border-radius: 18px;
  text-decoration: none;
  color: var(--text);
}
.nicon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ninfo { flex: 1; }
.nname { font-size: 14px; font-weight: 700; }
.nsite { font-size: 12px; }
</style>
