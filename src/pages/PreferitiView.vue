<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TeamFlag from '@/components/TeamFlag.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useMatchesStore } from '@/stores/matches'
import { useSettingsStore } from '@/stores/settings'
import { teamName } from '@/data/teams'
import { romeShortDay, romeTime } from '@/services/time'
import { requestPermission } from '@/services/notifications'

const router = useRouter()
const favorites = useFavoritesStore()
const matches = useMatchesStore()
const settings = useSettingsStore()

const followed = computed(() =>
  [...favorites.teams].map((code) => {
    const next = matches.matchesForTeam(code).find((m) => m.status !== 'ft')
    return {
      code,
      name: teamName(code),
      sub: next
        ? `Prossima: vs ${next.home === code ? next.away : next.home} · ${romeShortDay(next.kickoff)} ${romeTime(next.kickoff)}`
        : 'Nessuna gara in programma',
    }
  }),
)

async function onToggleNoon(v: boolean) {
  if (v) {
    const perm = await requestPermission()
    if (perm !== 'granted') return
  }
  settings.notifNoon = v
}
async function onToggleGoals(v: boolean) {
  if (v) {
    const perm = await requestPermission()
    if (perm !== 'granted') return
  }
  settings.notifGoals = v
}
</script>

<template>
  <div class="page">
    <div class="title">
      <h1 class="h1">{{ $t('preferiti.title') }}</h1>
      <button class="theme" @click="settings.toggleTheme()">
        <svg v-if="settings.theme === 'dark'" width="15" height="15" viewBox="0 0 24 24" fill="var(--gold)"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" /></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" /></svg>
        {{ settings.theme === 'dark' ? $t('settings.dark') : $t('settings.light') }}
      </button>
    </div>

    <h2 class="h2 sec">{{ $t('preferiti.followed') }}</h2>
    <div v-if="followed.length === 0" class="empty card">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z" /></svg>
      <div class="et">{{ $t('preferiti.noTeams') }}</div>
      <p class="muted es">{{ $t('preferiti.noTeamsText') }}</p>
    </div>
    <div class="list">
      <div v-for="t in followed" :key="t.code" class="frow card" @click="router.push({ name: 'squadra', params: { code: t.code } })">
        <TeamFlag :code="t.code" />
        <div class="finfo"><div class="fname">{{ t.name }}</div><div class="muted fsub">{{ t.sub }}</div></div>
        <button class="rm" @click.stop="favorites.toggleTeam(t.code)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5 2.6 1-5.8L3.8 9.7l5.8-.8z" /></svg>
        </button>
      </div>
    </div>

    <h2 class="h2 sec">{{ $t('preferiti.countdown') }}</h2>
    <div class="card notif">
      <div class="nrow">
        <div class="ntxt">
          <div class="nb">{{ $t('preferiti.countdownRai') }}</div>
          <div class="muted ns">{{ settings.countdownRaiOnly ? $t('preferiti.countdownRaiSub') : $t('preferiti.countdownAllSub') }}</div>
        </div>
        <ToggleSwitch :model-value="settings.countdownRaiOnly" @update:model-value="(v: boolean) => (settings.countdownRaiOnly = v)" />
      </div>
    </div>

    <h2 class="h2 sec">{{ $t('preferiti.notifications') }}</h2>
    <div class="card notif">
      <div class="nrow">
        <div class="ntxt"><div class="nb">{{ $t('preferiti.notifNoon') }}</div><div class="muted ns">{{ $t('preferiti.notifNoonSub') }}</div></div>
        <ToggleSwitch :model-value="settings.notifNoon" @update:model-value="onToggleNoon" />
      </div>
      <div class="nrow bt">
        <div class="ntxt"><div class="nb">{{ $t('preferiti.notifGoals') }}</div><div class="muted ns">{{ $t('preferiti.notifGoalsSub') }}</div></div>
        <ToggleSwitch :model-value="settings.notifGoals" @update:model-value="onToggleGoals" />
      </div>
    </div>
    <p class="muted disc">{{ $t('preferiti.notifDisclaimer') }}</p>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 2px 14px;
}
.theme {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface);
  border: 0;
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
}
.sec { margin: 0 2px 12px; }
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 34px 20px;
  text-align: center;
  border-style: dashed;
  margin-bottom: 22px;
}
.et { font-size: 15px; font-weight: 700; }
.es { max-width: 220px; font-size: 13px; margin: 0; }
.list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.frow {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 15px;
  border-radius: 20px;
}
.finfo { flex: 1; }
.fname { font-size: 15px; font-weight: 900; }
.fsub { font-size: 12px; }
.rm {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: var(--surface);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.big {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 22px;
  text-align: left;
}
.pron { background: var(--viola); border: 0; color: #fff; }
.bicon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bicon.vio { background: rgba(255, 255, 255, 0.18); }
.bicon.turq { background: var(--turq); }
.btxt { flex: 1; }
.bb { font-size: 15px; font-weight: 900; }
.bb.dark { color: var(--text); }
.bsub { font-size: 12px; color: rgba(255, 255, 255, 0.8); }
.notif { padding: 4px 16px; margin-bottom: 8px; }
.nrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
}
.nrow.bt { border-top: 0.5px solid var(--border); }
.ntxt { flex: 1; }
.nb { font-size: 14px; font-weight: 700; }
.ns { font-size: 12px; }
.disc { font-size: 12px; padding: 0 2px; }
</style>
