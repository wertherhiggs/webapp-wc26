import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/db/dexie'

export const useFavoritesStore = defineStore('favorites', () => {
  const teams = ref<Set<string>>(new Set())
  const matches = ref<Set<string>>(new Set())

  async function load() {
    teams.value = new Set((await db.favoriteTeams.toArray()).map((t) => t.code))
    matches.value = new Set((await db.favoriteMatches.toArray()).map((m) => m.matchId))
  }

  function isTeamFav(code: string): boolean {
    return teams.value.has(code)
  }
  function isMatchFav(id: string): boolean {
    return matches.value.has(id)
  }

  async function toggleTeam(code: string) {
    const next = new Set(teams.value)
    if (next.has(code)) {
      next.delete(code)
      await db.favoriteTeams.delete(code)
    } else {
      next.add(code)
      await db.favoriteTeams.put({ code })
    }
    teams.value = next
  }

  async function toggleMatch(id: string) {
    const next = new Set(matches.value)
    if (next.has(id)) {
      next.delete(id)
      await db.favoriteMatches.delete(id)
    } else {
      next.add(id)
      await db.favoriteMatches.put({ matchId: id })
    }
    matches.value = next
  }

  return { teams, matches, load, isTeamFav, isMatchFav, toggleTeam, toggleMatch }
})
