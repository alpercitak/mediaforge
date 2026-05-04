<template>
  <media-preview v-if="media?.original" :media-item="media.original" @ready="onMediaReady" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { Dimension } from '@mediaforge/media/types';
import { useCropStore } from '@/views/crop/stores/crop';
import MediaPreview from '@/components/app/media-preview.vue';

const HEIGHT = 400 as const;

const { containerDimensions, cropDimensions, mediaDimensions, media } = storeToRefs(useCropStore());

const onMediaReady = ({ width, height }: Dimension) => {
  const computedWidth = (width / height) * HEIGHT;
  mediaDimensions.value = { width, height };
  containerDimensions.value = { width: computedWidth, height: HEIGHT };
  cropDimensions.value = { x: 0, y: 0, width: computedWidth, height: HEIGHT };
};
</script>
