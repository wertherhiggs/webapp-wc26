import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Stato UI volatile che deve sopravvivere alla navigazione (i componenti pagina
 * si smontano cambiando rotta con hash history). Tenuto in uno store così i
 * filtri del Calendario non si azzerano tornando dal dettaglio partita.
 */
export const useUiStore = defineStore('ui', () => {
  const calGroup = ref<string>('all')
  const calStatus = ref<'all' | 'today' | 'todo' | 'done'>('all')
  const calRaiOnly = ref(false)
  return { calGroup, calStatus, calRaiOnly }
})
