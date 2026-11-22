import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { MediaType } from '@mediaforge/media/types';
import type { CropOptions } from '../types';

// yuv420p video encoders (libx264) reject odd dimensions.
const floorEven = (value: number): number => value - (value % 2);

export const getFFmpegCropArgs = (type: MediaType, options: CropOptions): Array<string> => {
  const args: Array<string> = [];
  const { x, y } = options.crop;
  const width = type === 'video' ? floorEven(options.crop.width) : options.crop.width;
  const height = type === 'video' ? floorEven(options.crop.height) : options.crop.height;

  args.push(...ffmpegArg('-i', options.input));

  args.push(...ffmpegArg('-vf', `crop=${width}:${height}:${x}:${y}`));

  if (type === 'video') {
    args.push(...ffmpegArg('-preset', 'ultrafast'));
  } else if (type === 'image') {
    args.push(...ffmpegArg('-frames:v', '1'));
  }

  args.push(options.output);

  return args;
};
