<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { usePredictionsStore } from '@/stores/predictions'
import { getTv } from '@/data/tv'
import { romeTime } from '@/services/time'

const router = useRouter()
const matches = useMatchesStore()
const predictions = usePredictionsStore()

const toPredict = computed(() => matches.scheduledMatches)
const history = computed(() => predictions.buildHistory(matches.matches))
const total = computed(() => history.value.reduce((s, h) => s + h.pts, 0))

const tagColor = (tag: string) =>
  tag === 'Esatto' ? 'var(--lime)' : tag === 'Risultato' ? 'var(--turq)' : 'var(--muted)'
</script>

<template>
  <div class="page">
    <h1 class="h1 title">{{ $t('pronostici.title') }}</h1>

    <div class="scorecard">
      <div>
        <div class="lbl">{{ $t('pronostici.score') }}</div>
        <div class="big">{{ total }}<span class="pt"> {{ $t('pronostici.pts') }}</span></div>
      </div>
      <div class="right">
        <div class="lbl">Pronostici</div>
        <div class="cnt">{{ history.length }}</div>
        <div class="sub">gare valutate</div>
      </div>
    </div>

    <h2 class="h2 sec">{{ $t('pronostici.toPredict') }}</h2>
    <div class="list">
      <div v-for="m in toPredict" :key="m.id" class="pc card">
        <div class="phd">
          <span class="label">{{ romeTime(m.kickoff) }} · {{ getTv(m).canale }}</span>
          <span v-if="getTv(m).inChiaro" class="rai">RAI</span>
        </div>
        <div class="prow">
          <div class="side" @click="router.push({ name: 'squadra', params: { code: m.home } })">
            <TeamFlag :code="m.home" size="xl" /><span class="code">{{ m.home }}</span>
          </div>
          <div class="stepper">
            <div class="col">
              <button class="pm" @click="predictions.bump(m.id, 'h', 1)">+</button>
              <span class="num">{{ predictions.get(m.id).h }}</span>
              <button class="pm minus" @click="predictions.bump(m.id, 'h', -1)">−</button>
            </div>
            <span class="colon">:</span>
            <div class="col">
              <button class="pm" @click="predictions.bump(m.id, 'a', 1)">+</button>
              <span class="num">{{ predictions.get(m.id).a }}</span>
              <button class="pm minus" @click="predictions.bump(m.id, 'a', -1)">−</button>
            </div>
          </div>
          <div class="side" @click="router.push({ name: 'squadra', params: { code: m.away } })">
            <TeamFlag :code="m.away" size="xl" /><span class="code">{{ m.away }}</span>
          </div>
        </div>
        <div v-if="predictions.map[m.id]" class="saved">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rai)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11" /></svg>
          {{ $t('pronostici.saved') }}
        </div>
      </div>
      <p v-if="toPredict.length === 0" class="muted none">Nessuna gara da pronosticare.</p>
    </div>

    <h2 class="h2 sec">{{ $t('pronostici.history') }}</h2>
    <div v-if="history.length" class="card hist">
      <div v-for="h in history" :key="h.matchId" class="hrow">
        <div><div class="hlabel">{{ h.label }}</div><div class="muted hyou">{{ h.you }}</div></div>
        <div class="hr">
          <span class="tag" :style="{ color: tagColor(h.tag) }">{{ h.tag }}</span>
          <span class="hpts" :style="{ color: h.pts > 0 ? tagColor(h.tag) : 'var(--muted)' }">+{{ h.pts }}</span>
        </div>
      </div>
    </div>
    <div v-else class="card emptybox muted">Ancora nessun pronostico valutato.</div>
  </div>
</template>

<style scoped>
.title { padding: 8px 2px 14px; }
.sec { margin: 0 2px 12px; }
.scorecard {
  background: var(--viola);
  border-radius: var(--r-card);
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  color: #fff;
}
.scorecard .lbl {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}
.scorecard .big { font-size: 44px; font-weight: 900; line-height: 1.05; }
.scorecard .pt { font-size: 18px; font-weight: 700; color: rgba(255, 255, 255, 0.8); }
.right { text-align: right; }
.cnt { font-size: 24px; font-weight: 900; color: var(--lime); }
.sub { font-size: 11px; color: rgba(255, 255, 255, 0.7); }
.list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.none { padding: 4px 2px; }
.pc { padding: 16px; }
.phd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.rai {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--rai);
  color: #fff;
}
.prow {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}
.side { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.code { font-size: 13px; font-weight: 700; }
.stepper { display: flex; align-items: center; gap: 10px; }
.col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.pm {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--surface);
  border: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.pm.minus { color: var(--muted); }
.num { font-size: 26px; font-weight: 900; min-width: 24px; text-align: center; }
.colon { font-size: 20px; font-weight: 700; color: var(--muted); }
.saved {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 0.5px solid var(--border);
  font-size: 12px;
  font-weight: 700;
  color: var(--rai);
}
.hist { padding: 4px 16px; }
.hrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 0;
  border-top: 0.5px solid var(--border);
}
.hrow:first-child { border-top: 0; }
.hlabel { font-size: 14px; font-weight: 900; }
.hyou { font-size: 12px; }
.hr { display: flex; align-items: center; gap: 10px; }
.tag { font-size: 11px; font-weight: 700; text-transform: uppercase; }
.hpts { font-size: 16px; font-weight: 900; min-width: 32px; text-align: right; }
.emptybox { padding: 28px; text-align: center; font-size: 13px; }
</style>
