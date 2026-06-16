<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<template>
  <button
    class="track"
    :class="{ on: modelValue }"
    role="switch"
    :aria-checked="modelValue"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="knob" />
  </button>
</template>

<style scoped>
.track {
  width: 46px;
  height: 27px;
  border-radius: 999px;
  background: var(--border);
  position: relative;
  flex-shrink: 0;
  border: 0;
  padding: 0;
  transition: background 0.2s;
}
.track.on {
  background: var(--rai);
}
.knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 21px;
  height: 21px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: left 0.2s;
}
.track.on .knob {
  left: 22px;
}
</style>
