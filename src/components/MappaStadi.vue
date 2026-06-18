<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Infografica animata "Stadi e città" (Mondiali 2026).
 * Mappa accurata del Nord America (proiezione di Mercatore su coordinate reali),
 * 16 sedi che compaiono una a una con pop+ping, contatore 0→16 sincronizzato,
 * pillole filtro che attenuano i paesi non selezionati.
 * Portata 1:1 dal prototipo Claude Design "Stadi e Città.dc.html".
 */

type Filter = 'all' | 'CAN' | 'USA' | 'MEX'
const props = withDefaults(defineProps<{ modelValue?: Filter }>(), { modelValue: 'all' })
const emit = defineEmits<{ (e: 'update:modelValue', v: Filter): void }>()

const COLORS: Record<'CAN' | 'USA' | 'MEX', string> = {
  CAN: '#1FBFA8',
  USA: '#F2B33D',
  MEX: '#F26A53',
}
const CODE: Record<string, 'CAN' | 'USA' | 'MEX'> = { canada: 'CAN', usa: 'USA', mexico: 'MEX' }
const STEP = 0.105 // s tra una sede e l'altra (velocità "Normale")
const START = 1.3 // s prima che parta la sequenza dei puntini

// --- geometria (calcolata una volta) ---
function computeGeo() {
  const CAN = [[-123.0,49.0],[-123.3,49.4],[-124.9,49.7],[-125.6,50.4],[-127.9,50.9],[-128.4,51.8],[-128.9,52.9],[-129.9,53.6],[-130.7,54.4],[-131.8,55.5],[-133.5,57.0],[-136.5,58.6],[-139.0,59.6],[-141.0,60.0],[-130.0,60.0],[-120.0,60.0],[-110.0,60.0],[-102.0,60.0],[-95.0,60.0],[-94.2,59.0],[-93.2,58.0],[-92.6,57.0],[-92.1,56.0],[-91.6,55.0],[-90.2,54.0],[-88.2,53.6],[-86.0,53.1],[-83.5,53.2],[-82.4,51.5],[-81.8,52.5],[-80.6,53.2],[-79.8,54.2],[-79.2,55.3],[-78.6,56.4],[-78.0,57.6],[-77.7,58.6],[-78.0,59.6],[-78.2,60.2],[-75.0,60.5],[-70.0,60.4],[-66.0,60.0],[-64.5,58.5],[-62.5,56.5],[-60.5,54.5],[-58.5,53.5],[-57.0,52.5],[-56.5,51.4],[-58.5,49.8],[-61.5,49.2],[-64.3,48.9],[-66.2,48.6],[-67.8,48.5],[-69.5,48.0],[-70.2,47.2],[-71.2,46.8],[-73.2,45.7],[-74.6,45.2],[-75.3,45.0],[-76.5,44.5],[-77.5,44.0],[-79.0,43.6],[-79.8,43.3],[-79.1,43.0],[-80.5,42.5],[-81.8,42.3],[-82.5,42.1],[-82.4,43.0],[-81.7,44.6],[-81.6,45.4],[-83.4,45.9],[-84.1,46.1],[-84.6,46.5],[-85.5,47.2],[-87.0,47.9],[-88.4,48.3],[-89.6,48.0],[-90.0,48.1],[-91.5,48.2],[-93.5,48.6],[-95.15,49.0],[-100.0,49.0],[-110.0,49.0],[-114.0,49.0],[-119.0,49.0],[-123.0,49.0]]
  const USA = [[-117.1,32.53],[-118.0,33.3],[-118.4,34.0],[-119.7,34.4],[-120.6,35.1],[-121.9,36.6],[-122.4,37.6],[-122.5,37.8],[-123.0,38.3],[-123.7,38.9],[-124.0,40.0],[-124.4,42.0],[-124.1,43.3],[-124.0,44.6],[-124.0,46.3],[-124.7,48.4],[-123.0,49.0],[-119.0,49.0],[-114.0,49.0],[-110.0,49.0],[-104.0,49.0],[-100.0,49.0],[-95.15,49.0],[-93.5,48.6],[-91.5,48.2],[-90.0,48.1],[-89.6,48.0],[-88.4,48.3],[-87.0,47.9],[-85.5,47.2],[-84.6,46.5],[-84.1,46.1],[-83.4,45.9],[-82.5,45.0],[-82.5,43.0],[-82.9,42.3],[-83.1,41.8],[-80.5,42.4],[-79.1,42.8],[-77.0,43.6],[-76.5,44.1],[-75.3,45.0],[-74.6,45.2],[-71.5,45.1],[-70.0,46.2],[-69.2,47.4],[-68.0,47.3],[-67.8,47.1],[-67.8,45.9],[-67.1,45.2],[-67.0,44.7],[-68.8,44.3],[-70.2,43.7],[-70.8,43.1],[-70.8,42.3],[-70.5,41.8],[-71.0,41.5],[-71.5,41.4],[-72.5,41.2],[-73.8,40.8],[-74.0,40.5],[-74.2,39.7],[-74.4,39.4],[-75.0,38.8],[-75.3,38.0],[-76.0,37.2],[-75.9,36.9],[-75.5,35.6],[-75.5,35.2],[-76.5,34.6],[-77.9,34.0],[-78.5,33.9],[-79.2,33.3],[-79.9,32.7],[-80.9,32.0],[-81.4,30.7],[-81.0,29.5],[-80.6,28.4],[-80.5,27.5],[-80.1,26.8],[-80.1,25.8],[-80.4,25.2],[-81.1,25.2],[-81.7,25.9],[-82.0,26.6],[-82.7,27.5],[-82.8,28.0],[-83.0,29.2],[-84.0,30.1],[-85.0,29.7],[-86.5,30.4],[-87.5,30.3],[-88.0,30.3],[-89.0,29.2],[-90.0,29.2],[-91.5,29.3],[-93.8,29.7],[-94.7,29.4],[-95.0,29.2],[-96.5,28.5],[-97.2,27.8],[-97.5,25.9],[-99.1,26.4],[-99.5,27.5],[-100.0,28.2],[-101.4,29.8],[-102.3,29.8],[-103.0,29.0],[-104.5,29.7],[-106.5,31.8],[-108.2,31.3],[-111.0,31.3],[-114.8,32.5],[-117.1,32.53]]
  const MEX = [[-117.13,32.53],[-116.9,31.8],[-116.3,30.8],[-115.8,30.2],[-114.9,29.5],[-114.2,28.0],[-113.4,27.0],[-112.8,26.0],[-112.1,25.0],[-111.2,24.3],[-110.2,23.6],[-109.5,23.0],[-109.5,23.6],[-110.0,24.2],[-110.7,24.3],[-111.7,25.7],[-112.3,26.9],[-112.9,28.0],[-113.6,29.4],[-114.2,30.2],[-114.6,31.0],[-114.8,31.8],[-114.4,31.7],[-113.5,31.2],[-112.8,30.2],[-112.0,28.8],[-111.2,28.0],[-110.6,27.3],[-109.5,27.0],[-109.4,26.4],[-108.4,25.2],[-107.4,24.4],[-106.4,23.2],[-105.7,22.5],[-105.4,21.6],[-105.7,20.5],[-104.9,19.4],[-103.5,18.4],[-101.6,17.6],[-100.2,17.0],[-99.5,16.7],[-97.5,15.9],[-96.5,15.7],[-95.0,16.1],[-94.0,16.2],[-92.8,15.3],[-92.2,14.6],[-91.5,15.0],[-90.7,16.1],[-90.4,16.5],[-90.5,17.3],[-91.0,17.2],[-91.4,17.8],[-90.5,18.0],[-88.5,18.5],[-88.3,18.5],[-87.8,18.4],[-87.5,19.6],[-87.4,20.4],[-86.8,21.2],[-87.5,21.5],[-88.8,21.4],[-90.3,21.0],[-90.5,20.7],[-90.8,19.9],[-91.8,18.7],[-92.8,18.6],[-94.5,18.2],[-95.5,18.7],[-96.3,19.4],[-97.0,20.6],[-97.4,21.5],[-97.8,22.5],[-97.7,24.0],[-97.7,25.0],[-97.5,25.9],[-99.1,26.4],[-99.5,27.5],[-100.0,28.2],[-101.4,29.8],[-102.3,29.8],[-103.0,29.0],[-104.5,29.7],[-106.5,31.8],[-108.2,31.3],[-111.0,31.3],[-114.8,32.5],[-117.13,32.53]]
  const cities = [
    { name: 'Vancouver', country: 'canada', lon: -123.112, lat: 49.277 },
    { name: 'Seattle', country: 'usa', lon: -122.332, lat: 47.595 },
    { name: 'San Francisco', country: 'usa', lon: -121.970, lat: 37.403 },
    { name: 'Los Angeles', country: 'usa', lon: -118.339, lat: 33.953 },
    { name: 'Guadalajara', country: 'mexico', lon: -103.463, lat: 20.682 },
    { name: 'Monterrey', country: 'mexico', lon: -100.244, lat: 25.669 },
    { name: 'Città del Messico', country: 'mexico', lon: -99.150, lat: 19.303 },
    { name: 'Dallas', country: 'usa', lon: -97.093, lat: 32.748 },
    { name: 'Houston', country: 'usa', lon: -95.411, lat: 29.685 },
    { name: 'Kansas City', country: 'usa', lon: -94.484, lat: 39.049 },
    { name: 'Atlanta', country: 'usa', lon: -84.400, lat: 33.755 },
    { name: 'Miami', country: 'usa', lon: -80.239, lat: 25.958 },
    { name: 'Toronto', country: 'canada', lon: -79.418, lat: 43.633 },
    { name: 'Filadelfia', country: 'usa', lon: -75.167, lat: 39.901 },
    { name: 'New York', country: 'usa', lon: -74.074, lat: 40.813 },
    { name: 'Boston', country: 'usa', lon: -71.264, lat: 42.091 },
  ]
  const merc = (lon: number, lat: number): [number, number] => [
    (lon * Math.PI) / 180,
    Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)),
  ]
  const all = [...CAN, ...USA, ...MEX].map((p) => merc(p[0], p[1]))
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  all.forEach(([x, y]) => {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x)
    minY = Math.min(minY, y); maxY = Math.max(maxY, y)
  })
  const W = 1000, H = 640, M = 48
  const pw = maxX - minX, ph = maxY - minY
  const s = Math.min((W - 2 * M) / pw, (H - 2 * M) / ph)
  const ox = M + ((W - 2 * M) - pw * s) / 2
  const oy = M + ((H - 2 * M) - ph * s) / 2
  const tx = (lon: number, lat: number): [number, number] => {
    const [x, y] = merc(lon, lat)
    return [ox + (x - minX) * s, oy + (maxY - y) * s]
  }
  const toPath = (arr: number[][]) =>
    arr
      .map((p, i) => {
        const [X, Y] = tx(p[0], p[1])
        return (i ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1)
      })
      .join(' ') + ' Z'
  const dots = cities.map((c, i) => {
    const [X, Y] = tx(c.lon, c.lat)
    const code = CODE[c.country]
    return {
      name: c.name,
      code,
      cx: +X.toFixed(1),
      cy: +Y.toFixed(1),
      color: COLORS[code],
      delay: (START + i * STEP).toFixed(3) + 's',
    }
  })
  return { canada: toPath(CAN), usa: toPath(USA), mexico: toPath(MEX), dots }
}

