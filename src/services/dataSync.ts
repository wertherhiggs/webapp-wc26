import { db } from '@/db/dexie'
import { SEED_MATCHES, SEED_EVENTS } from '@/data/seed'
import venuesJson from '@/data/venues.json'
import { NAME_TO_CODE } from '@/data/team-codes'
import type { Match, MatchEvent, Venue, EventKind } from '@/types'

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

// --- Schema reale openfootball 2026 (2026/worldcup.json) ---
interface OfGoal {
  name: string
  minute?: string | number
  penalty?: boolean
  owngoal?: boolean
}
interface OfMatch {
  round?: string
  num?: number
  date?: string
  time?: string // es. "13:00 UTC-6"
  team1?: string
  team2?: string
  score?: { ft?: [number, number]; ht?: [number, number] }
  goals1?: OfGoal[]
  goals2?: OfGoal[]
  group?: string
  ground?: string
}
interface OfData {
  name?: string
  matches?: OfMatch[]
}

/** Nome squadra openfootball (inglese) → codice 3 lettere. Fallback: prime 3 lettere. */
function codeFor(name?: string): string | null {
  if (!name) return null
  const known = NAME_TO_CODE[name.trim()]
  if (known) return known
  const letters = name.replace(/[^A-Za-z]/g, '')
  return letters ? letters.slice(0, 3).toUpperCase() : null
}

/** "13:00 UTC-6" / "21:00 UTC+2" / "18:00" → ISO UTC. */
function toUtcIso(date?: string, time?: string): string | null {
  if (!date) return null
  const m = /^(\d{1,2}):(\d{2})(?:\s*UTC([+-]\d{1,2}))?/.exec((time ?? '').trim())
  const [y, mo, d] = date.split('-').map(Number)
  if (!y || !mo || !d) return null
  const hh = m ? Number(m[1]) : 18
  const mm = m ? Number(m[2]) : 0
  const off = m && m[3] ? Number(m[3]) : 0 // ora locale = UTC+off → UTC = locale − off
  return new Date(Date.UTC(y, mo - 1, d, hh - off, mm)).toISOString()
}

/** Round di eliminazione dal numero gara (formato 2026). */
function stageOf(num: number): string | undefined {
  if (num >= 73 && num <= 88) return 'R32'
  if (num >= 89 && num <= 96) return 'R16'
  if (num >= 97 && num <= 100) return 'QF'
  if (num >= 101 && num <= 102) return 'SF'
  if (num === 103) return '3P'
  if (num === 104) return 'F'
  return undefined
}

function minNumOf(minute?: string | number): number {
  if (minute == null) return 0
  const m = /(\d+)/.exec(String(minute))
  return m ? Number(m[1]) : 0
}

function goalEvents(matchId: string, goals: OfGoal[] | undefined, side: 'home' | 'away'): MatchEvent[] {
  return (goals ?? []).map((g) => {
    const kind: EventKind = g.owngoal ? 'own_goal' : g.penalty ? 'penalty' : 'goal'
    return {
      matchId,
      kind,
      side,
      min: `${minNumOf(g.minute)}'`,
      minNum: minNumOf(g.minute),
      player: g.name,
      detail: g.penalty ? 'Su calcio di rigore' : g.owngoal ? 'Autogol' : undefined,
    }
  })
}

interface Mapped {
  matches: Match[]
  events: MatchEvent[]
}

function mapOpenFootball(data: OfData): Mapped {
  const matches: Match[] = []
  const events: MatchEvent[] = []
  let autoNum = 0 // assegna numero progressivo alle gare prive di `num` (gironi)

  for (const m of data.matches ?? []) {
    const home = codeFor(m.team1)
    const away = codeFor(m.team2)
    const kickoff = toUtcIso(m.date, m.time)
    if (!home || !away || !kickoff) continue

    const num = m.num ?? ++autoNum
    const id = `of${num}`
    const ft = m.score?.ft
    const played = Array.isArray(ft) && ft.length === 2
    const stage = stageOf(num)
    // Nel knockout le squadre possono essere segnaposto ("Winner Group A", "1A"):
    // se il nome non è una nazione nota lo conserviamo come placeholder.
    const homeResolved = !!NAME_TO_CODE[(m.team1 ?? '').trim()]
    const awayResolved = !!NAME_TO_CODE[(m.team2 ?? '').trim()]

    matches.push({
      id,
      num,
      kickoff,
      status: played ? 'ft' : 'sched',
      home,
      away,
      hs: played ? ft![0] : undefined,
      as: played ? ft![1] : undefined,
      group: m.group ? m.group.replace(/^Group\s+/i, '').trim() : null,
      stage,
      homePlaceholder: stage && !homeResolved ? m.team1 : undefined,
      awayPlaceholder: stage && !awayResolved ? m.team2 : undefined,
    })
    events.push(...goalEvents(id, m.goals1, 'home'), ...goalEvents(id, m.goals2, 'away'))
  }
  return { matches, events }
}

/**
 * Aggiorna i dati da openfootball (best-effort). Su successo sostituisce il
 * dataset (seed o sync precedente) per evitare id misti. In caso di errore o
 * dati insufficienti mantiene quanto già presente.
 * @returns true se ha applicato dati remoti.
 */
export async function sync(): Promise<boolean> {
  await ensureSeeded()
  try {
    const res = await fetch(OPENFOOTBALL_URL, { cache: 'no-cache' })
    if (!res.ok) return false
    const data = (await res.json()) as OfData
    const { matches, events } = mapOpenFootball(data)
    // Applica solo se plausibile (il Mondiale ha 104 gare) per non svuotare la UI.
    if (matches.length < 32) return false

    await db.transaction('rw', db.matches, db.events, async () => {
      await db.matches.clear()
      await db.matches.bulkPut(matches)
      await db.events.clear()
      if (events.length) await db.events.bulkAdd(events)
    })
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
