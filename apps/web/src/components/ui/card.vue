<template>
  <div class="card">
    <div v-if="slots.header">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div v-if="slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<style scoped>
.card {
  border: var(--border);
  border-radius: var(--border-radius-md);
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: var(--spacer-lg);
  padding: var(--spacer-lg);
}
</style>