const geo = computeGeo()

// --- sequenza animata ---
const counter = ref(0)
const playKey = ref(0)
let t0: ReturnType<typeof setTimeout> | undefined
let iv: ReturnType<typeof setInterval> | undefined

function startSequence() {
  clearTimeout(t0); clearInterval(iv)
  counter.value = 0
  t0 = setTimeout(() => {
    let n = 1
    counter.value = 1
    iv = setInterval(() => {
      n++
      counter.value = n
      if (n >= 16) clearInterval(iv)
    }, STEP * 1000)
  }, START * 1000)
}

function replay() {
  playKey.value++
  emit('update:modelValue', 'all')
  startSequence()
}

onMounted(startSequence)
onUnmounted(() => { clearTimeout(t0); clearInterval(iv) })

const dim = (code: 'CAN' | 'USA' | 'MEX') =>
  props.modelValue === 'all' || props.modelValue === code ? 1 : 0.16

// n. sedi per paese (fisso) + contatore mostrato: animato su "Tutti",
// numero del paese selezionato sui filtri nazione.
const counts = geo.dots.reduce(
  (m, d) => { m[d.code]++; return m },
  { CAN: 0, USA: 0, MEX: 0 } as Record<'CAN' | 'USA' | 'MEX', number>,
)
const displayCount = computed(() =>
  props.modelValue === 'all' ? counter.value : counts[props.modelValue],
)
const isPulsing = (code: 'CAN' | 'USA' | 'MEX') => props.modelValue === code

