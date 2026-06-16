import type { FlagSpec } from '@/types'

const cr = '#F4F3EE'

interface TeamSeed {
  name: string
  flag: FlagSpec
}

/**
 * Anagrafica squadre con bandiere placeholder (gradienti CSS, dal prototipo).
 * In produzione le bandiere reali andranno sostituite con asset SVG ISO.
 */
export const TEAMS: Record<string, TeamSeed> = {
  ITA: { name: 'Italia', flag: { dir: 'v', colors: ['#1A8B4B', cr, '#E8614A'] } },
  FRA: { name: 'Francia', flag: { dir: 'v', colors: ['#2E4DA7', cr, '#E84242'] } },
  ESP: { name: 'Spagna', flag: { dir: 'h', colors: ['#E84242', '#F4C94B', '#E84242'] } },
  GER: { name: 'Germania', flag: { dir: 'h', colors: ['#1A1A1A', '#E84242', '#F4C94B'] } },
  BRA: { name: 'Brasile', flag: { dir: 'h', colors: ['#1A8B4B', '#F4C94B', '#2E4DA7'] } },
  ARG: { name: 'Argentina', flag: { dir: 'h', colors: ['#7DBEE8', cr, '#7DBEE8'] } },
  POR: { name: 'Portogallo', flag: { dir: 'v', colors: ['#1A6B3B', '#E84242'] } },
  NED: { name: 'Olanda', flag: { dir: 'h', colors: ['#E8614A', cr, '#2E4DA7'] } },
  ENG: {
    name: 'Inghilterra',
    flag: {
      raw: `linear-gradient(#E84242,#E84242) center/100% 5px no-repeat, linear-gradient(#E84242,#E84242) center/5px 100% no-repeat, ${cr}`,
    },
  },
  USA: { name: 'USA', flag: { dir: 'h', colors: ['#2E4DA7', cr, '#E84242'] } },
  MEX: { name: 'Messico', flag: { dir: 'v', colors: ['#1A8B4B', cr, '#E84242'] } },
  MAR: { name: 'Marocco', flag: { colors: ['#C0392B'] } },
  SEN: { name: 'Senegal', flag: { dir: 'v', colors: ['#1A8B4B', '#F4C94B', '#E84242'] } },
  CRO: { name: 'Croazia', flag: { raw: 'repeating-conic-gradient(#E84242 0 25%, #F4F3EE 0 50%) 0 0/14px 14px' } },
  JPN: {
    name: 'Giappone',
    flag: { raw: `radial-gradient(circle at 50% 50%, #E84242 0 32%, transparent 33%), ${cr}` },
  },
  CAN: { name: 'Canada', flag: { dir: 'v', colors: ['#E84242', cr, '#E84242'] } },
  SRB: { name: 'Serbia', flag: { dir: 'h', colors: ['#E84242', '#2E4DA7', cr] } },
  CMR: { name: 'Camerun', flag: { dir: 'v', colors: ['#1A8B4B', '#E84242', '#F4C94B'] } },
}

export function teamName(code: string): string {
  return TEAMS[code]?.name ?? code
}

export function teamFlag(code: string): FlagSpec {
  return (
    TEAMS[code]?.flag ?? { raw: 'repeating-linear-gradient(45deg,#888 0 5px,#aaa 5px 10px)' }
  )
}

/** Converte una FlagSpec in una stringa `background` CSS. */
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
