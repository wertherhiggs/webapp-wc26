import tvJson from './tv-it.json'
import type { Match, TvEntry } from '@/types'

const RAI: TvEntry = tvJson.channels.rai
const DAZN: TvEntry = tvJson.channels.dazn

/** Chiave coppia squadre indipendente dall'ordine (casa/trasferta). */
const pairKey = (a: string, b: string) => [a, b].sort().join('|')

// Set delle coppie in chiaro su RAI (vedi tv-it.json). Match per coppia, non per
// numero gara: robusto rispetto alla numerazione interna e facile da aggiornare.
const RAI_SET = new Set<string>(
  tvJson.raiInChiaro.map((m) => pairKey(m.home, m.away)),
)

/**
 * Canale TV italiano per una gara. DAZN trasmette tutte le 104; RAI 1 quelle in
 * chiaro elencate (per coppia di squadre) in tv-it.json. Gare con squadre non
 * ancora definite (segnaposto knockout) → DAZN finché la coppia non è nota.
 */
export function getTv(match: Pick<Match, 'home' | 'away'>): TvEntry {
  return RAI_SET.has(pairKey(match.home, match.away)) ? RAI : DAZN
}

/** Numero di gare in chiaro su RAI definite (per il banner Home). */
export const raiFreeCount = RAI_SET.size
