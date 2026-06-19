# Mondiali 2026 — PWA

Web app **installabile** (PWA) per seguire la **FIFA World Cup 2026** (Canada · USA · Messico,
11 giugno – 19 luglio 2026), pensata per il pubblico italiano: **calendario con orario italiano**
e **canale TV italiano** (DAZN / RAI 1 in chiaro), risultati ed eventi, classifiche dei gironi e
marcatori, tabellone a eliminazione, schede squadre, preferiti con notifiche best-effort e
pronostici personali.

È **interamente client-side e statica** (nessun backend): i dati vengono scaricati da fonti
pubbliche e salvati nel browser. Funziona offline e si installa su smartphone **senza app store**.

🔗 **Demo live:** https://wertherhiggs.github.io/webapp-wc26

---

## Caratteristiche

- 📅 **Calendario** con orari convertiti in `Europe/Rome` e canale TV (filtro "solo in chiaro RAI")
- ⚽ **Risultati ed eventi** (gol, rigori, autogol; cartellini/cambi se disponibili)
- 🏆 **Classifiche gironi** (criteri FIFA) e **marcatori**, calcolate in un Web Worker
- 🗺️ **Stadi e città**: infografica animata del Nord America + dettaglio sede con foto
- 🇮🇹 **Squadre preferite** con countdown alla prossima gara (filtrabile per gare RAI)
- 🔔 **Notifiche best-effort** (promemoria a mezzogiorno, gol in tempo reale ad app aperta)
- 🎯 **Pronostici** con punteggio personale
- 🌗 Tema chiaro/scuro, mobile-first, installabile su Android e iOS

## Stack tecnico

- **Vue 3 + Vite + TypeScript** (`<script setup>`), **Vue Router**, **Pinia**
- **PWA** con `vite-plugin-pwa` (manifest + service worker, offline-first)
- **IndexedDB** via **Dexie.js** per lo storage locale
- **Web Worker** per i calcoli pesanti (classifiche/marcatori)
- **vue-i18n** (contenuti in italiano)
- Deploy: **GitHub Pages** via GitHub Actions

---

## Requisiti

- **Node.js ≥ 20** e **npm** (la CI usa Node 20)
- Un browser moderno

## Avvio in locale

```bash
# 1. Clona il repository
git clone https://github.com/wertherhiggs/webapp-wc26.git
cd webapp-wc26

# 2. Installa le dipendenze
npm install

# 3. Avvia il server di sviluppo
npm run dev
```

Apri **http://localhost:5173** nel browser.

## Build e anteprima di produzione

```bash
npm run build      # type-check (vue-tsc) + build in dist/
npm run preview    # serve localmente la build di dist/
```

Altri comandi utili:

```bash
npm run typecheck  # solo controllo dei tipi
npm run icons      # rigenera le icone PWA dall'SVG (richiede 'sharp')
```

---

## Deploy su GitHub Pages

Il repository include il workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
a ogni `push` su `main` esegue build e pubblicazione su GitHub Pages.

Per pubblicare la **tua copia** (dopo un fork o clone su un tuo repo):

1. **Carica il codice** sul tuo repository GitHub.
2. Vai su **Settings → Pages** e imposta **Source: GitHub Actions**.
3. Fai un **push su `main`** (oppure **Actions → Deploy to GitHub Pages → Run workflow**).
4. Al termine l'app sarà su **`https://<tuo-utente>.github.io/<nome-repo>/`**.

> ℹ️ Non serve modificare `base` in `vite.config.ts`: il progetto usa `base: './'` (percorsi
> relativi) + **hash history** del router, quindi funziona sotto **qualunque** sottocartella di
> GitHub Pages senza configurazioni aggiuntive e senza errori 404 al refresh.

---

## Struttura del progetto

```
src/
  main.ts  App.vue
  router/        # rotte (5 tab + sotto-pagine)
  stores/        # Pinia: matches, favorites, predictions, settings
  db/            # dexie.ts (schema IndexedDB)
  services/      # dataSync.ts, notifications.ts, time.ts
  workers/       # compute.worker.ts (classifiche/marcatori)
  data/          # tv-it.json, venues.json, team-codes.ts, seed.ts, ...
  components/    # MatchCard, MappaStadi, BottomNav, IosInstallBanner, ...
  pages/         # Home, Calendario, Tabellone, Classifiche, Preferiti, ...
  i18n/          # it.json
public/          # manifest, icone PWA, favicon
.github/workflows/deploy.yml
```

## Dati e personalizzazione

- **Fonte calendario/risultati:** [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json)
  (dominio pubblico, nessuna API key). Scaricata all'avvio e su refresh; in mancanza di rete si usa
  un dataset *seed* locale.
- **Canali TV italiani** (non presenti in alcuna API) — curati a mano in
  [`src/data/tv-it.json`](src/data/tv-it.json). DAZN trasmette tutte le 104 gare; RAI 1 solo quelle
  in chiaro, elencate **per coppia di squadre** (ordine indifferente):

  ```json
  { "home": "ITA", "away": "BRA", "d": "2026-07-05" }
  ```

  I codici a 3 lettere sono in [`src/data/team-codes.ts`](src/data/team-codes.ts). Per aggiungere le
  gare RAI dei turni a eliminazione, aggiungi le coppie quando il tabellone è definito, poi
  `npm run build` e deploy.
- **Sedi/stadi:** [`src/data/venues.json`](src/data/venues.json) (città, stadio, capienza, foto).

## Installazione come app (PWA)

- **Android (Chrome):** menu ⋮ → **"Installa app"** / **"Aggiungi a schermata Home"**.
- **iOS (Safari):** **Condividi** (⬆️) → **"Aggiungi a Home"**. iOS non offre il prompt automatico:
  l'app mostra un banner con le istruzioni quando rilevato Safari su iOS.

## Note e limiti

- **Aggiornamenti:** il service worker si auto-aggiorna; alla riapertura l'app carica l'ultima
  versione (niente cache obsoleta).
- **Notifiche:** best-effort, senza backend. Ad app completamente chiusa l'orario non è garantito.
  Su iOS funzionano solo da PWA installata (iOS 16.4+).
- **Dati:** dipendono dalla disponibilità su openfootball; il tabellone si popola quando gli
  accoppiamenti sono noti. Le formazioni complete non hanno una fonte pubblica gratuita affidabile.

## Crediti e disclaimer

- Dati calendario/risultati: openfootball (dominio pubblico). Foto stadi: Wikimedia Commons.
- Progetto **non ufficiale**, senza alcuna affiliazione con la FIFA; nomi e marchi appartengono ai
  rispettivi proprietari.
- Codice fornito a scopo dimostrativo/educativo. Aggiungi una licenza (es. MIT) se intendi
  consentirne esplicitamente il riuso.
