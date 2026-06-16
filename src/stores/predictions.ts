import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/db/dexie'
import type { Match, Prediction } from '@/types'

export interface PredOutcome {
  matchId: string
  label: string
  you: string
  tag: 'Esatto' | 'Risultato' | 'Errato'
  pts: number
}

export const usePredictionsStore = defineStore('predictions', () => {
  const map = ref<Record<string, Prediction>>({})

  async function load() {
    const all = await db.predictions.toArray()
    map.value = Object.fromEntries(all.map((p) => [p.matchId, p]))
  }

  function get(id: string): Prediction {
    return map.value[id] ?? { matchId: id, h: 0, a: 0 }
  }

  async function bump(id: string, side: 'h' | 'a', delta: number) {
    const cur = get(id)
    const next: Prediction = { ...cur, matchId: id }
    next[side] = Math.max(0, Math.min(20, (next[side] ?? 0) + delta))
    map.value = { ...map.value, [id]: next }
    await db.predictions.put(next)
  }

  /** Punteggio: 5 pt risultato esatto, 3 pt esito (1/X/2) corretto. */
  function scoreFor(pred: Prediction, m: Match): number {
    if (m.status !== 'ft' || m.hs == null || m.as == null) return 0
    if (pred.h === m.hs && pred.a === m.as) return 5
    const sign = (h: number, a: number) => Math.sign(h - a)
    return sign(pred.h, pred.a) === sign(m.hs, m.as) ? 3 : 0
  }

  function tagFor(pts: number): PredOutcome['tag'] {
    return pts === 5 ? 'Esatto' : pts === 3 ? 'Risultato' : 'Errato'
  }

  function buildHistory(matches: Match[]): PredOutcome[] {
    const out: PredOutcome[] = []
    for (const m of matches) {
      const p = map.value[m.id]
      if (!p || m.status !== 'ft' || m.hs == null || m.as == null) continue
      const pts = scoreFor(p, m)
      out.push({
        matchId: m.id,
        label: `${m.home} ${m.hs} - ${m.as} ${m.away}`,
        you: `Tuo: ${p.h}-${p.a}`,
        tag: tagFor(pts),
        pts,
      })
    }
    return out
  }

  return { map, load, get, bump, scoreFor, tagFor, buildHistory }
})
