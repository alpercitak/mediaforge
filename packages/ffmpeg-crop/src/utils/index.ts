import { ffmpegArg } from '@mediaforge/ffmpeg/utils';
import type { MediaType } from '@mediaforge/media/types';
import type { CropOptions } from '../types';

export const getFFmpegCropArgs = (type: MediaType, options: CropOptions): Array<string> => {
  const args: Array<string> = [];

  args.push(...ffmpegArg('-i', options.input));

  args.push(
    ...ffmpegArg('-vf', `crop=${options.crop.width}:${options.crop.height}:${options.crop.x}:${options.crop.y}`),
  );

  if (type === 'video') {
    args.push(...ffmpegArg('-preset', 'ultrafast'));
  } else if (type === 'image') {
    args.push(...ffmpegArg('-frames:v', '1'));
  }

  args.push(options.output);

  return args;
};
