<template>
  <label class="toggle">
    <span v-if="label" class="toggle__label">{{ label }}</span>
    <input type="checkbox" class="toggle__input" v-model="model" />
    <span class="toggle__track">
      <span class="toggle__thumb"></span>
    </span>
  </label>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  label?: string;
}>();
</script>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}
.toggle__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.toggle__track {
  width: 42px;
  height: 24px;
  background: #2c2f3a;
  border-radius: 999px;
  position: relative;
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
}
.toggle__thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
/* ON state */
.toggle__input:checked + .toggle__track {
  background: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}
.toggle__input:checked + .toggle__track .toggle__thumb {
  transform: translateX(18px);
  box-shadow: 0 0 8px var(--color-accent-soft);
}
/* Keyboard focus */
.toggle__input:focus-visible + .toggle__track {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.toggle__label {
  font-size: 0.9rem;
  opacity: 0.9;
  flex: 1;
}
</style>
