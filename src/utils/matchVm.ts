import type { Match, MatchEvent } from '@/types'

export interface ScorerLite {
  player: string
  min: string
}

export interface StatusVm {
  label: string
  /** classe CSS per lo stato: usata da MatchCard per i colori */
  cls: 'live' | 'ft' | 'sched'
}

export function statusVm(m: Match): StatusVm {
  if (m.status === 'live') return { label: `Live ${m.minute ?? ''}'`.trim(), cls: 'live' }
  if (m.status === 'ft') return { label: 'Finita', cls: 'ft' }
  return { label: 'In programma', cls: 'sched' }
}

export const showScore = (m: Match): boolean => m.status === 'live' || m.status === 'ft'

/** Marcatori per lato (gol e rigori), per il footer della card. */
export function goalFooter(events: MatchEvent[]): { home: ScorerLite[]; away: ScorerLite[] } {
  const home: ScorerLite[] = []
  const away: ScorerLite[] = []
  for (const e of events) {
    if (e.kind !== 'goal' && e.kind !== 'penalty') continue
    const target = e.side === 'home' ? home : away
    target.push({ player: e.player, min: e.min })
  }
  return { home, away }
}
