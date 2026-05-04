<template>
  <card class="media-container">
    <template #header>
      {{ media.file.type }}
    </template>
    <div class="media-container__content">
      <media-preview :media-item="media.original" />
      <media-preview v-if="media.processed" :media-item="media.processed" />
    </div>
    <media-overlay :blur="shouldBlur" :highlight="shouldHighlight" class="media-container__overlay" />
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useOptionStore } from '@/stores/option';
import type { Media } from '@/types';
import Card from '@/components/ui/card.vue';
import MediaPreview from '@/components/app/media-preview.vue';
import MediaOverlay from './media-overlay.vue';

const { option } = storeToRefs(useOptionStore());

const props = defineProps<{
  media: Media;
}>();

const shouldHighlight = computed<boolean>(() => !!props.media.isInProgress);
const shouldBlur = computed<boolean>(() => (shouldHighlight.value ? !props.media.processed?.src : option.value.blur));
</script>

<style scoped>
.media-container {
  position: relative;
}
.media-container__content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  overflow: hidden;
}
.media-container__overlay {
  position: absolute;
}
</style>
