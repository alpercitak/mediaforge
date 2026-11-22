import type { FFmpeg as FFmpegType } from '@ffmpeg/ffmpeg';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// ffmpeg-core.wasm (32 MB) exceeds Cloudflare Pages' 25 MiB file limit, so the core is loaded from pinned CDNs.
const CORE_VERSION = '0.12.10';
const CORE_CDNS = ['https://cdn.jsdelivr.net/npm', 'https://unpkg.com'] as const;

let fetchFileFn: typeof import('@ffmpeg/util').fetchFile | null = null;

export const useFFmpegStore = defineStore('ffmpeg', () => {
  const ffmpegInstance = ref<FFmpegType | null>(null);
  const ffmpegFailed = ref<boolean>(false);
  const progressValue = ref<number>(0);

  const ffmpegLoaded = computed<boolean>(() => !!ffmpegInstance.value);

  const loadFFmpeg = async (): Promise<FFmpegType> => {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    let lastError: unknown;

    for (const cdn of CORE_CDNS) {
      const baseURL = `${cdn}/@ffmpeg/core@${CORE_VERSION}/dist/esm`;
      const ffmpeg = new FFmpeg();
      ffmpeg.on('progress', ({ progress }) => {
        progressValue.value = Math.round(progress * 100);
      });

      try {
        await ffmpeg.load({ coreURL: `${baseURL}/ffmpeg-core.js`, wasmURL: `${baseURL}/ffmpeg-core.wasm` });
        return ffmpeg;
      } catch (error) {
        ffmpeg.terminate();
        lastError = error;
      }
    }

    throw lastError;
  };
  const getFFmpegInstance = async () => {
    progressValue.value = 0;
    if (!ffmpegInstance.value) {
      try {
        ffmpegInstance.value = await loadFFmpeg();
        ffmpegFailed.value = false;
      } catch (error) {
        ffmpegFailed.value = true;
        throw error;
      }
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
    ffmpegFailed,
    ffmpegLoaded,
    getFFmpeg,
    resetProgress,
  };
});
