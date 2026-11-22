import { useFFmpegStore } from '@/stores/ffmpeg';

type FfmpegInput = {
  id: string;
  file: File;
  extension: string;
};

export type MediaProbe = {
  width: number;
  height: number;
  duration: number;
  hasAudio: boolean;
};

type ProbeOutput = {
  streams?: Array<{ codec_type?: string; width?: number; height?: number }>;
  format?: { duration?: string };
};

type FfmpegIo = {
  inputs: Array<string>;
  output: string;
  probe: (name: string) => Promise<MediaProbe>;
};

type FfmpegRunOptions = {
  inputs: Array<FfmpegInput>;
  output: string;
  mimeType: string;
  buildArgs: (io: FfmpegIo) => Array<string> | Promise<Array<string>>;
};

export const useFfmpegRunner = () => {
  const { getFFmpeg, resetProgress } = useFFmpegStore();

  const runFfmpeg = async (options: FfmpegRunOptions): Promise<string> => {
    const { ffmpeg, fetchFile } = await getFFmpeg();
    const inputNames = options.inputs.map(({ id, extension }) => `${id}-i.${extension}`);

    const probe = async (name: string): Promise<MediaProbe> => {
      const output = `${name}.probe.json`;
      try {
        await ffmpeg.ffprobe([
          ...['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration'],
          ...['-of', 'json', name, '-o', output],
        ]);
        const text = await ffmpeg.readFile(output, 'utf8');
        const { streams = [], format }: ProbeOutput = JSON.parse(typeof text === 'string' ? text : '{}');
        const video = streams.find(({ codec_type }) => codec_type === 'video');
        const duration = Number(format?.duration);
        if (!video?.width || !video.height || !(duration > 0)) {
          throw new Error(`FFprobe could not read ${name}.`);
        }
        return {
          width: video.width,
          height: video.height,
          duration,
          hasAudio: streams.some(({ codec_type }) => codec_type === 'audio'),
        };
      } finally {
        await ffmpeg.deleteFile(output).catch(() => {});
      }
    };

    try {
      for (const [index, item] of options.inputs.entries()) {
        const name = inputNames[index];
        if (!name) {
          continue;
        }
        await ffmpeg.writeFile(name, await fetchFile(item.file));
      }

      await ffmpeg.exec(await options.buildArgs({ inputs: inputNames, output: options.output, probe }));
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
