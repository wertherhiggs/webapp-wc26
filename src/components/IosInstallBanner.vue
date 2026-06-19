<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * Banner "Aggiungi a Home" per iOS: su iOS non esiste il prompt automatico di
 * installazione (solo Android/Chromium). Mostriamo istruzioni manuali SOLO se:
 * dispositivo iOS + Safari (non Chrome/Firefox iOS né webview) + non già
 * installata (display standalone) + non già chiuso dall'utente.
 */
const DISMISS_KEY = 'iosInstallDismissed'
const show = ref(false)

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    // iOS Safari espone navigator.standalone in standalone
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}
function isIOS(): boolean {
  const ua = navigator.userAgent
  const iPhoneIPad = /iphone|ipad|ipod/i.test(ua)
  // iPadOS 13+ si maschera da Mac: lo distinguiamo dal touch
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iPhoneIPad || iPadOS
}
function isSafari(): boolean {
  const ua = navigator.userAgent
  // Esclude Chrome/Firefox/Edge/Opera iOS e webview in-app comuni
  const otherBrowsers = /CriOS|FxiOS|EdgiOS|OPiOS|mercury|FBAN|FBAV|Instagram|Line\//i.test(ua)
  return /Safari/i.test(ua) && !otherBrowsers
}
function dismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function close() {
  show.value = false
  try {
    localStorage.setItem(DISMISS_KEY, '1')
  } catch {
    /* private mode: amen, riapparirà */
  }
}

onMounted(() => {
  // ?iosbanner=1 forza il banner ovunque (per anteprima/test del layout)
  const force = location.search.includes('iosbanner')
  if (force || (isIOS() && isSafari() && !isStandalone() && !dismissed())) {
    // piccolo ritardo: non sbattere il banner addosso all'avvio
    setTimeout(() => (show.value = true), force ? 300 : 1500)
  }
})
</script>

<template>
  <div v-if="show" class="ios-banner" role="dialog" aria-label="Come installare l'app">
      <div class="icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 15V4" /><path d="M8.5 7.5 12 4l3.5 3.5" />
          <path d="M6 11.5H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-1" />
        </svg>
      </div>
      <div class="txt">
        <div class="t">Installa Mondiali 2026</div>
        <div class="s">
          Tocca
          <span class="share">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4" /><path d="M8.5 7.5 12 4l3.5 3.5" /><path d="M6 11.5H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-1" /></svg>
          </span>
          in basso, poi «Aggiungi a Home»
        </div>
      </div>
      <button class="x" aria-label="Chiudi" @click="close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
</template>

<style scoped>
.ios-banner {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(env(safe-area-inset-bottom) + 102px);
  margin-inline: auto;
  max-width: calc(var(--maxw) - 24px);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
  animation: bannerIn 0.35s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes bannerIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .ios-banner { animation: none; }
}
.icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon svg { stroke: #111; }
.txt { flex: 1; min-width: 0; }
.t { font-size: 14px; font-weight: 900; color: var(--text); }
.s { font-size: 12px; color: var(--muted); margin-top: 2px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
}
.x {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--surface);
  border: 0;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
