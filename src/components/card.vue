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
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}
</style>
