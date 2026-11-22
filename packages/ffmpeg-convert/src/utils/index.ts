import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { ConvertFormat, ConvertOptions } from '../types';

export const CONVERT_FORMATS: ReadonlyArray<ConvertFormat> = ['gif', 'webp', 'apng', 'mp4', 'webm'];

// Presets cap the width; smaller sources keep their own width instead of being upscaled.
const baseFilter = ({ fps, width }: ConvertOptions): string =>
  `fps=${fps},scale=w=min(${width}\\,iw):h=-2:flags=lanczos`;

const apngArgs = (o: ConvertOptions): Array<string> => [
  ...ffmpegArg('-vf', baseFilter(o)),
  ...ffmpegArg('-f', 'apng'),
  ...ffmpegArg('-plays', '0'),
  ...ffmpegArg('-preset', 'ultrafast'),
];

const gifArgs = (o: ConvertOptions): Array<string> => {
  const palette = `split[s0][s1];[s0]palettegen=max_colors=${o.colors}:stats_mode=diff[p]`;
  const apply = `[s1][p]paletteuse=dither=floyd_steinberg:diff_mode=rectangle`;
  return [
    ...ffmpegArg('-vf', `${baseFilter(o)},${palette};${apply}`),
    ...ffmpegArg('-loop', '0'),
    ...ffmpegArg('-preset', 'ultrafast'),
  ];
};

const mp4Args = (o: ConvertOptions): Array<string> => [
  ...ffmpegArg('-vf', baseFilter(o)),
  ...ffmpegArg('-c:v', 'libx264'),
  ...ffmpegArg('-preset', 'ultrafast'),
  ...ffmpegArg('-crf', '28'),
  ...ffmpegArg('-movflags', '+faststart'),
];

const webmArgs = (o: ConvertOptions): Array<string> => [
  ...ffmpegArg('-vf', baseFilter(o)),
  // libvpx-vp9 crashes ffmpeg.wasm 0.12 (memory access out of bounds), so webm uses VP8.
  ...ffmpegArg('-c:v', 'libvpx'),
  ...ffmpegArg('-pix_fmt', 'yuv420p'),
  ...ffmpegArg('-crf', '10'),
  ...ffmpegArg('-b:v', '1M'),
  ...ffmpegArg('-deadline', 'good'),
  ...ffmpegArg('-cpu-used', '4'),
];

const webpArgs = (o: ConvertOptions): Array<string> => [
  ...ffmpegArg('-vf', baseFilter(o)),
  ...ffmpegArg('-c:v', 'libwebp'),
  ...ffmpegArg('-pix_fmt', 'yuva420p'),
  ...ffmpegArg('-loop', '0'),
  ...ffmpegArg('-lossless', '0'),
  ...ffmpegArg('-q:v', '80'),
];

const FORMAT_ARGS: Record<ConvertFormat, (o: ConvertOptions) => Array<string>> = {
  apng: apngArgs,
  gif: gifArgs,
  mp4: mp4Args,
  webm: webmArgs,
  webp: webpArgs,
};

export const getFFmpegConvertArgs = (format: ConvertFormat, options: ConvertOptions): Array<string> => {
  const args: Array<string> = [];

  if (options.startTime && options.startTime > 0) {
    args.push(...ffmpegArg('-ss', String(options.startTime)));
  }

  args.push(...ffmpegArg('-i', options.input));

  if (options.duration) {
    args.push(...ffmpegArg('-t', String(options.duration)));
  }

  args.push(...FORMAT_ARGS[format](options));

  args.push(options.output);

  return args;
};
