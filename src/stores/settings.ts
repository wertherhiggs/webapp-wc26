import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { db } from '@/db/dexie'

export type Theme = 'light' | 'dark'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<Theme>('light')
  const notifNoon = ref(true)
  const notifGoals = ref(false)
  /** Conto alla rovescia in Home: solo gare in chiaro RAI tra le preferite. */
  const countdownRaiOnly = ref(false)
  const ready = ref(false)

  function applyTheme() {
    document.documentElement.dataset.theme = theme.value
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.value === 'dark' ? '#111111' : '#F8F7F2')
  }

  async function load() {
    const t = (await db.settings.get('theme'))?.value as Theme | undefined
    if (t) theme.value = t
    else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) theme.value = 'dark'
    const n = (await db.settings.get('notif:noon'))?.value
    if (typeof n === 'boolean') notifNoon.value = n
    const g = (await db.settings.get('notif:goals'))?.value
    if (typeof g === 'boolean') notifGoals.value = g
    const cr = (await db.settings.get('countdown:raiOnly'))?.value
    if (typeof cr === 'boolean') countdownRaiOnly.value = cr
    applyTheme()
    ready.value = true
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (v) => {
    applyTheme()
    if (ready.value) db.settings.put({ key: 'theme', value: v })
  })
  watch(notifNoon, (v) => ready.value && db.settings.put({ key: 'notif:noon', value: v }))
  watch(notifGoals, (v) => ready.value && db.settings.put({ key: 'notif:goals', value: v }))
  watch(countdownRaiOnly, (v) => ready.value && db.settings.put({ key: 'countdown:raiOnly', value: v }))

  return { theme, notifNoon, notifGoals, countdownRaiOnly, ready, load, toggleTheme }
})
