<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SegmentedControl from '@/components/SegmentedControl.vue'
import TeamFlag from '@/components/TeamFlag.vue'
import { useMatchesStore } from '@/stores/matches'
import { teamName } from '@/data/teams'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const matches = useMatchesStore()
const { t } = useI18n()
const view = ref('gironi')

function barColor(i: number): string {
  if (i < 2) return 'var(--turq)'
  if (i === 2) return 'var(--gold)'
  return 'transparent'
}
function rankColor(i: number): string {
  return i === 0 ? '#F4C94B' : i === 1 ? '#C9C8C2' : i === 2 ? '#E0A56B' : 'var(--surface)'
}
function openTeam(code: string) {
  router.push({ name: 'squadra', params: { code } })
}
</script>

<template>
  <div class="page">
    <h1 class="h1 title">{{ $t('classifiche.title') }}</h1>
    <SegmentedControl
      v-model="view"
      :options="[
        { key: 'gironi', label: t('classifiche.groups') },
        { key: 'marcatori', label: t('classifiche.scorers') },
      ]"
      class="seg"
    />

    <div v-if="view === 'gironi'" class="groups">
      <div v-for="g in matches.standings" :key="g.group" class="gcard card">
        <div class="ghd">
          <span class="gname">Gruppo {{ g.group }}</span>
          <div class="cols head">
            <span>G</span><span>V</span><span>N</span><span>P</span><span>GF</span><span>GS</span><span class="pt">Pt</span>
          </div>
        </div>
        <button v-for="(r, i) in g.rows" :key="r.code" class="row" @click="openTeam(r.code)">
          <span class="bar" :style="{ background: barColor(i) }" />
          <span class="pos">{{ i + 1 }}</span>
          <TeamFlag :code="r.code" />
          <span class="code">{{ r.code }}</span>
          <div class="cols">
            <span>{{ r.g }}</span><span>{{ r.v }}</span><span>{{ r.n }}</span><span>{{ r.p }}</span>
            <span>{{ r.gf }}</span><span>{{ r.gs }}</span><span class="pt">{{ r.pt }}</span>
          </div>
        </button>
        <div class="legend">
          <span><span class="ld" style="background: var(--turq)" />{{ $t('classifiche.qualified') }}</span>
          <span><span class="ld" style="background: var(--gold)" />{{ $t('classifiche.playoff') }}</span>
        </div>
      </div>
    </div>

    <div v-else class="card scorers">
      <button v-for="(s, i) in matches.scorers" :key="s.player + s.team" class="srow" @click="openTeam(s.team)">
        <span class="rank" :style="{ background: rankColor(i), color: i < 3 ? '#111' : 'var(--muted)' }">{{ i + 1 }}</span>
        <TeamFlag :code="s.team" />
        <div class="sinfo">
          <div class="sname">{{ s.player }}</div>
          <div class="muted steam">{{ teamName(s.team) }}</div>
        </div>
        <div class="goals"><span class="g">{{ s.goals }}</span><span class="muted">{{ $t('classifiche.goals') }}</span></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.title {
  padding: 8px 2px 14px;
}
.seg {
  margin-bottom: 18px;
}
.groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.gcard {
  padding: 6px 14px 10px;
}
.ghd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 2px 9px;
}
.gname {
  font-size: 16px;
  font-weight: 900;
}
.cols {
  display: flex;
  gap: 7px;
  width: 158px;
  justify-content: space-between;
  text-align: center;
  font-size: 12.5px;
  color: var(--muted);
}
.cols span {
  width: 16px;
}
.cols .pt {
  width: 20px;
  font-weight: 900;
  color: var(--text);
}
.cols.head {
  font-size: 11px;
  font-weight: 700;
}
.cols.head .pt {
  color: var(--text);
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-top: 0.5px solid var(--border);
  width: 100%;
  background: none;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
.bar {
  width: 3px;
  height: 22px;
  border-radius: 999px;
  flex-shrink: 0;
}
.pos {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  width: 12px;
}
.code {
  font-size: 14px;
  font-weight: 900;
  flex: 1;
  text-align: left;
}
.legend {
  display: flex;
  gap: 14px;
  padding: 11px 2px 4px;
  border-top: 0.5px solid var(--border);
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
}
.ld {
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
.scorers {
  padding: 6px 16px;
}
.srow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-top: 0.5px solid var(--border);
  width: 100%;
  background: none;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
.srow:first-child {
  border-top: 0;
}
.rank {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
}
.sinfo {
  flex: 1;
  text-align: left;
}
.sname {
  font-size: 15px;
  font-weight: 900;
}
.steam {
  font-size: 12px;
}
.goals {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.goals .g {
  font-size: 22px;
  font-weight: 900;
  color: var(--coral);
}
.goals .muted {
  font-size: 11px;
  font-weight: 700;
}
</style>
