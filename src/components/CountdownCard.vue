<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from './TeamFlag.vue'
import { getTv } from '@/data/tv'
import { countdownTo, romeShortDay, romeTime } from '@/services/time'
import { teamName } from '@/data/teams'
import type { Match } from '@/types'
const pad2 = (n: number) => String(n).padStart(2, '0')

const props = defineProps<{ match: Match; favTeam: string }>()
const router = useRouter()
const now = ref(Date.now())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => timer && clearInterval(timer))

const cd = computed(() => countdownTo(props.match.kickoff, now.value))
const tv = computed(() => getTv(props.match))
const when = computed(
  () => `${romeShortDay(props.match.kickoff)} · ${romeTime(props.match.kickoff)} · ${tv.value.canale}`,
)
</script>

<template>
  <button class="cc" @click="router.push({ name: 'dettaglio', params: { id: match.id } })">
    <div class="hd">
      <span class="tag">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#F4C94B">
          <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z" />
        </svg>
        {{ $t('home.nextFav') }}
      </span>
      <span class="cdlabel">{{ $t('home.countdown') }}</span>
    </div>

    <div class="teams">
      <span class="t">
        <TeamFlag :code="match.home" size="sm" /><b>{{ match.home }}</b>
      </span>
      <span class="vs">{{ $t('common.vs') }}</span>
      <span class="t">
        <b>{{ match.away }}</b><TeamFlag :code="match.away" size="sm" />
      </span>
    </div>
    <div class="why">Perché segui <b>{{ teamName(favTeam) }}</b></div>

    <div class="boxes">
      <div class="box"><span class="n">{{ cd.days }}</span><span class="u">Giorni</span></div>
      <div class="box"><span class="n">{{ pad2(cd.hours) }}</span><span class="u">Ore</span></div>
      <div class="box"><span class="n">{{ pad2(cd.minutes) }}</span><span class="u">Min</span></div>
      <div class="box"><span class="n">{{ pad2(cd.seconds) }}</span><span class="u">Sec</span></div>
    </div>

    <div class="ft">
      <span class="info">{{ when }}</span>
      <span v-if="tv.inChiaro" class="rai">In chiaro RAI</span>
    </div>
  </button>
</template>

<style scoped>
.cc {
  width: 100%;
  background: #111111;
  border: 0;
  border-radius: var(--r-card);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #fff;
}
.hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
}
.cdlabel {
  font-size: 11px;
  font-weight: 700;
  color: #7a7a74;
}
.teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.t {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 16px;
  font-weight: 900;
}
.vs {
  font-size: 12px;
  font-weight: 700;
  color: #6e6e68;
}
.why {
  text-align: center;
  font-size: 11px;
  color: #8e8e86;
  margin-top: -4px;
}
.why b {
  color: #d8d7d1;
}
.boxes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.box {
  background: #222220;
  border-radius: 14px;
  padding: 10px 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.n {
  font-size: 26px;
  font-weight: 900;
  color: var(--gold);
  line-height: 1;
}
.u {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7a7a74;
}
.ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.info {
  font-size: 13px;
  font-weight: 500;
  color: #b6b6ae;
}
.rai {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--rai);
  color: #fff;
}
</style>
