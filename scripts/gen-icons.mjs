// Genera le icone PNG della PWA da SVG vettoriale (no font) con sharp.
// Uso: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

const GOLD = '#F4C94B'
const BG = '#111111'

// Emblema: anello oro + pallone stilizzato. cx,cy,r parametrici per safe-zone.
const emblem = (cx, cy, r, sw) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="${sw}"/>
  <path d="M ${cx} ${cy - r * 0.55} L ${cx + r * 0.52} ${cy - r * 0.17} L ${cx + r * 0.32} ${cy + r * 0.45} L ${cx - r * 0.32} ${cy + r * 0.45} L ${cx - r * 0.52} ${cy - r * 0.17} Z" fill="${GOLD}"/>
`

// Icona standard: rettangolo arrotondato + emblema centrato
const iconSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${BG}"/>
  ${emblem(256, 256, 150, 22)}
</svg>`

// Maskable: sfondo a tutto campo + emblema nella safe-zone (~66%)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  ${emblem(256, 256, 120, 18)}
</svg>`

async function png(svg, size, name) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(outDir, name))
  console.log('✓', name)
}

await png(iconSvg(192), 192, 'icon-192.png')
await png(iconSvg(512), 512, 'icon-512.png')
await png(maskableSvg, 512, 'icon-512-maskable.png')
console.log('Icone generate in', outDir)
