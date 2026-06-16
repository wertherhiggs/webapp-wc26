# Mondiali 2026 — PWA

App PWA (installabile su Android **senza Play Store**, via "Aggiungi a schermata Home") per la
FIFA World Cup 2026 (Canada / USA / Messico, 11 giugno – 19 luglio 2026):
calendario con **orario italiano** e **canale TV italiano**, risultati ed eventi
(gol/cartellini/cambi), classifiche gironi e marcatori, tabellone a eliminazione,
schede squadre con link news, preferiti con notifiche best-effort, pronostici.

Interamente **client-side e statica** (nessun backend), deployata su GitHub Pages.

## Stack
- **Vue 3 + Vite + TypeScript** (componenti `<script setup>`), **Vue Router**, **Pinia**
- **PWA**: `vite-plugin-pwa` (manifest + service worker, offline-first)
- **Storage locale**: **IndexedDB via Dexie.js** (no sqlite-wasm: IndexedDB è standard e leggero)
- **Web Worker** per calcoli pesanti (classifiche/marcatori) off-main-thread
- **vue-i18n** (contenuti in italiano), tema chiaro/scuro via CSS variables
- Deploy: **GitHub Pages** → in `vite.config.ts` impostare `base: '/<nome-repo>/'`

## Comandi
- `npm install`
- `npm run dev` — sviluppo locale
- `npm run build` — build di produzione
- `npm run preview` — anteprima build
- Deploy automatico via `.github/workflows/deploy.yml`

## Architettura dati
- **Fonti pubbliche**:
  - base: [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) (gratis, no API key, dominio pubblico) — calendario, gironi, risultati
  - live opzionale: [rezarahiminia/worldcup2026](https://github.com/rezarahiminia/worldcup2026)
- `src/services/dataSync.ts`: fetch dei JSON (CORS ok su `raw.githubusercontent.com`) → confronto
  versione/etag salvata in tabella `meta` → upsert in IndexedDB. Eseguito all'apertura app + su
  pull-to-refresh + via Periodic Background Sync dove supportato (Chromium/PWA installata).
- `src/workers/compute.worker.ts`: calcola classifiche gironi (criteri FIFA: punti, diff. reti,
  reti fatte, scontri diretti) e classifica marcatori (aggregando `events` di tipo gol).
  Popola il tabellone a fine fase a gironi.
- **Canali TV italiani**: NON esistono in nessuna API → mantenuti **a mano** in
  `src/data/tv-it.json` come `matchId → { canale, inChiaro }`.
  Vincolo 2026: **DAZN** trasmette tutte le 104 gare; **RAI 1** solo **35 in chiaro**
  (apertura, alcuni gironi, 6 sedicesimi, 4 ottavi, tutto da quarti alla finale).
  Il flag `inChiaro` alimenta il filtro "solo in chiaro RAI".
- **Fuso orario**: tutti gli orari convertiti e mostrati in `Europe/Rome` (le gare USA/MEX sono
  spesso sera/notte italiana), con badge giorno/notte.

## Notifiche (best-effort, NO backend)
- `Notification` API + service worker. All'apertura app e via Periodic Background Sync (dove c'è),
  si controllano le partite preferite del giorno: a/oltre mezzogiorno, se non già notificata,
  si mostra la notifica. Stato "già notificato" persistito in IndexedDB.
- **Limite noto**: ad app completamente chiusa l'orario esatto non è garantito → comunicarlo in UI.

## Schema IndexedDB (Dexie)
`teams`, `matches`, `events`, `groups`, `venues`, `favorites`, `predictions`, `settings`, `meta`

## Pagine / Viste & navigazione
Architettura definita nel prototipo (`prototipo web app world cup 2026/`).

