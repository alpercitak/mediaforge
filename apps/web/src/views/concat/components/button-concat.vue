<template>
  <Button @click="onConcat">Concat</Button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import type { ConcatFormat } from '@mediaforge/ffmpeg-concat/types';
import { getFFmpegConcatArgs } from '@mediaforge/ffmpeg-concat/utils';
import type { MediaType } from '@mediaforge/media/types';
import { getMediaInfo } from '@mediaforge/media/utils';
import Button from '@/components/ui/button.vue';
import { useFfmpegRunner } from '@/composables/ffmpeg-runner';
import { useMediaStore } from '@/stores/media';

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
        buildArgs: async ({ inputs, output: outputName, probe }) => {
          const probed = [];
          for (const name of inputs) {
            probed.push({ name, ...(await probe(name)) });
          }
          const [first] = probed;
          if (!first) {
            return [];
          }
          // Output matches the first clip's size; the others are scaled and padded into it.
          return getFFmpegConcatArgs({
            inputs: probed,
            output: outputName,
            format: props.format,
            width: first.width,
            height: first.height,
            fps: QUALITY_OPTION_MAP.default.fps,
          });
        },
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
