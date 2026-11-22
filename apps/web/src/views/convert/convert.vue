<template>
  <process-layout>
    <template #header>
      <div class="convert__options">
        <dropdown :options="qualityOptions" v-model="option.convertQuality" />
        <dropdown :options="convertOptions" v-model="option.convertFormat" />
      </div>
    </template>
    <div class="convert__media-wrapper">
      <media-container v-for="media in medias" :media="media" :key="media.id" />
    </div>
    <template #footer>
      <button-convert v-if="canConvert" :format="option.convertFormat" :quality="option.convertQuality" />
      <button-download v-if="canDownload" />
    </template>
  </process-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import { CONVERT_FORMATS } from '@mediaforge/ffmpeg-convert/utils';
import ButtonDownload from '@/components/app/button-download.vue';
import MediaContainer from '@/components/app/media-container.vue';
import Dropdown from '@/components/ui/dropdown.vue';
import ProcessLayout from '@/layouts/process-layout/process-layout.vue';
import { useMediaStore } from '@/stores/media';
import { useOptionStore } from '@/stores/option';
import ButtonConvert from './components/button-convert.vue';

const { isInProgress, medias, hasMedias, processedMediasCount } = storeToRefs(useMediaStore());

const { option } = storeToRefs(useOptionStore());

const hasProcessedMedias = computed<boolean>(() => !!processedMediasCount.value);
const canConvert = computed<boolean>(() => hasMedias.value && !hasProcessedMedias.value && !isInProgress.value);
const canDownload = computed<boolean>(() => hasProcessedMedias.value && !isInProgress.value);
const qualityOptions = Object.entries(QUALITY_OPTION_MAP).map(([value, { width, fps }]) => ({
  value,
  text: `${value} · ${width}px · ${fps}fps`,
}));
const convertOptions = CONVERT_FORMATS.map((value) => ({ value, text: value }));
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
