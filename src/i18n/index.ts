import { createI18n } from 'vue-i18n'
import it from './it.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'it',
  messages: { it },
})
