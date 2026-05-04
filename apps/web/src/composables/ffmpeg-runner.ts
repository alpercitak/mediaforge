import { useFFmpegStore } from '@/stores/ffmpeg';

type FfmpegInput = {
  id: string;
  file: File;
  extension: string;
};

type FfmpegIo = {
  inputs: Array<string>;
  output: string;
};

type FfmpegRunOptions = {
  inputs: Array<FfmpegInput>;
  output: string;
  mimeType: string;
  buildArgs: (io: FfmpegIo) => Array<string>;
};

export const useFfmpegRunner = () => {
  const { getFFmpeg, resetProgress } = useFFmpegStore();

  const runFfmpeg = async (options: FfmpegRunOptions): Promise<string> => {
    const { ffmpeg, fetchFile } = await getFFmpeg();
    const inputNames = options.inputs.map(({ id, extension }) => `${id}-i.${extension}`);

    try {
      for (const [index, item] of options.inputs.entries()) {
        const name = inputNames[index];
        if (!name) {
          continue;
        }
        await ffmpeg.writeFile(name, await fetchFile(item.file));
      }

      await ffmpeg.exec(options.buildArgs({ inputs: inputNames, output: options.output }));
      const data = await ffmpeg.readFile(options.output);
      const bytes = data instanceof Uint8Array ? data.byteLength : 0;
      if (!bytes) {
        throw new Error('FFmpeg produced empty output.');
      }
      return URL.createObjectURL(new Blob([data as BlobPart], { type: options.mimeType }));
    } finally {
      for (const name of inputNames) {
        try {
          await ffmpeg.deleteFile(name);
        } catch {
          // ignore cleanup errors
        }
      }

      try {
        await ffmpeg.deleteFile(options.output);
      } catch {
        // ignore cleanup errors
      }

      resetProgress();
    }
  };

  return {
    runFfmpeg,
  };
};
