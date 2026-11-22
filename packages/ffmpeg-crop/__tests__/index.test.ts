import { describe, expect, it } from 'vitest';
import { getFFmpegCropArgs } from '../src/utils';
import { IMAGE_ARGS, VIDEO_ARGS } from './fixtures/ffmpeg-args';

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

  it('should round odd [video] dimensions down to even', () => {
    const args = getFFmpegCropArgs('video', {
      crop: { x: 3, y: 5, width: 401, height: 321 },
      input: 'input.mp4',
      output: 'output.mp4',
    });
    expect(args).toContain('crop=400:320:3:5');
  });

  it('should keep odd [image] dimensions', () => {
    const args = getFFmpegCropArgs('image', {
      crop: { x: 3, y: 5, width: 401, height: 321 },
      input: 'input.jpg',
      output: 'output.jpg',
    });
    expect(args).toContain('crop=401:321:3:5');
  });
});
