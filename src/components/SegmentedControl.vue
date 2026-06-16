<script setup lang="ts">
defineProps<{ options: { key: string; label: string }[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <div class="seg">
    <button
      v-for="o in options"
      :key="o.key"
      class="opt"
      :class="{ active: modelValue === o.key }"
      @click="emit('update:modelValue', o.key)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: flex;
  gap: 4px;
  background: var(--surface);
  border-radius: 14px;
  padding: 4px;
}
.opt {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  background: transparent;
  color: var(--muted);
  border: 0;
}
.opt.active {
  background: var(--card);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>
