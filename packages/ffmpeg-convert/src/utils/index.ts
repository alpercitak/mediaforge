import type { MediaFormat } from '@mediaforge/media/types';
import type { ConvertOptions } from '../types';

const arg = (...args: Array<string>): Array<string> => args;

const baseFilter = ({ fps, width }: ConvertOptions): string => `fps=${fps},scale=${width}:-1:flags=lanczos`;

const apngArgs = (o: ConvertOptions): Array<string> => [
  ...arg('-vf', baseFilter(o)),
  ...arg('-f', 'apng'),
  ...arg('-plays', '0'),
  ...arg('-preset', 'ultrafast'),
];

const gifArgs = (o: ConvertOptions): Array<string> => {
  const palette = `split[s0][s1];[s0]palettegen=max_colors=${o.colors}:stats_mode=diff[p]`;
  const apply = `[s1][p]paletteuse=dither=floyd_steinberg:diff_mode=rectangle`;
  return [...arg('-vf', `${baseFilter(o)},${palette};${apply}`), ...arg('-loop', '0'), ...arg('-preset', 'ultrafast')];
};

const mp4Args = (o: ConvertOptions): Array<string> => [
  ...arg('-vf', baseFilter(o)),
  ...arg('-c:v', 'libx264'),
  ...arg('-preset', 'ultrafast'),
  ...arg('-crf', '28'),
  ...arg('-movflags', '+faststart'),
];

const webmArgs = (o: ConvertOptions): Array<string> => [
  ...arg('-vf', baseFilter(o)),
  ...arg('-c:v', 'libvpx-vp9'),
  ...arg('-pix_fmt', 'yuv420p'),
  ...arg('-crf', '32'),
  ...arg('-b:v', '0'),
  ...arg('-deadline', 'good'),
  ...arg('-cpu-used', '4'),
];

const webpArgs = (o: ConvertOptions): Array<string> => [
  ...arg('-vf', baseFilter(o)),
  ...arg('-c:v', 'libwebp'),
  ...arg('-pix_fmt', 'yuva420p'),
  ...arg('-loop', '0'),
  ...arg('-lossless', '0'),
  ...arg('-q:v', '80'),
];

const FORMAT_ARGS: Partial<Record<MediaFormat, (o: ConvertOptions) => Array<string>>> = {
  apng: apngArgs,
  gif: gifArgs,
  mp4: mp4Args,
  webm: webmArgs,
  webp: webpArgs,
};

export const getFFmpegConvertArgs = (format: MediaFormat, options: ConvertOptions): Array<string> => {
  const formatArgs = FORMAT_ARGS[format];
  if (!formatArgs) {
    return [];
  }

  const args: Array<string> = [];

  if (options.startTime && options.startTime > 0) {
    args.push(...arg('-ss', String(options.startTime)));
  }

  args.push(...arg('-i', options.input));

  if (options.duration) {
    args.push(...arg('-t', String(options.duration)));
  }

  args.push(...formatArgs(options));

  args.push(options.output);

  return args;
};
