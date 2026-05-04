<template>
  <process-layout>
    <template #header>
      <dropdown :options="concatOptions" v-model="format" />
    </template>
    <div class="concat__media-wrapper">
      <media-container v-for="media in medias" :media="media" :key="media.id" />
    </div>
    <template #footer>
      <button-concat v-if="canConcat" :format="format" />
      <button-download v-if="canDownload" />
    </template>
  </process-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { ConcatFormat } from '@mediaforge/ffmpeg-concat/types';
import ButtonDownload from '@/components/app/button-download.vue';
import MediaContainer from '@/components/app/media-container.vue';
import Dropdown from '@/components/ui/dropdown.vue';
import ProcessLayout from '@/layouts/process-layout/process-layout.vue';
import { useMediaStore } from '@/stores/media';
import ButtonConcat from './components/button-concat.vue';

const { isInProgress, medias, hasMedias, processedMediasCount } = storeToRefs(useMediaStore());

const format = ref<ConcatFormat>('mp4');

const hasProcessedMedias = computed<boolean>(() => !!processedMediasCount.value);
const concatableCount = computed<number>(() => medias.value.filter((media) => media.original.type === 'video').length);
const hasEnoughInputs = computed<boolean>(() => concatableCount.value > 1);
const canConcat = computed<boolean>(
  () => hasMedias.value && hasEnoughInputs.value && !hasProcessedMedias.value && !isInProgress.value,
);
const canDownload = computed<boolean>(() => hasProcessedMedias.value && !isInProgress.value);
const concatOptions = computed<Array<{ value: ConcatFormat; text: string }>>(() => [
  { value: 'mp4', text: 'mp4' },
  { value: 'webm', text: 'webm' },
]);
</script>

<style scoped>
.concat__media-wrapper {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
</style>
