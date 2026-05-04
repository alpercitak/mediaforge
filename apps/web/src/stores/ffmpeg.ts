import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { FFmpeg as FFmpegType } from '@ffmpeg/ffmpeg';

let fetchFileFn: typeof import('@ffmpeg/util').fetchFile | null = null;

export const useFFmpegStore = defineStore('ffmpeg', () => {
  const ffmpegInstance = ref<FFmpegType | null>(null);
  const progressValue = ref<number>(0);

  const ffmpegLoaded = computed<boolean>(() => !!ffmpegInstance.value);

  let progressBound = false;

  const loadFFmpeg = async (): Promise<FFmpegType> => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const ffmpeg = new FFmpeg();

    if (!progressBound) {
      ffmpeg.on('progress', ({ progress }) => {
        progressValue.value = Math.round(progress * 100);
      });
      progressBound = true;
    }

    await ffmpeg.load();
    return ffmpeg;
  };
  const getFFmpegInstance = async () => {
    progressValue.value = 0;
    if (!ffmpegInstance.value) {
      ffmpegInstance.value = await loadFFmpeg();
    }
    return ffmpegInstance.value;
  };
  const getFFmpegFetchFile = async () => {
    if (!fetchFileFn) {
      const util = await import('@ffmpeg/util');
      fetchFileFn = util.fetchFile;
    }
    return fetchFileFn;
  };
  const getFFmpeg = async () => ({
    ffmpeg: await getFFmpegInstance(),
    fetchFile: await getFFmpegFetchFile(),
  });
  const resetProgress = (): void => {
    progressValue.value = 0;
  };

  return {
    progressValue,
    ffmpegLoaded,
    getFFmpeg,
    resetProgress,
  };
});
