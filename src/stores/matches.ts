import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/db/dexie'
import { ensureSeeded, sync as syncData, lastSync } from '@/services/dataSync'
import { goalFooter } from '@/utils/matchVm'
import { romeDayKey, todayKey } from '@/services/time'
import type {
  Match,
  MatchEvent,
  GroupStanding,
  ScorerRow,
  Venue,
} from '@/types'
import type { ComputeRequest, ComputeResult } from '@/workers/compute.worker'

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<Match[]>([])
  const events = ref<MatchEvent[]>([])
  const venues = ref<Venue[]>([])
  const standings = ref<GroupStanding[]>([])
  const scorers = ref<ScorerRow[]>([])
  const loaded = ref(false)
  const syncing = ref(false)
  const lastSyncAt = ref<number | undefined>(undefined)

  let worker: Worker | null = null
  function getWorker(): Worker {
    if (!worker) {
      worker = new Worker(new URL('../workers/compute.worker.ts', import.meta.url), {
        type: 'module',
      })
    }
    return worker
  }

  function compute(): Promise<void> {
    return new Promise((resolve) => {
      const w = getWorker()
      const onMsg = (ev: MessageEvent<ComputeResult>) => {
        standings.value = ev.data.standings
        scorers.value = ev.data.scorers
        w.removeEventListener('message', onMsg)
        resolve()
      }
      w.addEventListener('message', onMsg)
      const req: ComputeRequest = {
        matches: JSON.parse(JSON.stringify(matches.value)),
        events: JSON.parse(JSON.stringify(events.value)),
      }
      w.postMessage(req)
    })
  }

  async function reloadFromDb() {
    matches.value = await db.matches.toArray()
    events.value = await db.events.toArray()
    venues.value = await db.venues.toArray()
  }

  async function load() {
    if (loaded.value) return
    await ensureSeeded()
    await reloadFromDb()
    await compute()
    lastSyncAt.value = await lastSync()
    loaded.value = true
  }

  async function refresh() {
    if (syncing.value) return
    syncing.value = true
    try {
      await syncData()
      await reloadFromDb()
      await compute()
      lastSyncAt.value = await lastSync()
    } finally {
      syncing.value = false
    }
  }

  // --- getters ---
  const byId = computed(() => new Map(matches.value.map((m) => [m.id, m])))
  function getById(id: string): Match | undefined {
    return byId.value.get(id)
  }
  function eventsFor(id: string): MatchEvent[] {
    return events.value
      .filter((e) => e.matchId === id)
      .sort((a, b) => a.minNum - b.minNum)
  }
  function footerFor(id: string) {
    return goalFooter(eventsFor(id))
  }

  const sortedByKickoff = computed(() =>
    [...matches.value].sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
  )

  const todayMatches = computed(() => {
    const today = todayKey()
    return sortedByKickoff.value.filter((m) => romeDayKey(m.kickoff) === today)
  })

  /** Partite di oggi non ancora terminate (in programma o live). */
  const todayUpcoming = computed(() =>
    todayMatches.value.filter((m) => m.status !== 'ft'),
  )

  const recentMatches = computed(() =>
    [...matches.value]
      .filter((m) => m.status === 'ft')
      .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
      .slice(0, 4),
  )

  const liveCount = computed(() => matches.value.filter((m) => m.status === 'live').length)

  const scheduledMatches = computed(() =>
    sortedByKickoff.value.filter((m) => m.status === 'sched'),
  )

  /** Gare di eliminazione (con stage), ordinate per numero gara. */
  const knockoutMatches = computed(() =>
    matches.value
      .filter((m) => m.stage)
      .sort((a, b) => (a.num ?? 0) - (b.num ?? 0)),
  )

  function matchesForTeam(code: string): Match[] {
    return sortedByKickoff.value.filter((m) => m.home === code || m.away === code)
  }

  function venueById(id?: string): Venue | undefined {
    return id ? venues.value.find((v) => v.id === id) : undefined
  }

  return {
    matches, events, venues, standings, scorers, loaded, syncing, lastSyncAt,
    load, refresh, compute,
    getById, eventsFor, footerFor, matchesForTeam, venueById,
    todayMatches, todayUpcoming, recentMatches, liveCount, scheduledMatches, knockoutMatches, sortedByKickoff,
  }
})
