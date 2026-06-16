import tvJson from './tv-it.json'
import type { TvEntry } from '@/types'

const MAP = (tvJson as { matches: Record<string, TvEntry> }).matches

const DEFAULT: TvEntry = { canale: 'DAZN', color: '#1A1A1A', inChiaro: false }

/** Canale TV italiano per una gara. Default DAZN (trasmette tutte le 104). */
export function getTv(matchId: string): TvEntry {
  return MAP[matchId] ?? DEFAULT
}
