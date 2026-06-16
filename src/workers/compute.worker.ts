/// <reference lib="webworker" />
import type { Match, MatchEvent, GroupStanding, StandingRow, ScorerRow } from '@/types'

export interface ComputeRequest {
  matches: Match[]
  events: MatchEvent[]
}
export interface ComputeResult {
  standings: GroupStanding[]
  scorers: ScorerRow[]
}

function emptyRow(code: string): StandingRow {
  return { code, g: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0, dr: 0, pt: 0 }
}

/** Classifiche gironi: solo gare concluse (status ft). */
function computeStandings(matches: Match[]): GroupStanding[] {
  const byGroup = new Map<string, Map<string, StandingRow>>()

  const ensure = (group: string, code: string) => {
    if (!byGroup.has(group)) byGroup.set(group, new Map())
    const g = byGroup.get(group)!
    if (!g.has(code)) g.set(code, emptyRow(code))
    return g.get(code)!
  }

  for (const m of matches) {
    if (!m.group || m.status !== 'ft' || m.hs == null || m.as == null) continue
    const h = ensure(m.group, m.home)
    const a = ensure(m.group, m.away)
    h.g++; a.g++
    h.gf += m.hs; h.gs += m.as
    a.gf += m.as; a.gs += m.hs
    if (m.hs > m.as) { h.v++; h.pt += 3; a.p++ }
    else if (m.hs < m.as) { a.v++; a.pt += 3; h.p++ }
    else { h.n++; a.n++; h.pt++; a.pt++ }
  }

  const result: GroupStanding[] = []
  for (const [group, rowsMap] of byGroup) {
    const rows = [...rowsMap.values()]
    rows.forEach((r) => (r.dr = r.gf - r.gs))
    rows.sort((x, y) => {
      if (y.pt !== x.pt) return y.pt - x.pt
      if (y.dr !== x.dr) return y.dr - x.dr
      if (y.gf !== x.gf) return y.gf - x.gf
      // scontri diretti tra i due
      const hh = headToHead(matches, x.code, y.code)
      if (hh !== 0) return hh
      return x.code.localeCompare(y.code)
    })
    result.push({ group, rows })
  }
  result.sort((a, b) => a.group.localeCompare(b.group))
  return result
}

/** Differenza punti negli scontri diretti tra due squadre (gare ft). */
function headToHead(matches: Match[], a: string, b: string): number {
  let ptA = 0, ptB = 0
  for (const m of matches) {
    if (m.status !== 'ft' || m.hs == null || m.as == null) continue
    const involves = (m.home === a && m.away === b) || (m.home === b && m.away === a)
    if (!involves) continue
    const aScore = m.home === a ? m.hs : m.as
    const bScore = m.home === b ? m.hs : m.as
    if (aScore > bScore) ptA += 3
    else if (aScore < bScore) ptB += 3
    else { ptA++; ptB++ }
  }
  return ptB - ptA
}

/** Classifica marcatori: gol + rigori realizzati, aggregati per giocatore. */
function computeScorers(events: MatchEvent[], matches: Match[]): ScorerRow[] {
  const matchById = new Map(matches.map((m) => [m.id, m]))
  const tally = new Map<string, ScorerRow>()
  for (const e of events) {
    if (e.kind !== 'goal' && e.kind !== 'penalty' && e.kind !== 'own_goal') continue
    if (e.kind === 'own_goal') continue // autogol non assegnato al marcatore
    const m = matchById.get(e.matchId)
    const team = m ? (e.side === 'home' ? m.home : m.away) : '—'
    const key = `${e.player}|${team}`
    if (!tally.has(key)) tally.set(key, { player: e.player, team, goals: 0 })
    tally.get(key)!.goals++
  }
  return [...tally.values()].sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player))
}

self.onmessage = (ev: MessageEvent<ComputeRequest>) => {
  const { matches, events } = ev.data
  const result: ComputeResult = {
    standings: computeStandings(matches),
    scorers: computeScorers(events, matches),
  }
  ;(self as unknown as Worker).postMessage(result)
}
