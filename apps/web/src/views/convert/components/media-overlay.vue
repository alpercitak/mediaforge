<template>
  <div class="media-overlay" :class="{ 'media-overlay--blur': blur, 'media-overlay--highlight': highlight }"></div>
</template>

<script setup lang="ts">
defineProps<{
  blur: boolean;
  highlight: boolean;
}>();
</script>

<style scoped>
.media-overlay {
  inset: 4px;
  pointer-events: none;
  border-radius: 8px;
  transition: all 0.6s;
  background-color: rgba(0, 0, 0, 0.1);
}
.media-overlay--highlight {
  background: linear-gradient(120deg, rgba(255, 0, 0, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
  background-size: 200% 200%;
  animation: flow 3s linear infinite;
}
.media-overlay--blur {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@keyframes flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
