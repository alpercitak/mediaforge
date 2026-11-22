<template>
  <Button @click="onCrop">Crop</Button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { getFFmpegCropArgs } from '@mediaforge/ffmpeg-crop/utils';
import { getMediaInfo } from '@mediaforge/media/utils';
import Button from '@/components/ui/button.vue';
import { useFfmpegRunner } from '@/composables/ffmpeg-runner';
import { useCropStore } from '../stores/crop';

const { media, scaledCrop } = storeToRefs(useCropStore());
const { runFfmpeg } = useFfmpegRunner();

const onCrop = async (): Promise<void> => {
  if (!scaledCrop.value.height || !media.value) {
    return;
  }

  if (media.value.processed) {
    URL.revokeObjectURL(media.value.processed.src);
  }

  media.value = {
    ...media.value,
    isInProgress: true,
    processed: undefined,
    failed: false,
  };

  const { extension, type, mimeType } = getMediaInfo(media.value.original.extension);

  const input = `${media.value.id}-i.${extension}`;
  const output = `${media.value.id}-o.${extension}`;

  try {
    media.value = {
      ...media.value,
      isInProgress: false,
      processed: {
        src: await runFfmpeg({
          inputs: [{ id: media.value.id, file: media.value.file, extension }],
          output,
          mimeType,
          buildArgs: ({ inputs, output: outputName }) =>
            getFFmpegCropArgs(type, { input: inputs[0] ?? input, output: outputName, crop: scaledCrop.value }),
        }),
        extension,
        type,
      },
    };
  } catch (error) {
    console.error('Crop failed:', error);
    media.value = {
      ...media.value,
      isInProgress: false,
      processed: undefined,
      failed: true,
    };
  }
};
</script>
