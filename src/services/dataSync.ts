import { db } from '@/db/dexie'
import { SEED_MATCHES, SEED_EVENTS } from '@/data/seed'
import venuesJson from '@/data/venues.json'
import type { Match, Venue } from '@/types'

const OPENFOOTBALL_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'

/** Popola il DB con il seed al primo avvio (idempotente). */
export async function ensureSeeded(): Promise<void> {
  const count = await db.matches.count()
  if (count > 0) return
  await db.transaction('rw', db.matches, db.events, db.venues, async () => {
    await db.matches.bulkPut(SEED_MATCHES)
    await db.events.bulkAdd(SEED_EVENTS)
    await db.venues.bulkPut(venuesJson as Venue[])
  })
  await db.meta.put({ key: 'seed', lastSync: Date.now(), version: 'seed-1' })
}

interface OpenFootballMatch {
  num?: number
  date?: string
  time?: string
  group?: string
  team1?: string | { name?: string; code?: string }
  team2?: string | { name?: string; code?: string }
  score?: { ft?: [number, number] }
}
interface OpenFootballData {
  rounds?: { matches?: OpenFootballMatch[] }[]
}

function codeOf(team: OpenFootballMatch['team1']): string | null {
  if (!team) return null
  if (typeof team === 'string') return team.length === 3 ? team.toUpperCase() : null
  return team.code ? team.code.toUpperCase() : null
}

/** Converte un orario locale (date+time) in ISO UTC, assumendo Europe/Rome (CEST). */
function toUtcIso(date?: string, time?: string): string | null {
  if (!date) return null
  const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time : '18:00'
  // CEST = UTC+2 a giugno/luglio
  return `${date}T${t.padStart(5, '0')}:00+02:00`
}

function mapOpenFootball(data: OpenFootballData): Match[] {
  const out: Match[] = []
  for (const round of data.rounds ?? []) {
    for (const m of round.matches ?? []) {
      const home = codeOf(m.team1)
      const away = codeOf(m.team2)
      const kickoff = toUtcIso(m.date, m.time)
      if (!home || !away || !kickoff) continue
      const ft = m.score?.ft
      const played = Array.isArray(ft) && ft.length === 2
      out.push({
        id: m.num != null ? `of${m.num}` : `${home}-${away}-${m.date}`,
        num: m.num,
        kickoff: new Date(kickoff).toISOString(),
        status: played ? 'ft' : 'sched',
        home,
        away,
        hs: played ? ft![0] : undefined,
        as: played ? ft![1] : undefined,
        group: m.group ? m.group.replace(/^Group\s+/i, '').trim() : null,
      })
    }
  }
  return out
}

/**
 * Aggiorna i dati da fonte pubblica (best-effort). In caso di errore o dati
 * insufficienti mantiene quanto già presente (seed o sync precedente).
 * @returns true se ha applicato dati remoti.
 */
export async function sync(): Promise<boolean> {
  await ensureSeeded()
  try {
    const res = await fetch(OPENFOOTBALL_URL, { cache: 'no-cache' })
    if (!res.ok) return false
    const data = (await res.json()) as OpenFootballData
    const mapped = mapOpenFootball(data)
    // Applica solo se il dataset remoto è plausibile (evita di svuotare la UI).
    if (mapped.length < 32) return false
    await db.matches.bulkPut(mapped)
    await db.meta.put({
      key: 'openfootball',
      etag: res.headers.get('etag') ?? undefined,
      lastSync: Date.now(),
    })
    return true
  } catch {
    return false
  }
}

export async function lastSync(): Promise<number | undefined> {
  const meta = await db.meta.get('openfootball')
  return meta?.lastSync ?? (await db.meta.get('seed'))?.lastSync
}
