<script setup lang="ts">
import { computed } from 'vue'
import { teamFlag, flagBackground, teamFlagEmoji } from '@/data/teams'

const props = withDefaults(
  defineProps<{ code: string; size?: 'sm' | 'md' | 'lg' }>(),
  { size: 'md' },
)

const emoji = computed(() => teamFlagEmoji(props.code))
const bg = computed(() => flagBackground(teamFlag(props.code)))
const dims = computed(() => {
  if (props.size === 'sm') return { w: '28px', h: '20px', r: '3px', f: '20px' }
  if (props.size === 'lg') return { w: '46px', h: '32px', r: '5px', f: '34px' }
  return { w: '34px', h: '24px', r: '4px', f: '26px' }
})
</script>

<template>
  <span
    v-if="emoji"
    class="flag emoji"
    :style="{ width: dims.w, height: dims.h, borderRadius: dims.r, fontSize: dims.f }"
    role="img"
    :aria-label="code"
  >{{ emoji }}</span>
  <span
    v-else
    class="flag grad"
    :style="{ background: bg, width: dims.w, height: dims.h, borderRadius: dims.r }"
    role="img"
    :aria-label="code"
  />
</template>

<style scoped>
.flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  line-height: 1;
}
.grad {
  border: 0.5px solid rgba(120, 120, 120, 0.4);
  background-size: cover !important;
  background-repeat: no-repeat;
  background-position: center;
}
.emoji {
  /* l'emoji riempie il box mantenendo la forma bandiera; clip ai bordi arrotondati */
  font-family: 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif;
}
</style>
