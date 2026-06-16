<script setup lang="ts">
defineProps<{ label: string; active: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <button class="chip" :class="{ active }" @click="emit('select')">{{ label }}</button>
</template>

<style scoped>
.chip {
  flex-shrink: 0;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  background: transparent;
  color: var(--text);
  border: 1.5px solid var(--border);
}
.chip.active {
  background: var(--gold);
  color: #111;
  border-color: var(--gold);
}
</style>
