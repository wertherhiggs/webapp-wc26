// Tipi dominio dell'app Mondiali 2026

export type MatchStatus = 'sched' | 'live' | 'ft'

export interface Team {
  /** Codice FIFA a 3 lettere, chiave primaria (es. "ITA") */
  code: string
  name: string
  group: string | null
  /** Specifica per il rendering della bandiera (gradiente CSS placeholder) */
  flag?: FlagSpec
}

export interface FlagSpec {
  /** Direzione strisce: 'v' verticali, 'h' orizzontali */
  dir?: 'v' | 'h'
  colors?: string[]
  /** background CSS grezzo per bandiere non a strisce */
  raw?: string
}

export interface Channel {
  name: string
  color: string
}

export type EventKind = 'goal' | 'own_goal' | 'penalty' | 'yellow' | 'red' | 'sub'
export type EventSide = 'home' | 'away'

export interface MatchEvent {
  id?: number
  matchId: string
  kind: EventKind
  side: EventSide
  /** minuto, es. "23'" */
  min: string
  /** ordinamento numerico del minuto */
  minNum: number
  /** giocatore principale */
  player: string
  /** dettaglio: assist, "su rigore", "esce ▸ entra" */
  detail?: string
}

export interface Match {
  /** id univoco gara (es. "m1" o numero openfootball) */
  id: string
  num?: number
  /** ISO datetime UTC della gara */
  kickoff: string
  status: MatchStatus
  /** minuto corrente se live */
  minute?: number
  home: string // team code
  away: string // team code
  hs?: number
  as?: number
  /** girone, es. "A"; null in fase a eliminazione */
  group: string | null
  /** round eliminazione, es. "R32" | "R16" | "QF" | "SF" | "F" */
  stage?: string
  venueId?: string
  /** etichetta segnaposto in tabellone, es. "1A" / "Vincente W57" */
  homePlaceholder?: string
  awayPlaceholder?: string
}

export interface Venue {
  id: string
  city: string
  stadium: string
  country: 'CAN' | 'USA' | 'MEX'
  /** capienza approssimativa */
  capacity?: number
  /** stringa `ground` openfootball, per agganciare le gare alla sede */
  ground?: string
}

/** Mapping canale TV italiano per gara (curato a mano) */
export interface TvEntry {
  canale: string
  color: string
  inChiaro: boolean
}

export interface NewsLink {
  name: string
  site: string
  url: string
}

// --- Dati derivati (calcolati nel worker) ---

export interface StandingRow {
  code: string
  g: number
  v: number
  n: number
  p: number
  gf: number
  gs: number
  dr: number
  pt: number
}

export interface GroupStanding {
  group: string
  rows: StandingRow[]
}

export interface ScorerRow {
  player: string
  team: string
  goals: number
}

// --- Stato utente ---

export interface FavoriteTeam {
  code: string
}

export interface FavoriteMatch {
  matchId: string
}

export interface Prediction {
  matchId: string
  h: number
  a: number
}

export interface SettingsState {
  key: string
  value: unknown
}

export interface MetaEntry {
  key: string
  etag?: string
  lastSync?: number
  version?: string
}
