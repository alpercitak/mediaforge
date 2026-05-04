<template>
  <button @click="onConcat">Concat</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { MediaType } from '@mediaforge/media/types';
import { getMediaInfo } from '@mediaforge/media/utils';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import { getFFmpegConcatArgs } from '@mediaforge/ffmpeg-concat/utils';
import type { ConcatFormat } from '@mediaforge/ffmpeg-concat/types';
import { useMediaStore } from '@/stores/media';
import { useFfmpegRunner } from '@/composables/ffmpeg-runner';

const { medias } = storeToRefs(useMediaStore());
const { runFfmpeg } = useFfmpegRunner();

const props = defineProps<{
  format: ConcatFormat;
}>();

const toConcatable = (mediaType: MediaType): boolean => mediaType === 'video';

const onConcat = async (): Promise<void> => {
  const concatTargets = medias.value.filter((item) => toConcatable(item.original.type));
  if (concatTargets.length < 2) {
    return;
  }

  concatTargets.forEach((item) => {
    item.isInProgress = true;
    item.processed = undefined;
  });

  const { extension, type, mimeType } = getMediaInfo(props.format);
  const output = `concat-${Date.now()}-o.${extension}`;

  try {
    const preview = {
      src: await runFfmpeg({
        inputs: concatTargets.map((item) => ({ id: item.id, file: item.file, extension: item.original.extension })),
        output,
        mimeType,
        buildArgs: ({ inputs, output: outputName }) =>
          getFFmpegConcatArgs({
            inputs,
            output: outputName,
            format: props.format,
            ...QUALITY_OPTION_MAP.default,
          }),
      }),
      extension,
      type,
    };

    const target = concatTargets[0];
    if (target) {
      target.processed = preview;
    }
  } catch (error) {
    console.error('Concat failed:', error);
  } finally {
    concatTargets.forEach((item) => {
      item.isInProgress = false;
    });
  }
};
</script>
