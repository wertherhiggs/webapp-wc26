import Dexie, { type Table } from 'dexie'
import type {
  Match,
  MatchEvent,
  Venue,
  FavoriteTeam,
  FavoriteMatch,
  Prediction,
  SettingsState,
  MetaEntry,
} from '@/types'

/**
 * Database locale (IndexedDB via Dexie). È la "memoria del browser" dell'app:
 * popolata dal seed al primo avvio e aggiornata da dataSync.
 */
export class MondialiDB extends Dexie {
  matches!: Table<Match, string>
  events!: Table<MatchEvent, number>
  venues!: Table<Venue, string>
  favoriteTeams!: Table<FavoriteTeam, string>
  favoriteMatches!: Table<FavoriteMatch, string>
  predictions!: Table<Prediction, string>
  settings!: Table<SettingsState, string>
  meta!: Table<MetaEntry, string>
  /** id partite per cui è già stata mostrata la notifica di mezzogiorno */
  notified!: Table<{ matchId: string; at: number }, string>

  constructor() {
    super('mondiali2026')
    this.version(1).stores({
      matches: 'id, status, group, kickoff',
      events: '++id, matchId, kind',
      venues: 'id, country',
      favoriteTeams: 'code',
      favoriteMatches: 'matchId',
      predictions: 'matchId',
      settings: 'key',
      meta: 'key',
      notified: 'matchId',
    })
  }
}

export const db = new MondialiDB()
