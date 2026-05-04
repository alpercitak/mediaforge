<template>
  <button class="button"><slot /></button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

useAttrs();
</script>

<style scoped>
.button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
.button:hover {
  border-color: var(--color-accent);
}
.button:focus,
.button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
