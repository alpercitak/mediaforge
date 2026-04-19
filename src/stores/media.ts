import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Medias } from '@/types/app';

export const useMediaStore = defineStore('media', () => {
  const medias = ref<Medias>([]);

  const hasMedias = computed<boolean>(() => medias.value.length > 0);
  const processedMediasCount = computed<number>(() => medias.value.filter(({ processed }) => !!processed?.src).length);
  const isInProgress = computed<boolean>(() => medias.value.some(({ isInProgress }) => !!isInProgress));

  const clearMedias = (): void => {
    medias.value.forEach(({ original, processed }) => {
      original.src && URL.revokeObjectURL(original.src);
      processed?.src && URL.revokeObjectURL(processed.src);
    });
    medias.value = [];
  };

  return {
    medias,
    isInProgress,
    hasMedias,
    processedMediasCount,
    clearMedias,
  };
});