**Bottom nav (5 tab)**: `Home` · `Calendario` · `Tabellone` · `Classifiche` · `Preferiti`.
Sfondo nav nero (#111), tab attiva = pallino + icona/etichetta oro (#F4C94B).

**Sotto-pagine** (no tab dedicata, si aprono dalle viste e tornano con "Indietro"):
- **Dettaglio partita** — dalle MatchCard (tab attiva resta `Home`)
- **Scheda squadra** — da righe classifica/marcatori/preferiti (tab attiva `Preferiti`)
- **Stadi/Città** — da Preferiti e dal dettaglio partita (tab attiva `Preferiti`)
- **Pronostici** — da Preferiti (tab attiva `Preferiti`)

**Dettaglio viste:**
- **Home** — header data + "Live ora", card countdown prossima preferita (o empty state
  "Segui una squadra"), "Partite di oggi", "Ultime giocate", riga highlights YouTube, banner
  "X partite in chiaro su RAI".
- **Calendario** — chip filtro (Tutte/Italia/Gruppo/Solo RAI), toggle "Solo in chiaro RAI",
  lista raggruppata per giorno, empty state filtri.
- **Classifiche** — segmented control **Gironi | Marcatori**. Gironi: card per girone con legenda
  Qualificate (turchese) / Ripescaggio (oro). Marcatori: lista con rank medagliato.
- **Tabellone** — bracket Ottavi→Quarti→Semifinale→Finale a scroll orizzontale.
- **Dettaglio partita** — header risultato su sfondo nero, badge canale+orario+RAI, link stadio,
  "Cronaca" (timeline eventi con icone gol/cartellini/cambi + divider intervallo), "Formazioni"
  (due colonne con modulo), CTA highlights.
- **Scheda squadra** — bandiera/nome/girone, bottone "Segui squadra", prossime gare (MatchCard),
  ultime gare (con V/N/P colorato), "Notizie sulla nazionale" (link esterni).
- **Preferiti** — squadre seguite, card pronostici (punteggio), card Stadi/Città, sezione
  **Notifiche** con due toggle: "Promemoria a mezzogiorno" e "Gol in tempo reale".
- **Pronostici** — card punteggio/posizione, "Da pronosticare" (stepper +/− per risultato,
  "Pronostico salvato"), "Storico" (Esatto/Risultato/Errato + punti).
- **Stadi/Città** — mappa anteprima Nord America con pin colorati per paese, chip filtro paese,
  lista 16 sedi con n° gare.

> Nota IA: non c'è una pagina "Impostazioni" separata — le **notifiche** stanno in Preferiti e il
> **toggle tema** è globale. Pronostici introduce uno scoring; "Gol in tempo reale" è una notifica
> aggiuntiva emersa in design (best-effort come le altre).

## Design system (dal prototipo Claude Design)
Riferimento: `prototipo web app world cup 2026/` (Mondiali 2026.dc.html = design system,
MatchCard.dc.html = componente, Phone.dc.html = app navigabile). Stile sportivo, mobile-first,
card arrotondate, accenti oro/corallo, tema chiaro/scuro.

**Token tema** (implementare come CSS variables, switch chiaro/scuro):

| Token | Chiaro | Scuro |
|---|---|---|
| `bg` | `#F8F7F2` (panna) | `#111111` |
| `surface` | `#EDECE7` | `#222220` |
| `card` | `#FFFFFF` | `#2A2A2A` |
| `border` | `#D4D3CD` (0.5px) | `rgba(255,255,255,0.12)` |
| `text` | `#111111` | `#F8F7F2` |
| `muted` | `#888880` | `#999990` |

**Colori accento** (uguali nei due temi): Oro `#F4C94B`, Corallo `#E8614A`, Turchese `#3EC8C0`,
Viola `#8B5CF6` (pronostici), Lime `#A8E040` (gol), Verde RAI `#2D9E4A`, Errore `#E84242`.

**Tipografia**: **Noto Sans** (400/500/700/900).
- Display 900 (es. punteggi/orari grandi 30–44px, `letter-spacing:-0.02em`)
- H1 28 · 900 · titolo pagina · H2 20 · 700/900 sezione
- Body 15 · 400 (line-height 1.5–1.6) · Label 12 · 500 uppercase `letter-spacing:0.06em`

**Forme & spaziatura**: radius card 24px, card interne/righe 20px, badge piccoli 16px,
pill/chip/toggle 999px, frame telefono 42px. Bordi `0.5px` per le hairline.

**Componenti riutilizzabili chiave:**
- **MatchCard** (componente unico riusato in Home/Calendario/Squadra) — 3 stati:
  `live` (badge corallo + pallino lampeggiante "Live 67'"), `sched` (badge surface "In programma",
  mostra orario grande), `ft` (badge scuro "Finita", mostra punteggio). Punteggio in box nero con
  numeri oro. Badge "In chiaro RAI" verde + chip canale (quadratino colore + nome). Footer
  opzionale con marcatori per lato.
- **Riga classifica** — barra colore posizione (turchese qualif. / oro ripescaggio), pos, bandiera,
  sigla, colonne G V N P GF GS Pt.
- **Chip filtro** — idle (bordo) / attivo (fondo oro, testo nero).
- **Toggle switch** — track 46×27, knob bianco; on = verde RAI.
- **Segmented control** — (es. Gironi/Marcatori), pill attiva su `card` con ombra.
- **Countdown card** — sfondo nero, 4 box (Giorni/Ore/Min/Sec) con numeri oro.
- **Timeline evento** — minuto + icona quadrata colorata (gol lime, giallo oro, rosso `#E84242`,
  cambio turchese) + testo; divider intervallo con punteggio.
- **Bracket card** (tabellone) — due righe squadra+punteggio, vincente in grassetto/corallo, nota
  d.c.r./data.

> **Bandiere**: nel prototipo sono gradienti CSS placeholder. In produzione usare asset reali
> (SVG/emoji bandiere ISO) mantenendo dimensioni 34×24 (card) / 46×32 (header dettaglio).

## Struttura cartelle (prevista)
```
src/
  main.ts  App.vue
  router/        # rotte (5 tab + sotto-pagine)
  stores/        # Pinia: matches, standings, favorites, predictions, settings
  db/            # dexie.ts (schema)
  services/      # dataSync.ts, notifications.ts
  workers/       # compute.worker.ts
  data/          # tv-it.json, venues.json, team-news.json
  theme/         # CSS variables tema chiaro/scuro (token sopra)
  pages/         # HomeView, CalendarioView, TabelloneView, ClassificheView, PreferitiView,
                 # DettaglioPartitaView, SquadraView, StadiView, PronosticiView
  components/    # MatchCard, RigaClassifica, ChipFiltro, ToggleSwitch, SegmentedControl,
                 # CountdownCard, TimelineEvento, BracketCard, MarcatoreRow, BottomNav
  i18n/          # it.json
public/          # manifest, icone PWA, asset bandiere
.github/workflows/deploy.yml
```

## Convenzioni
- TypeScript **strict**; componenti `<script setup lang="ts">`; file componenti in **PascalCase**.
- Logica dati nei **services/stores**, non nei componenti.
- **Niente segreti/API key** nel repo (app statica pubblica).
- Mobile-first; tutte le date/ore in `Europe/Rome`.

## Stato del progetto
**Step 4 completato: l'app è sviluppata e la build passa** (`npm run build` verde, PWA generata,
tutte le 9 viste navigabili e verificate via preview). Implementati: scaffold Vite+Vue3+TS+PWA,
schema Dexie, dataset seed + `dataSync` (openfootball best-effort con fallback), Web Worker per
classifiche (tiebreak FIFA) e marcatori, stores Pinia, tema chiaro/scuro, i18n, notifiche
best-effort, deploy workflow GitHub Pages.

**Avvio in locale**: `npm install` poi `npm run dev` (vedi nota ambiente sotto).

> ⚠️ **Nota ambiente (questa macchina)**: su PATH c'è un `npm` legacy 6.9.0 in `/usr/local/bin`
> incompatibile con Node 24. Usare l'npm di nvm: anteporre
> `/Users/wertherhiggs/.nvm/versions/node/v24.16.0/bin` al PATH, oppure `corepack`.

### TODO noti / prossimi passi
- **Bandiere reali**: ora gradienti CSS placeholder (`src/data/teams.ts`) → sostituire con SVG ISO.
- **Dati live**: verificare l'URL reale di openfootball 2026 in `dataSync.ts` e affinare il parser;
  valutare la fonte `rezarahiminia/worldcup2026` per i risultati live.
- **`tv-it.json`**: completare il mapping canali per tutte le 104 gare (ora coperte le gare seed).
- **Tabellone**: passare dal bracket provvisorio (proiezione da classifiche) al popolamento reale a
  fine gironi (sedicesimi→finale del format 2026 a 48 squadre).
- **Notifiche "gol in tempo reale"**: oggi è un flag; richiede polling ad app aperta.
- **Icone PWA**: ora SVG; per copertura store-like generare anche PNG 192/512.
