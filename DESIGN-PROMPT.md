# Prompt per Claude Design — Mondiali 2026

> Copia/incolla il testo seguente in Claude Design per generare il prototipo del layout.
> Una volta scelto il layout definitivo, ripassalo: aggiorneremo `CLAUDE.md` con design system,
> componenti e struttura definitiva, poi partiremo con lo sviluppo.

---

Progetta il layout (mobile-first, PWA) di "Mondiali 2026", una webapp Vue per seguire la
FIFA World Cup 2026 (Canada/USA/Messico). Stile moderno, pulito, sportivo; tema chiaro e scuro;
ottimizzato per smartphone Android, installabile come app.

**Identità**: ispirata al sito FIFA del torneo (energico, colorato, tante card), ma più leggibile
e veloce. Navigazione principale a tab in basso (bottom nav):
**Home · Calendario · Tabellone · Classifiche · Preferiti**.

**Schermate da progettare:**

1. **HOME** — partite di oggi (card con **orario ITALIANO grande** + logo canale TV, badge
   **"IN CHIARO RAI"** quando gratis), countdown alla prossima partita preferita, sezione
   "ultime giocate" con risultati, riga link "Rivedi highlights" (YouTube), banner info.
2. **CALENDARIO** — lista per giorno con filtri (gruppo, squadra, canale) e toggle
   **"solo in chiaro RAI"**. Card partita: bandiere, orario IT, canale, stato.
3. **DETTAGLIO PARTITA** — header con risultato, timeline eventi (gol, cartellini, cambi),
   formazioni, canale + orario, pulsante highlights YouTube, stella "aggiungi ai preferiti".
4. **SCHEDA SQUADRA** — bandiera/nome, prossime e ultime gare, lista link a siti di news sulla
   nazionale, pulsante "segui squadra".
5. **GRUPPI** — tabelle classifica dei 12 gironi.
6. **TABELLONE** — bracket sedicesimi → finale, scrollabile.
7. **MARCATORI** — classifica cannonieri.
8. **STADI/CITTÀ** — 16 sedi ospitanti con mappa.
9. **PREFERITI** + impostazioni notifiche (notifica a mezzogiorno del giorno gara).
10. **PRONOSTICI** — inserimento pronostico risultato + punteggio personale.

**Requisiti UI**: enfasi forte sull'**orario italiano** e sul **canale TV**; badge chiaro per
"gratis su RAI"; stati partita (in programma / live / finita); empty states; dark mode;
componenti riutilizzabili (card partita, riga classifica, chip filtro).
Fornisci **palette colori**, **tipografia** e i **componenti chiave**.
