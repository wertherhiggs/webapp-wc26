<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MatchCard from '@/components/MatchCard.vue'
import CountdownCard from '@/components/CountdownCard.vue'
import { useMatchesStore } from '@/stores/matches'
import { useFavoritesStore } from '@/stores/favorites'
import { raiFreeCount } from '@/data/tv'
import { romeDayLabel } from '@/services/time'

const router = useRouter()
const matches = useMatchesStore()
const favorites = useFavoritesStore()

const todayLabel = computed(() => romeDayLabel(new Date().toISOString()))

const nextFav = computed(() =>
  matches.scheduledMatches.find(
    (m) =>
      favorites.matches.has(m.id) ||
      favorites.teams.has(m.home) ||
      favorites.teams.has(m.away),
  ),
)
const favTeamOf = computed(() => {
  const m = nextFav.value
  if (!m) return ''
  return favorites.teams.has(m.home) ? m.home : favorites.teams.has(m.away) ? m.away : m.home
})

const raiCount = raiFreeCount

const highlightsUrl =
  'https://www.youtube.com/results?search_query=FIFA+World+Cup+2026+highlights'
</script>

<template>
  <div class="page">
    <header class="hd">
      <div>
        <div class="label">{{ todayLabel }}</div>
        <h1 class="h1">{{ $t('common.today') }}</h1>
      </div>
      <span v-if="matches.liveCount > 0" class="live">
        <span class="dot blink" />{{ matches.liveCount }} {{ $t('common.live') }} ora
      </span>
    </header>

    <CountdownCard v-if="nextFav" :match="nextFav" :fav-team="favTeamOf" class="mb" />
    <div v-else class="empty card mb">
      <span class="star">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4C94B" stroke-width="1.7" stroke-linejoin="round">
          <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z" />
        </svg>
      </span>
      <div class="et">{{ $t('home.noFavTitle') }}</div>
      <p class="es">{{ $t('home.noFavText') }}</p>
      <button class="btn" @click="router.push({ name: 'preferiti' })">{{ $t('home.followTeam') }}</button>
    </div>

    <div class="secthd">
      <span class="h2">{{ $t('home.todayMatches') }}</span>
      <span class="muted sm">{{ matches.todayMatches.length }} {{ $t('common.matches') }}</span>
    </div>
    <div class="list mb">
      <MatchCard v-for="m in matches.todayMatches" :key="m.id" :match="m" flag-size="xl" />
      <p v-if="matches.todayMatches.length === 0" class="muted sm none">Nessuna partita oggi.</p>
    </div>

    <div class="secthd"><span class="h2">{{ $t('home.recent') }}</span></div>
    <div class="list mb">
      <MatchCard v-for="m in matches.recentMatches" :key="m.id" :match="m" flag-size="xl" />
      <a class="hl card" :href="highlightsUrl" target="_blank" rel="noopener">
        <span class="play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <div class="hltxt">
          <div class="b">{{ $t('home.highlights') }}</div>
          <div class="muted sm">{{ $t('home.highlightsSub') }}</div>
        </div>
        <svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </a>
    </div>

    <div class="banner">
      <span class="bicon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M9 21h6" stroke-linecap="round" /></svg>
      </span>
      <div>
        <div class="b">{{ raiCount }} partite in chiaro su RAI</div>
        <div class="muted sm">{{ $t('home.raiBannerSub') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 8px 2px 16px;
}
.live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 999px;
  background: var(--coral);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #fff;
  display: inline-block;
}
.mb {
  margin-bottom: 22px;
}
.secthd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.sm {
  font-size: 13px;
  font-weight: 700;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.none {
  padding: 8px 2px;
}
.empty {
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  text-align: center;
  background: #111111;
  border: 0;
  color: #fff;
}
.star {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #222220;
  display: flex;
  align-items: center;
  justify-content: center;
}
.et {
  font-size: 15px;
  font-weight: 700;
}
.es {
  font-size: 13px;
  color: #9a9a92;
  max-width: 260px;
  margin: 0;
  line-height: 1.5;
}
.btn {
  margin-top: 5px;
  padding: 11px 20px;
  border-radius: 999px;
  background: var(--gold);
  color: #111;
  font-size: 13px;
  font-weight: 700;
  border: 0;
}
.hl {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px 16px;
  text-decoration: none;
  color: var(--text);
}
.play {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--err);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hltxt {
  flex: 1;
}
.b {
  font-size: 14px;
  font-weight: 700;
}
.chev {
  color: var(--muted);
}
.banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--surface);
  border-radius: 20px;
  padding: 15px 16px;
}
.bicon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--rai);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
