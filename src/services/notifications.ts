import { db } from '@/db/dexie'
import { teamName } from '@/data/teams'
import { romeTime, romeDayKey, todayKey } from '@/services/time'
import type { Match } from '@/types'

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function permission(): NotificationPermission {
  return isSupported() ? Notification.permission : 'denied'
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

/** Ora corrente a Roma in formato 24h (per la soglia di mezzogiorno). */
function romeHourNow(): number {
  return Number(
    new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
  )
}

async function show(title: string, body: string, tag: string): Promise<void> {
  const reg = await navigator.serviceWorker?.getRegistration?.()
  const opts: NotificationOptions = { body, tag, icon: './icons/icon.svg', badge: './favicon.svg' }
  if (reg) await reg.showNotification(title, opts)
  else new Notification(title, opts)
}

/**
 * Promemoria best-effort: a/oltre mezzogiorno (ora di Roma) del giorno della gara,
 * notifica le partite preferite non ancora segnalate. Stato persistito in IndexedDB.
 *
 * Limite noto: ad app completamente chiusa l'orario esatto non è garantito.
 */
export async function checkAndNotify(matches: Match[]): Promise<void> {
  if (!isSupported() || permission() !== 'granted') return

  const enabled = (await db.settings.get('notif:noon'))?.value
  if (enabled === false) return
  if (romeHourNow() < 12) return

  const today = todayKey()
  const favTeams = new Set((await db.favoriteTeams.toArray()).map((t) => t.code))
  const favMatches = new Set((await db.favoriteMatches.toArray()).map((m) => m.matchId))

  for (const m of matches) {
    if (m.status === 'ft') continue
    if (romeDayKey(m.kickoff) !== today) continue
    const isFav = favMatches.has(m.id) || favTeams.has(m.home) || favTeams.has(m.away)
    if (!isFav) continue
    if (await db.notified.get(m.id)) continue

    await show(
      'Oggi giochi i preferiti ⚽',
      `${teamName(m.home)} – ${teamName(m.away)} alle ${romeTime(m.kickoff)} (ora italiana)`,
      `match-${m.id}`,
    )
    await db.notified.put({ matchId: m.id, at: Date.now() })
  }
}

const goalKey = (id: string) => `goals:${id}`

async function isFavorite(m: Match): Promise<boolean> {
  const favTeams = new Set((await db.favoriteTeams.toArray()).map((t) => t.code))
  if (favTeams.has(m.home) || favTeams.has(m.away)) return true
  return !!(await db.favoriteMatches.get(m.id))
}

/**
 * Notifica gol in tempo reale (best-effort, solo ad app aperta): confronta il
 * totale gol delle gare LIVE preferite con la baseline salvata; a ogni
 * incremento mostra una notifica. Richiede polling esterno (vedi App.vue).
 */
export async function checkGoals(matches: Match[]): Promise<void> {
  if (!isSupported() || permission() !== 'granted') return
  if ((await db.settings.get('notif:goals'))?.value !== true) return

  for (const m of matches) {
    if (m.status !== 'live') continue
    if (!(await isFavorite(m))) continue

    const total = (m.hs ?? 0) + (m.as ?? 0)
    const prev = (await db.settings.get(goalKey(m.id)))?.value as number | undefined
    if (prev == null) {
      await db.settings.put({ key: goalKey(m.id), value: total }) // baseline, no notifica
      continue
    }
    if (total > prev) {
      await show(
        'GOL! ⚽',
        `${teamName(m.home)} ${m.hs ?? 0} - ${m.as ?? 0} ${teamName(m.away)} (${m.minute ?? ''}')`,
        `goal-${m.id}`,
      )
      await db.settings.put({ key: goalKey(m.id), value: total })
    }
  }
}
