<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from './TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { getTv } from '@/data/tv'
import { statusVm, showScore } from '@/utils/matchVm'
import { romeTime, romeShortDay } from '@/services/time'
import type { Match } from '@/types'

const props = withDefaults(
  defineProps<{ match: Match; flagSize?: 'sm' | 'md' | 'lg' | 'xl' }>(),
  { flagSize: 'xl' },
)
const router = useRouter()
const store = useMatchesStore()

const tv = computed(() => getTv(props.match))
const status = computed(() => statusVm(props.match))
const withScore = computed(() => showScore(props.match))
const footer = computed(() => store.footerFor(props.match.id))
const hasFooter = computed(
  () => footer.value.home.length + footer.value.away.length > 0,
)

function open() {
  router.push({ name: 'dettaglio', params: { id: props.match.id } })
}
</script>

<template>
  <button class="mc card" @click="open">
    <div class="top">
      <span class="status" :class="status.cls">
        <span v-if="match.status === 'live'" class="dot blink" />
        {{ status.label }}
      </span>
      <div class="chans">
        <span v-if="tv.inChiaro" class="rai">In chiaro RAI</span>
        <span class="chan">
          <span class="sq" :style="{ background: tv.color }" />{{ tv.canale }}
        </span>
      </div>
    </div>

    <div class="mid">
      <div class="team">
        <TeamFlag :code="match.home" :size="flagSize" />
        <span class="code">{{ match.home }}</span>
      </div>
      <div class="center">
        <template v-if="withScore">
          <div class="scorebox">
            <span class="sc">{{ match.hs }}</span>
            <span class="dash">-</span>
            <span class="sc">{{ match.as }}</span>
          </div>
          <span class="kowhen">{{ romeShortDay(match.kickoff) }} · {{ romeTime(match.kickoff) }}</span>
        </template>
        <template v-else>
          <span class="ora">{{ $t('common.italianTime') }}</span>
          <span class="time">{{ romeTime(match.kickoff) }}</span>
        </template>
      </div>
      <div class="team">
        <TeamFlag :code="match.away" :size="flagSize" />
        <span class="code">{{ match.away }}</span>
      </div>
    </div>

    <div v-if="hasFooter" class="foot">
      <div class="col left">
        <span v-for="(s, i) in footer.home" :key="'h' + i" class="sc-row">
          <span class="gdot" />{{ s.player }} {{ s.min }}
        </span>
      </div>
      <div class="col right">
        <span v-for="(s, i) in footer.away" :key="'a' + i" class="sc-row">
          {{ s.player }} {{ s.min }}<span class="gdot" />
        </span>
      </div>
    </div>
  </button>
</template>

<style scoped>
.mc {
  width: 100%;
  text-align: inherit;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.status.live {
  background: var(--coral);
  color: #fff;
}
.status.ft {
  background: #2a2a2a;
  color: #cfcec8;
}
.status.sched {
  background: var(--surface);
  color: var(--muted);
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #fff;
  display: inline-block;
}
.chans {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rai {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--rai);
  color: #fff;
  white-space: nowrap;
}
.chan {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.sq {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  display: inline-block;
}
.mid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
}
.code {
  font-size: 14px;
  font-weight: 700;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.scorebox {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--score-bg);
  border-radius: 12px;
  padding: 7px 16px;
}
.sc {
  font-size: 28px;
  font-weight: 900;
  color: var(--gold);
  line-height: 1;
}
.dash {
  font-size: 18px;
  font-weight: 700;
  color: #5a5a56;
}
.ora {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.kowhen {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 2px;
}
.time {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
}
.foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-top: 11px;
  border-top: 0.5px solid var(--border);
}
.col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.col.right {
  align-items: flex-end;
}
.sc-row {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: var(--muted);
}
.gdot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--lime);
  display: inline-block;
}
</style>
