import type { Match, MatchEvent } from '@/types'

/**
 * Dataset seed: usato al primo avvio / offline / quando le fonti pubbliche non
 * sono raggiungibili. dataSync lo sovrascrive con i dati reali quando disponibili.
 * Orari memorizzati in UTC; in giugno l'Italia è UTC+2 (CEST).
 * Gironi A e F con gare odierne/future; B e C con risultati per popolare classifiche.
 */
export const SEED_MATCHES: Match[] = [
  // --- Girone A: MD1/MD2 giocate, MD3 oggi/futuro ---
  { id: 'a1', num: 1, kickoff: '2026-06-11T19:00:00Z', status: 'ft', home: 'ITA', away: 'MAR', hs: 2, as: 0, group: 'A', venueId: 'tor' },
  { id: 'a2', num: 2, kickoff: '2026-06-11T16:00:00Z', status: 'ft', home: 'FRA', away: 'CRO', hs: 1, as: 0, group: 'A', venueId: 'dal' },
  { id: 'a3', num: 17, kickoff: '2026-06-14T19:00:00Z', status: 'ft', home: 'ITA', away: 'CRO', hs: 2, as: 1, group: 'A', venueId: 'nyc' },
  { id: 'a4', num: 18, kickoff: '2026-06-14T16:00:00Z', status: 'ft', home: 'FRA', away: 'MAR', hs: 3, as: 0, group: 'A', venueId: 'bos' },
  { id: 'm1', num: 33, kickoff: '2026-06-15T19:00:00Z', status: 'live', minute: 67, home: 'ITA', away: 'FRA', hs: 1, as: 1, group: 'A', venueId: 'tor' },
  { id: 'a6', num: 34, kickoff: '2026-06-15T21:00:00Z', status: 'sched', home: 'CRO', away: 'MAR', group: 'A', venueId: 'gdl' },

  // --- Girone B: 3 giornate giocate ---
  { id: 'b1', num: 3, kickoff: '2026-06-11T21:00:00Z', status: 'ft', home: 'ESP', away: 'SEN', hs: 3, as: 1, group: 'B', venueId: 'mex' },
  { id: 'b2', num: 4, kickoff: '2026-06-12T16:00:00Z', status: 'ft', home: 'GER', away: 'NED', hs: 2, as: 2, group: 'B', venueId: 'atl' },
  { id: 'b3', num: 19, kickoff: '2026-06-14T16:00:00Z', status: 'ft', home: 'ESP', away: 'NED', hs: 2, as: 0, group: 'B', venueId: 'lax' },
  { id: 'b4', num: 20, kickoff: '2026-06-14T18:30:00Z', status: 'ft', home: 'GER', away: 'SEN', hs: 2, as: 1, group: 'B', venueId: 'hou' },
  { id: 'm2', num: 35, kickoff: '2026-06-15T16:00:00Z', status: 'ft', home: 'ESP', away: 'GER', hs: 2, as: 0, group: 'B', venueId: 'mia' },
  { id: 'r2', num: 36, kickoff: '2026-06-14T21:00:00Z', status: 'ft', home: 'NED', away: 'SEN', hs: 2, as: 1, group: 'B', venueId: 'sea' },

  // --- Girone C ---
  { id: 'c1', num: 5, kickoff: '2026-06-13T19:00:00Z', status: 'ft', home: 'BRA', away: 'SRB', hs: 2, as: 1, group: 'C', venueId: 'kan' },
  { id: 'm3', num: 37, kickoff: '2026-06-15T21:00:00Z', status: 'sched', home: 'BRA', away: 'ARG', group: 'C', venueId: 'mty' },

  // --- Girone D (oggi/domani) ---
  { id: 'm4', num: 38, kickoff: '2026-06-16T16:00:00Z', status: 'sched', home: 'USA', away: 'MEX', group: 'D', venueId: 'sfo' },

  // --- Girone F ---
  { id: 'f1', num: 6, kickoff: '2026-06-13T16:00:00Z', status: 'ft', home: 'POR', away: 'CAN', hs: 3, as: 1, group: 'F', venueId: 'phi' },
  { id: 'm5', num: 39, kickoff: '2026-06-16T19:00:00Z', status: 'sched', home: 'ITA', away: 'NED', group: 'A', venueId: 'tor' },
  { id: 'm6', num: 40, kickoff: '2026-06-16T21:00:00Z', status: 'sched', home: 'ENG', away: 'JPN', group: 'F', venueId: 'van' },
]

