<script setup lang="ts">
import { computed } from 'vue'
import { teamFlag, flagBackground } from '@/data/teams'

const props = withDefaults(
  defineProps<{ code: string; size?: 'sm' | 'md' | 'lg' }>(),
  { size: 'md' },
)

const bg = computed(() => flagBackground(teamFlag(props.code)))
const dims = computed(() => {
  if (props.size === 'sm') return { w: '28px', h: '20px', r: '3px' }
  if (props.size === 'lg') return { w: '46px', h: '32px', r: '5px' }
  return { w: '34px', h: '24px', r: '4px' }
})
</script>

<template>
  <span
    class="flag"
    :style="{ background: bg, width: dims.w, height: dims.h, borderRadius: dims.r }"
    role="img"
    :aria-label="code"
  />
</template>

<style scoped>
.flag {
  display: inline-block;
  flex-shrink: 0;
  border: 0.5px solid rgba(120, 120, 120, 0.4);
  background-size: cover !important;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
