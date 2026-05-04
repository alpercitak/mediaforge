<template>
  <video
    v-if="isVideo"
    ref="el"
    :src="mediaItem.src"
    v-bind="option"
    @loadedmetadata="emitReady"
    class="media-preview"
  />
  <img v-else ref="el" :src="mediaItem.src ?? BLANK_IMAGE" @load="emitReady" class="media-preview" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { Dimension } from '@mediaforge/media/types';
import type { MediaItem } from '@/types';
import { useOptionStore } from '@/stores/option';

const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' as const;

const { option } = storeToRefs(useOptionStore());

const props = defineProps<{
  mediaItem: MediaItem;
}>();

const emit = defineEmits<{
  (e: 'ready', p: Dimension): void;
}>();

const el = ref<HTMLVideoElement | HTMLImageElement | null>(null);

const isVideo = computed<boolean>(() => props.mediaItem.type === 'video');

const emitReady = (): void => {
  if (!el.value) {
    return;
  }
  const width = el.value instanceof HTMLVideoElement ? el.value.videoWidth : el.value.naturalWidth;
  const height = el.value instanceof HTMLVideoElement ? el.value.videoHeight : el.value.naturalHeight;
  emit('ready', { width, height });
};

defineExpose({ el });
</script>

<style scoped>
.media-preview {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}
</style>