function setFilter(f: Filter) {
  emit('update:modelValue', f)
}
</script>

<template>
  <div class="card-mappa">
    <div :key="playKey" class="inner">
      <!-- testata -->
      <div class="head">
        <div>
          <div class="title rise" style="animation-delay:.1s">Stadi e città</div>
          <div class="sub rise" style="animation-delay:.24s">
            16 sedi <span class="dotsep">·</span> 3 paesi ospitanti
          </div>
        </div>
      </div>

      <!-- mappa -->
      <div class="mapwrap">
        <svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet" class="map">
          <g class="shp">
            <g class="ct" :style="{ opacity: dim('CAN') }">
              <g class="revealC" style="animation-delay:.15s">
                <path :d="geo.canada" fill="#C9ECE6" stroke="#56CFBE" stroke-width="2" stroke-linejoin="round" />
              </g>
            </g>
            <g class="ct" :style="{ opacity: dim('USA') }">
              <g class="revealC" style="animation-delay:.45s">
                <path :d="geo.usa" fill="#FBE6B5" stroke="#F2C45F" stroke-width="2" stroke-linejoin="round" />
              </g>
            </g>
            <g class="ct" :style="{ opacity: dim('MEX') }">
              <g class="revealC" style="animation-delay:.8s">
                <path :d="geo.mexico" fill="#FBD5CD" stroke="#F08C79" stroke-width="2" stroke-linejoin="round" />
              </g>
            </g>
          </g>

          <g v-for="d in geo.dots" :key="d.name" class="dot" :class="{ pulse: isPulsing(d.code) }" :style="{ opacity: dim(d.code) }">
            <circle class="ping" :cx="d.cx" :cy="d.cy" r="9" fill="none" :stroke="d.color" stroke-width="3" :style="{ animationDelay: d.delay }" />
            <circle class="pop" :cx="d.cx" :cy="d.cy" r="9" :fill="d.color" stroke="#ffffff" stroke-width="2.6" :style="{ animationDelay: d.delay }" />
          </g>
        </svg>

        <!-- contatore -->
        <div class="counter rise" style="animation-delay:1.25s">
          <span class="cnum">{{ displayCount }}</span>
          <span class="clbl">SEDI</span>
        </div>
      </div>

      <!-- etichetta (fuori dalla mappa) -->
      <div class="naLbl rise" style="animation-delay:3.5s">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" fill="#6b7280" /><circle cx="12" cy="10" r="2.4" fill="#fff" /></svg>
        NORD AMERICA
      </div>

      <!-- legenda -->
      <div class="legend rise" style="animation-delay:3.42s">
        <span class="lg"><span class="ld" style="background:#1FBFA8" />Canada</span>
        <span class="lg"><span class="ld" style="background:#F2B33D" />Stati Uniti</span>
        <span class="lg"><span class="ld" style="background:#F26A53" />Messico</span>
      </div>

      <!-- pillole filtro -->
      <div class="pills rise" style="animation-delay:3.62s">
        <button class="pill" :class="{ on: modelValue === 'all' }" data-c="dark" @click="setFilter('all')">Tutti</button>
        <button class="pill" :class="{ on: modelValue === 'CAN' }" data-c="CAN" @click="setFilter('CAN')"><span class="pd" style="background:#1FBFA8" />Canada</button>
        <button class="pill" :class="{ on: modelValue === 'USA' }" data-c="USA" @click="setFilter('USA')"><span class="pd" style="background:#F2B33D" />USA</button>
        <button class="pill" :class="{ on: modelValue === 'MEX' }" data-c="MEX" @click="setFilter('MEX')"><span class="pd" style="background:#F26A53" />Messico</button>
      </div>
    </div>

    <button class="replay rise" style="animation-delay:4.1s" aria-label="Riavvia animazione" @click="replay">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v4h4" /></svg>
    </button>
  </div>
