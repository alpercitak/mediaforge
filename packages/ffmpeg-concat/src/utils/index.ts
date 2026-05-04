import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { ConcatFormat, ConcatOptions } from '../types';

const buildInputFilters = (count: number, fps?: number, width?: number): string => {
  const inputFilters = Array.from({ length: count }, (_, i) => {
    const label = `[v${i}]`;
    const source = `[${i}:v:0]`;
    const filters = [fps ? `fps=${fps}` : '', width ? `scale=${width}:-1:flags=lanczos` : ''].filter(Boolean).join(',');
    return `${source}${filters ? `${filters}` : ''}${label}`;
  });

  return inputFilters.join(';');
};

const formatArgs = (format: ConcatFormat): Array<string> => {
  if (format === 'webm') {
    return [
      ...ffmpegArg('-c:v', 'libvpx-vp9'),
      ...ffmpegArg('-pix_fmt', 'yuv420p'),
      ...ffmpegArg('-crf', '32'),
      ...ffmpegArg('-b:v', '0'),
      ...ffmpegArg('-deadline', 'good'),
      ...ffmpegArg('-cpu-used', '4'),
    ];
  }

  return [
    ...ffmpegArg('-c:v', 'libx264'),
    ...ffmpegArg('-preset', 'ultrafast'),
    ...ffmpegArg('-crf', '28'),
    ...ffmpegArg('-pix_fmt', 'yuv420p'),
    ...ffmpegArg('-movflags', '+faststart'),
  ];
};

const concatFilter = (count: number, fps?: number, width?: number): string => {
  const hasNormalize = Boolean(fps || width);
  if (!hasNormalize) {
    const streams = Array.from({ length: count }, (_, i) => `[${i}:v:0]`).join('');
    return `${streams}concat=n=${count}:v=1:a=0[v]`;
  }

  const inputFilters = buildInputFilters(count, fps, width);

  const concatInputs = Array.from({ length: count }, (_, i) => `[v${i}]`).join('');
  return `${inputFilters};${concatInputs}concat=n=${count}:v=1:a=0[v]`;
};

export const getFFmpegConcatArgs = (options: ConcatOptions): Array<string> => {
  const args: Array<string> = [];

  if (options.inputs.length < 2) {
    return args;
  }

  for (const input of options.inputs) {
    args.push(...ffmpegArg('-i', input));
  }

  args.push(...ffmpegArg('-filter_complex', concatFilter(options.inputs.length, options.fps, options.width)));
  args.push(...ffmpegArg('-map', '[v]'));
  args.push(...formatArgs(options.format));
  args.push(options.output);

  return args;
};
