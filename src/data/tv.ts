import tvJson from './tv-it.json'
import type { Match, TvEntry } from '@/types'

const RAI: TvEntry = tvJson.channels.rai
const DAZN: TvEntry = tvJson.channels.dazn
const RAI_SET = new Set<number>(tvJson.raiInChiaro)

/**
 * Canale TV italiano per una gara. Regola 2026: DAZN trasmette tutte le 104;
 * RAI 1 le 35 in chiaro (set per numero gara in tv-it.json).
 * Le gare senza numero (es. fallback) → DAZN.
 */
export function getTv(match: Pick<Match, 'num'>): TvEntry {
  return match.num != null && RAI_SET.has(match.num) ? RAI : DAZN
}

/** Numero totale di gare in chiaro su RAI (per il banner Home). */
export const raiFreeCount = RAI_SET.size
