// Formattazione orari/date in fuso Europe/Rome (requisito di prodotto).

const TZ = 'Europe/Rome'

const timeFmt = new Intl.DateTimeFormat('it-IT', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
})
const dayFmt = new Intl.DateTimeFormat('it-IT', {
  timeZone: TZ,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const shortDayFmt = new Intl.DateTimeFormat('it-IT', {
  timeZone: TZ,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

export function romeTime(iso: string): string {
  return timeFmt.format(new Date(iso))
}

export function romeDayLabel(iso: string): string {
  const s = dayFmt.format(new Date(iso))
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function romeShortDay(iso: string): string {
  return shortDayFmt.format(new Date(iso))
}

/** Chiave giorno YYYY-MM-DD nel fuso di Roma, per raggruppare il calendario. */
export function romeDayKey(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
  return parts // en-CA → "2026-06-15"
}

export function todayKey(now = new Date()): string {
  return romeDayKey(now.toISOString())
}

/** L'ora di Roma è notturna (>=22 o <6)? Per il badge giorno/notte. */
export function isNight(iso: string): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('it-IT', { timeZone: TZ, hour: '2-digit', hour12: false }).format(
      new Date(iso),
    ),
  )
  return hour >= 22 || hour < 6
}

export interface Countdown {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function countdownTo(iso: string, now = Date.now()): Countdown {
  let r = Math.max(0, new Date(iso).getTime() - now)
  const total = r
  const days = Math.floor(r / 86400000); r -= days * 86400000
  const hours = Math.floor(r / 3600000); r -= hours * 3600000
  const minutes = Math.floor(r / 60000); r -= minutes * 60000
  const seconds = Math.floor(r / 1000)
  return { total, days, hours, minutes, seconds }
}

export const pad2 = (n: number): string => String(n).padStart(2, '0')