</template>

<style scoped>
/* Infografica con palette propria (graphic self-contained, identica nei due temi). */
.card-mappa {
  position: relative;
  width: 100%;
  font-family: 'Noto Sans', system-ui, -apple-system, sans-serif;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0 24px 60px rgba(30, 40, 70, 0.13), 0 2px 6px rgba(30, 40, 70, 0.05);
  padding: 26px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.head { display: flex; align-items: flex-start; justify-content: space-between; }
.title { font-size: 29px; font-weight: 900; color: #1b2030; letter-spacing: -0.025em; line-height: 1.04; }
.sub {
  margin-top: 7px;
  font-size: 13.5px;
  font-weight: 500;
  color: #9098a8;
  display: flex;
  align-items: center;
  gap: 9px;
}
.dotsep { opacity: 0.45; font-weight: 700; }

.mapwrap { position: relative; aspect-ratio: 1000 / 640; background: #f4f7fa; border-radius: 20px; overflow: hidden; }
.map { width: 100%; height: 100%; display: block; }
.shp { filter: drop-shadow(0 4px 5px rgba(40, 60, 90, 0.07)); }
.ct { transition: opacity 0.45s ease; }
.dot { transition: opacity 0.4s ease; }

.counter {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #1b2030;
  color: #fff;
  border-radius: 16px;
  padding: 9px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 24px rgba(27, 32, 48, 0.28);
}
.cnum { font-size: 25px; font-weight: 900; line-height: 1; }
.clbl { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; color: #8c93a8; margin-top: 3px; }

.naLbl {
  align-self: flex-start;
  background: #f1f3f7;
  border: 1px solid #e6eaf0;
  color: #414a5a;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.13em;
  padding: 7px 13px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.legend { display: flex; align-items: center; gap: 17px; padding-left: 2px; }
.lg { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 500; color: #6b7280; }
.ld { width: 10px; height: 10px; border-radius: 50%; display: block; }

.pills { display: flex; gap: 9px; flex-wrap: wrap; }
.pill {
  padding: 9px 15px;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.22s ease;
  outline: none;
  border: 1.5px solid #eceff4;
  background: #f1f3f7;
  color: #5b6271;
}
.pd { width: 9px; height: 9px; border-radius: 50%; display: block; flex: none; }
.pill[data-c='dark'].on { background: #1b2030; border-color: #1b2030; color: #fff; box-shadow: 0 5px 14px rgba(27, 32, 48, 0.25); }
.pill[data-c='CAN'].on { background: #1fbfa8; border-color: #1fbfa8; color: #fff; box-shadow: 0 5px 14px rgba(31, 191, 168, 0.25); }
.pill[data-c='USA'].on { background: #f2b33d; border-color: #f2b33d; color: #3a2f10; box-shadow: 0 5px 14px rgba(242, 179, 61, 0.25); }
.pill[data-c='MEX'].on { background: #f26a53; border-color: #f26a53; color: #fff; box-shadow: 0 5px 14px rgba(242, 106, 83, 0.25); }

.replay {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #e6eaf0;
  background: #fff;
  color: #5b6271;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.09);
}

/* keyframes (dal prototipo) */
@keyframes revealC { from { opacity: 0; transform: translateY(10px) scale(0.985); } to { opacity: 1; transform: none; } }
@keyframes popDot { 0% { transform: scale(0); } 62% { transform: scale(1.22); } 100% { transform: scale(1); } }
@keyframes pingDot { 0% { transform: scale(0.7); opacity: 0.5; } 80% { opacity: 0.04; } 100% { transform: scale(3); opacity: 0; } }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes pulseDot { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.45); } }
.dot.pulse { animation: pulseDot 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.revealC { animation: revealC 0.7s cubic-bezier(0.22, 0.7, 0.2, 1) both; transform-box: fill-box; transform-origin: center; }
.pop { animation: popDot 0.55s cubic-bezier(0.34, 1.56, 0.46, 1) both; transform-box: fill-box; transform-origin: center; }
.ping { animation: pingDot 0.9s ease-out both; transform-box: fill-box; transform-origin: center; }
.rise { animation: rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both; }

@media (prefers-reduced-motion: reduce) {
  .revealC, .pop, .ping, .rise { animation-duration: 0.001s; }
  .dot.pulse { animation: none; }
}
</style>
