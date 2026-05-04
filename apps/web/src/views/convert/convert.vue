<template>
  <process-layout>
    <template #header>
      <dropdown :options="convertOptions" v-model="format" />
    </template>
    <div class="convert__media-wrapper">
      <media-container v-for="media in medias" :media="media" :key="media.id" />
    </div>
    <template #footer>
      <button-convert v-if="canConvert" :format="format" />
      <button-download v-if="canDownload" />
    </template>
  </process-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import type { MediaFormat } from '@mediaforge/media/types';
import ButtonDownload from '@/components/app/button-download.vue';
import Dropdown from '@/components/ui/dropdown.vue';
import ProcessLayout from '@/layouts/process-layout/process-layout.vue';
import { useMediaStore } from '@/stores/media';
import ButtonConvert from './components/button-convert.vue';
import MediaContainer from './components/media-container.vue';

const { isInProgress, medias, hasMedias, processedMediasCount } = storeToRefs(useMediaStore());

const format = ref<MediaFormat>('gif');

const hasProcessedMedias = computed<boolean>(() => !!processedMediasCount.value);
const canConvert = computed<boolean>(() => hasMedias.value && !hasProcessedMedias.value && !isInProgress.value);
const canDownload = computed<boolean>(() => hasProcessedMedias.value && !isInProgress.value);
const convertOptions = computed<Array<{ value: MediaFormat; text: string }>>(() => [
  { value: 'gif', text: 'gif' },
  { value: 'webp', text: 'webp' },
]);
</script>

<style scoped>
.convert__media-wrapper {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
</style>
