<template>
  <div class="overlay">
    <div class="overlay__part" :style="topStyle"></div>
    <div class="overlay__part" :style="bottomStyle"></div>
    <div class="overlay__part" :style="leftStyle"></div>
    <div class="overlay__part" :style="rightStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCropStore } from '@/views/crop/stores/crop';
import type { ElementStyle } from '@/views/crop/types';

const { containerDimensions, cropDimensions } = storeToRefs(useCropStore());

const topStyle = computed<ElementStyle>(() => ({
  top: '0px',
  left: '0px',
  width: `${containerDimensions.value.width}px`,
  height: `${cropDimensions.value.y}px`,
}));

const bottomStyle = computed<ElementStyle>(() => ({
  top: `${cropDimensions.value.y + cropDimensions.value.height}px`,
  left: '0px',
  width: `${containerDimensions.value.width}px`,
  height: `${containerDimensions.value.height - (cropDimensions.value.y + cropDimensions.value.height)}px`,
}));

const leftStyle = computed<ElementStyle>(() => ({
  top: `${cropDimensions.value.y}px`,
  left: '0px',
  width: `${cropDimensions.value.x}px`,
  height: `${cropDimensions.value.height}px`,
}));

const rightStyle = computed<ElementStyle>(() => ({
  top: `${cropDimensions.value.y}px`,
  left: `${cropDimensions.value.x + cropDimensions.value.width}px`,
  width: `${containerDimensions.value.width - (cropDimensions.value.x + cropDimensions.value.width)}px`,
  height: `${cropDimensions.value.height}px`,
}));
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.overlay__part {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  pointer-events: none;
}
</style>
