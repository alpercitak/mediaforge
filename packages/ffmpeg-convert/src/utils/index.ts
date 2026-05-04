import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { MediaFormat } from '@mediaforge/media/types';
import type { ConvertOptions } from '../types';

const baseFilter = ({ fps, width }: ConvertOptions): string => `fps=${fps},scale=${width}:-1:flags=lanczos`;

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
  ...ffmpegArg('-c:v', 'libvpx-vp9'),
  ...ffmpegArg('-pix_fmt', 'yuv420p'),
  ...ffmpegArg('-crf', '32'),
  ...ffmpegArg('-b:v', '0'),
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
    args.push(...ffmpegArg('-ss', String(options.startTime)));
  }

  args.push(...ffmpegArg('-i', options.input));

  if (options.duration) {
    args.push(...ffmpegArg('-t', String(options.duration)));
  }

  args.push(...formatArgs(options));

  args.push(options.output);

  return args;
};
