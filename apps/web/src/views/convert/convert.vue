<template>
  <process-layout>
    <template #header>
      <div class="convert__options">
        <dropdown :options="qualityOptions" v-model="quality" />
        <dropdown :options="convertOptions" v-model="format" />
      </div>
    </template>
    <div class="convert__media-wrapper">
      <media-container v-for="media in medias" :media="media" :key="media.id" />
    </div>
    <template #footer>
      <button-convert v-if="canConvert" :format="format" :quality="quality" />
      <button-download v-if="canDownload" />
    </template>
  </process-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import type { Quality } from '@mediaforge/ffmpeg/types';
import type { MediaFormat } from '@mediaforge/media/types';
import ButtonDownload from '@/components/app/button-download.vue';
import MediaContainer from '@/components/app/media-container.vue';
import Dropdown from '@/components/ui/dropdown.vue';
import ProcessLayout from '@/layouts/process-layout/process-layout.vue';
import { useMediaStore } from '@/stores/media';
import ButtonConvert from './components/button-convert.vue';

const { isInProgress, medias, hasMedias, processedMediasCount } = storeToRefs(useMediaStore());

const format = ref<MediaFormat>('gif');
const quality = ref<Quality>('default');

const hasProcessedMedias = computed<boolean>(() => !!processedMediasCount.value);
const canConvert = computed<boolean>(() => hasMedias.value && !hasProcessedMedias.value && !isInProgress.value);
const canDownload = computed<boolean>(() => hasProcessedMedias.value && !isInProgress.value);
const qualityOptions = Object.entries(QUALITY_OPTION_MAP).map(([value, { width, fps }]) => ({
  value,
  text: `${value} · ${width}px · ${fps}fps`,
}));
const convertOptions = computed<Array<{ value: MediaFormat; text: string }>>(() => [
  { value: 'gif', text: 'gif' },
  { value: 'webp', text: 'webp' },
  { value: 'apng', text: 'apng' },
  { value: 'mp4', text: 'mp4' },
  { value: 'webm', text: 'webm' },
]);
</script>

<style scoped>
.convert__options {
  display: flex;
  gap: var(--spacer-sm);
}
.convert__media-wrapper {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
</style>
