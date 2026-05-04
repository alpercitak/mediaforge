import { describe, expect, it } from 'vitest';
import { getFFmpegCropArgs } from '../src/utils';
import { VIDEO_ARGS, IMAGE_ARGS } from './fixtures/ffmpeg-args';

const BASE_OPTIONS = {
  crop: { x: 20, y: 40, width: 400, height: 320 },
};

describe('ffmpeg-crop', () => {
  it('should generate [video] args correctly', () => {
    const args = getFFmpegCropArgs('video', { ...BASE_OPTIONS, input: 'input.mp4', output: 'output.mp4' });
    expect(args).toStrictEqual(VIDEO_ARGS);
  });

  it('should generate [image] args correctly', () => {
    const args = getFFmpegCropArgs('image', { ...BASE_OPTIONS, input: 'input.jpg', output: 'output.jpg' });
    expect(args).toStrictEqual(IMAGE_ARGS);
  });
});
