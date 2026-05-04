<template>
  <app-layout>
    <div class="process-layout__control-wrapper">
      <file-input />
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <drag-overlay v-if="isDragging" />
    <template #footer-left>
      <div>{{ ffmpegStatus }}</div>
      <div class="process-layout__progress">
        <span>Progress:&nbsp;</span>
        <odometer :value="processedMediasCount" />
        /
        <odometer :value="medias.length" />
      </div>
      <progress-bar v-if="progressValue" :value="progressValue" />
    </template>
    <template #footer-right>
      <slot name="footer"></slot>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import Odometer from '@/components/ui/odometer.vue';
import ProgressBar from '@/components/ui/progress-bar.vue';
import AppLayout from '@/layouts/app-layout/app-layout.vue';
import { useFFmpegStore } from '@/stores/ffmpeg';
import { useMediaStore } from '@/stores/media';
import DragOverlay from './components/drag-overlay.vue';
import FileInput from './components/file-input.vue';
import { useBodyDrag } from './composables/body-drag';
import { useFileInput } from './composables/file-input';

const { ffmpegLoaded, progressValue } = storeToRefs(useFFmpegStore());
const { medias, processedMediasCount } = storeToRefs(useMediaStore());
const { processFiles } = useFileInput();
const { isDragging } = useBodyDrag(processFiles);

const ffmpegStatus = computed<string>(() => `FFmpeg: ${ffmpegLoaded.value ? '✅' : '⏳'}`);
</script>

<style scoped>
.process-layout__control-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.process-layout__progress {
  display: flex;
  align-items: center;
}
</style>
