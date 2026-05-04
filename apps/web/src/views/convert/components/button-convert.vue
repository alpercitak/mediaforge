<template>
  <Button @click="onConvert">Convert</Button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import { getFFmpegConvertArgs } from '@mediaforge/ffmpeg-convert/utils';
import type { MediaFormat } from '@mediaforge/media/types';
import { getMediaInfo } from '@mediaforge/media/utils';
import Button from '@/components/ui/button.vue';
import { useFfmpegRunner } from '@/composables/ffmpeg-runner';
import { useMediaStore } from '@/stores/media';

const { medias } = storeToRefs(useMediaStore());
const { runFfmpeg } = useFfmpegRunner();

const props = defineProps<{
  format: MediaFormat;
}>();

const onConvert = async (): Promise<void> => {
  if (!medias.value.length) {
    return;
  }

  for (let i = 0; i < medias.value.length; i++) {
    const item = medias.value[i];
    if (!item) {
      continue;
    }

    item.isInProgress = true;

    const { type, extension, mimeType } = getMediaInfo(props.format);

    const input = `${item.id}-i.${item.original.extension}`;
    const output = `${item.id}-o.${extension}`;

    try {
      item.processed = {
        src: await runFfmpeg({
          inputs: [{ id: item.id, file: item.file, extension: item.original.extension }],
          output,
          mimeType,
          buildArgs: ({ inputs, output: outputName }) =>
            getFFmpegConvertArgs(props.format, {
              input: inputs[0] ?? input,
              output: outputName,
              ...QUALITY_OPTION_MAP.default,
            }),
        }),
        extension,
        type,
      };
    } catch (error) {
      console.error('Convert failed:', error);
      item.processed = undefined;
    }

    item.isInProgress = false;
  }
};
</script>
