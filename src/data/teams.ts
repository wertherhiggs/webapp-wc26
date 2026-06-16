import type { FlagSpec } from '@/types'
import { CODE_TO_ISO } from '@/data/team-codes'

const cr = '#F4F3EE'

interface TeamSeed {
  name: string
  /** codice ISO 3166-1 alpha-2 per la bandiera emoji ('eng' = caso speciale Inghilterra) */
  iso: string
  /** gradiente CSS di fallback (se l'emoji non è disponibile) */
  flag: FlagSpec
}

/**
 * Anagrafica squadre. Bandiera reale via emoji (offline, nativa su Android/iOS);
 * il gradiente CSS resta come fallback per piattaforme che non rendono le emoji.
 */
export const TEAMS: Record<string, TeamSeed> = {
  ITA: { name: 'Italia', iso: 'it', flag: { dir: 'v', colors: ['#1A8B4B', cr, '#E8614A'] } },
  FRA: { name: 'Francia', iso: 'fr', flag: { dir: 'v', colors: ['#2E4DA7', cr, '#E84242'] } },
  ESP: { name: 'Spagna', iso: 'es', flag: { dir: 'h', colors: ['#E84242', '#F4C94B', '#E84242'] } },
  GER: { name: 'Germania', iso: 'de', flag: { dir: 'h', colors: ['#1A1A1A', '#E84242', '#F4C94B'] } },
  BRA: { name: 'Brasile', iso: 'br', flag: { dir: 'h', colors: ['#1A8B4B', '#F4C94B', '#2E4DA7'] } },
  ARG: { name: 'Argentina', iso: 'ar', flag: { dir: 'h', colors: ['#7DBEE8', cr, '#7DBEE8'] } },
  POR: { name: 'Portogallo', iso: 'pt', flag: { dir: 'v', colors: ['#1A6B3B', '#E84242'] } },
  NED: { name: 'Olanda', iso: 'nl', flag: { dir: 'h', colors: ['#E8614A', cr, '#2E4DA7'] } },
  ENG: {
    name: 'Inghilterra',
    iso: 'eng',
    flag: {
      raw: `linear-gradient(#E84242,#E84242) center/100% 5px no-repeat, linear-gradient(#E84242,#E84242) center/5px 100% no-repeat, ${cr}`,
    },
  },
  USA: { name: 'USA', iso: 'us', flag: { dir: 'h', colors: ['#2E4DA7', cr, '#E84242'] } },
  MEX: { name: 'Messico', iso: 'mx', flag: { dir: 'v', colors: ['#1A8B4B', cr, '#E84242'] } },
  MAR: { name: 'Marocco', iso: 'ma', flag: { colors: ['#C0392B'] } },
  SEN: { name: 'Senegal', iso: 'sn', flag: { dir: 'v', colors: ['#1A8B4B', '#F4C94B', '#E84242'] } },
  CRO: { name: 'Croazia', iso: 'hr', flag: { raw: 'repeating-conic-gradient(#E84242 0 25%, #F4F3EE 0 50%) 0 0/14px 14px' } },
  JPN: {
    name: 'Giappone',
    iso: 'jp',
    flag: { raw: `radial-gradient(circle at 50% 50%, #E84242 0 32%, transparent 33%), ${cr}` },
  },
  CAN: { name: 'Canada', iso: 'ca', flag: { dir: 'v', colors: ['#E84242', cr, '#E84242'] } },
  SRB: { name: 'Serbia', iso: 'rs', flag: { dir: 'h', colors: ['#E84242', '#2E4DA7', cr] } },
  CMR: { name: 'Camerun', iso: 'cm', flag: { dir: 'v', colors: ['#1A8B4B', '#E84242', '#F4C94B'] } },
}

export function teamName(code: string): string {
  return TEAMS[code]?.name ?? code
}

export function teamFlag(code: string): FlagSpec {
  return (
    TEAMS[code]?.flag ?? { raw: 'repeating-linear-gradient(45deg,#888 0 5px,#aaa 5px 10px)' }
  )
}

// Tag sequence per la bandiera dell'Inghilterra (sottodivisione GB-ENG).
const ENG_FLAG = '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}'

function isoToEmoji(iso: string): string {
  if (iso === 'eng') return ENG_FLAG
  return iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}

/** Bandiera emoji per un codice squadra (stringa vuota se sconosciuta → usa fallback). */
export function teamFlagEmoji(code: string): string {
  const iso = TEAMS[code]?.iso ?? CODE_TO_ISO[code]
  return iso ? isoToEmoji(iso) : ''
}

/** Converte una FlagSpec in una stringa `background` CSS (fallback). */
export function flagBackground(spec: FlagSpec): string {
  if (spec.raw) return spec.raw
  const colors = spec.colors ?? ['#888']
  if (colors.length === 1) return colors[0]
  const deg = spec.dir === 'v' ? '90deg' : '180deg'
  const seg = 100 / colors.length
  const stops = colors
    .map((col, i) => `${col} ${(i * seg).toFixed(2)}% ${((i + 1) * seg).toFixed(2)}%`)
    .join(',')
  return `linear-gradient(${deg},${stops})`
}
