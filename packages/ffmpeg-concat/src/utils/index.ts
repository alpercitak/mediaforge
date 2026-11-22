import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { ConcatFormat, ConcatInput, ConcatOptions } from '../types';

const SAMPLE_RATE = 48000;

const makeEven = (num: number): number => num - (num % 2);

const videoFilter = (index: number, width: number, height: number, fps?: number): string => {
  const chain = fps ? [`fps=${fps}`] : [];
  chain.push(
    `scale=${width}:${height}:force_original_aspect_ratio=decrease`,
    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
    'setsar=1',
  );
  return `[${index}:v]${chain.join(',')}[v${index}]`;
};

// Every segment needs audio of its own length for concat: real audio is normalized and padded/trimmed, silent clips get silence.
const audioFilter = ({ duration, hasAudio }: ConcatInput, index: number): string =>
  hasAudio
    ? `[${index}:a]aresample=${SAMPLE_RATE},aformat=sample_fmts=fltp:channel_layouts=stereo,apad,atrim=duration=${duration}[a${index}]`
    : `anullsrc=r=${SAMPLE_RATE}:cl=stereo,atrim=duration=${duration}[a${index}]`;

const concatFilter = ({ inputs, width, height, fps }: ConcatOptions, withAudio: boolean): string => {
  const filters = inputs.map((_, i) => videoFilter(i, makeEven(width), makeEven(height), fps));
  if (withAudio) {
    filters.push(...inputs.map(audioFilter));
  }

  const streams = inputs.map((_, i) => (withAudio ? `[v${i}][a${i}]` : `[v${i}]`)).join('');
  filters.push(`${streams}concat=n=${inputs.length}:v=1:a=${withAudio ? 1 : 0}[v]${withAudio ? '[a]' : ''}`);

  return filters.join(';');
};

const formatArgs = (format: ConcatFormat, withAudio: boolean): Array<string> => {
  if (format === 'webm') {
    return [
      // libvpx-vp9 crashes ffmpeg.wasm 0.12 (memory access out of bounds), so webm uses VP8.
      ...ffmpegArg('-c:v', 'libvpx'),
      ...ffmpegArg('-pix_fmt', 'yuv420p'),
      ...ffmpegArg('-crf', '10'),
      ...ffmpegArg('-b:v', '1M'),
      ...ffmpegArg('-deadline', 'good'),
      ...ffmpegArg('-cpu-used', '4'),
      // libopus crashes ffmpeg.wasm 0.12 in the concat graph, so webm audio uses Vorbis.
      ...(withAudio ? [...ffmpegArg('-c:a', 'libvorbis'), ...ffmpegArg('-q:a', '4')] : []),
    ];
  }

  return [
    ...ffmpegArg('-c:v', 'libx264'),
    ...ffmpegArg('-preset', 'ultrafast'),
    ...ffmpegArg('-crf', '28'),
    ...ffmpegArg('-pix_fmt', 'yuv420p'),
    ...(withAudio ? [...ffmpegArg('-c:a', 'aac'), ...ffmpegArg('-b:a', '128k')] : []),
    ...ffmpegArg('-movflags', '+faststart'),
  ];
};

export const getFFmpegConcatArgs = (options: ConcatOptions): Array<string> => {
  const args: Array<string> = [];

  if (options.inputs.length < 2) {
    return args;
  }

  const withAudio = options.inputs.some(({ hasAudio }) => hasAudio);

  for (const { name } of options.inputs) {
    args.push(...ffmpegArg('-i', name));
  }

  args.push(...ffmpegArg('-filter_complex', concatFilter(options, withAudio)));
  args.push(...ffmpegArg('-map', '[v]'));
  if (withAudio) {
    args.push(...ffmpegArg('-map', '[a]'));
  }
  args.push(...formatArgs(options.format, withAudio));
  args.push(options.output);

  return args;
};