const goal = (matchId: string, side: 'home' | 'away', minNum: number, player: string, detail?: string): MatchEvent =>
  ({ matchId, kind: 'goal', side, min: `${minNum}'`, minNum, player, detail })
const pen = (matchId: string, side: 'home' | 'away', minNum: number, player: string): MatchEvent =>
  ({ matchId, kind: 'penalty', side, min: `${minNum}'`, minNum, player, detail: 'Su calcio di rigore' })
const yellow = (matchId: string, side: 'home' | 'away', minNum: number, player: string): MatchEvent =>
  ({ matchId, kind: 'yellow', side, min: `${minNum}'`, minNum, player })
const sub = (matchId: string, side: 'home' | 'away', minNum: number, out: string, inn: string): MatchEvent =>
  ({ matchId, kind: 'sub', side, min: `${minNum}'`, minNum, player: `${out} ▸ ${inn}`, detail: 'Sostituzione' })

export const SEED_EVENTS: MatchEvent[] = [
  // m1 ITA-FRA (live, showcase)
  goal('m1', 'home', 23, 'Barella', 'Assist di Dimarco'),
  yellow('m1', 'away', 38, 'Tchouaméni'),
  pen('m1', 'away', 51, 'Mbappé'),
  sub('m1', 'home', 60, 'Retegui', 'Esposito'),
  yellow('m1', 'home', 64, 'Tonali'),
  // a1 ITA 2-0 MAR
  goal('a1', 'home', 14, 'Retegui'),
  goal('a1', 'home', 71, 'Chiesa'),
  // a2 FRA 1-0 CRO
  goal('a2', 'home', 33, 'Mbappé'),
  // a3 ITA 2-1 CRO
  goal('a3', 'home', 9, 'Retegui'),
  goal('a3', 'home', 55, 'Barella'),
  goal('a3', 'away', 80, 'Kramarić'),
  // a4 FRA 3-0 MAR
  goal('a4', 'home', 21, 'Mbappé'),
  goal('a4', 'home', 44, 'Griezmann'),
  goal('a4', 'home', 78, 'Barcola'),
  // b1 ESP 3-1 SEN
  goal('b1', 'home', 12, 'Yamal'),
  goal('b1', 'home', 39, 'Morata'),
  goal('b1', 'home', 66, 'Yamal'),
  goal('b1', 'away', 84, 'Sarr'),
  // m2 ESP 2-0 GER
  goal('m2', 'home', 12, 'Yamal'),
  goal('m2', 'home', 60, 'Morata'),
  // r2 NED 2-1 SEN
  goal('r2', 'home', 30, 'Gakpo'),
  goal('r2', 'home', 68, 'Depay'),
  goal('r2', 'away', 82, 'Sarr'),
  // c1 BRA 2-1 SRB
  goal('c1', 'home', 27, 'Vinícius'),
  goal('c1', 'home', 63, 'Vinícius'),
  goal('c1', 'away', 75, 'Mitrović'),
  // f1 POR 3-1 CAN
  goal('f1', 'home', 9, 'Ronaldo'),
  goal('f1', 'home', 54, 'Ronaldo'),
  goal('f1', 'home', 77, 'Leão'),
  goal('f1', 'away', 60, 'David'),
]

/** Formazioni (solo gare con dati disponibili). */
export const SEED_LINEUPS: Record<string, { home: Lineup; away: Lineup }> = {
  m1: {
    home: {
      code: 'ITA',
      module: '4-3-3',
      players: ['Donnarumma', 'Di Lorenzo', 'Bastoni', 'Calafiori', 'Dimarco', 'Barella', 'Locatelli', 'Tonali', 'Chiesa', 'Retegui', 'Politano'],
    },
    away: {
      code: 'FRA',
      module: '4-2-3-1',
      players: ['Maignan', 'Koundé', 'Saliba', 'Upamecano', 'Hernández', 'Tchouaméni', 'Camavinga', 'Dembélé', 'Griezmann', 'Barcola', 'Mbappé'],
    },
  },
}

export interface Lineup {
  code: string
  module: string
  players: string[]
}
