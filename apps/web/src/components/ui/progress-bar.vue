<template>
  <div class="progress-bar">
    <div class="progress-bar__wrapper" :style="{ width }"></div>
    <span class="progress-bar__text">{{ value }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
}>();

const width = computed<string>(() => `${Math.min(props.value, 100)}%`);
</script>

<style scoped>
.progress-bar {
  position: relative;
  width: 120px;
  height: 8px;
  background: #eee;
  border-radius: var(--spacer-lg);
  overflow: hidden;
}
.progress-bar__wrapper {
  height: 100%;
  background: linear-gradient(120deg, var(--color-accent), var(--color-accent-soft), rgba(255, 0, 255, 0.3));
  width: 0;
  transition: width 0.3s ease;
}
.progress-bar__text {
  position: absolute;
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-weight: bold;
}
</style>
