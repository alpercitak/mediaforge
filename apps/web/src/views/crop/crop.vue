<template>
  <process-layout>
    <div class="media-wrapper" v-show="!!media?.original.src">
      <div class="media-wrapper__container">
        <media-original class="media-wrapper__media" />
        <template v-if="hasCropDimensions">
          <crop-box class="media-wrapper__crop-box" />
          <crop-overlay />
        </template>
      </div>
      <div class="media-wrapper__container" v-if="media?.processed">
        <media-preview :media-item="media.processed" class="media-wrapper__media" />
      </div>
    </div>
    <template #footer>
      <button-crop v-if="canCrop" />
      <button-download v-if="canDownload" />
    </template>
  </process-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ButtonDownload from '@/components/app/button-download.vue';
import MediaPreview from '@/components/app/media-preview.vue';
import ProcessLayout from '@/layouts/process-layout/process-layout.vue';
import { useMediaStore } from '@/stores/media';
import ButtonCrop from './components/button-crop.vue';
import CropBox from './components/crop-box.vue';
import CropOverlay from './components/crop-overlay.vue';
import MediaOriginal from './components/media-original.vue';

import { useCropStore } from './stores/crop';

const { isInProgress, processedMediasCount } = storeToRefs(useMediaStore());
const { media, scaledCrop } = storeToRefs(useCropStore());

const hasCropDimensions = computed<boolean>(() => !!scaledCrop.value.height);
const canCrop = computed<boolean>(() => !isInProgress.value && hasCropDimensions.value);
const canDownload = computed<boolean>(() => !!processedMediasCount.value && !isInProgress.value);
</script>

<style scoped>
.media-wrapper {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
}
.media-wrapper__container {
  box-sizing: border-box;
  position: relative;
  border: 1px solid #eee;
}
.media-wrapper__media {
  height: 400px;
}
.media-wrapper__crop-box {
  position: absolute;
  z-index: 2;
}
</style>
