import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import type { Media } from '@/types';
import type { Dimension, CoordinateDimension } from '@mediaforge/media/types';
import { useMediaStore } from '@/stores/media';

export const useCropStore = defineStore('crop', () => {
  const { medias } = storeToRefs(useMediaStore());

  const containerDimensions = ref<Dimension>({ width: 0, height: 0 });
  const cropDimensions = ref<CoordinateDimension>({ height: 0, width: 0, x: 0, y: 0 });
  const mediaDimensions = ref<Dimension>({ width: 0, height: 0 });

  const scaleX = computed<number>(() =>
    containerDimensions.value.width ? mediaDimensions.value.width / containerDimensions.value.width : 1,
  );
  const scaleY = computed<number>(() =>
    containerDimensions.value.height ? mediaDimensions.value.height / containerDimensions.value.height : 1,
  );
  const scaledCrop = computed<CoordinateDimension>(() => ({
    x: Math.round(cropDimensions.value.x * scaleX.value),
    y: Math.round(cropDimensions.value.y * scaleY.value),
    width: Math.round(cropDimensions.value.width * scaleX.value),
    height: Math.round(cropDimensions.value.height * scaleY.value),
  }));
  const media = computed<Media | undefined>({
    get: (): Media | undefined => medias.value?.[0],
    set: (newValue: Media | undefined): void => {
      if (medias.value && newValue) {
        medias.value[0] = newValue;
      }
    },
  });

  return {
    containerDimensions,
    cropDimensions,
    media,
    mediaDimensions,
    scaledCrop,
  };
});
