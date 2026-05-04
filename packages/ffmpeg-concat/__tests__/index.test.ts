import { describe, expect, it } from 'vitest';
import { getFFmpegConcatArgs } from '../src/utils';
import { MP4_CONCAT_ARGS, WEBM_CONCAT_ARGS } from './fixtures/ffmpeg-args';

describe('ffmpeg-concat', () => {
  it('should return empty args when inputs are less than two', () => {
    const args = getFFmpegConcatArgs({
      inputs: ['single.mp4'],
      output: 'out.mp4',
      format: 'mp4',
    });
    expect(args).toStrictEqual([]);
  });

  it('should generate [mp4] args correctly', () => {
    const args = getFFmpegConcatArgs({
      inputs: ['a.mp4', 'b.mp4'],
      output: 'out.mp4',
      format: 'mp4' as const,
      width: 320,
      fps: 24,
    });
    console.log(args);
    expect(args).toStrictEqual(MP4_CONCAT_ARGS);
  });

  it('should generate [webm] args correctly', () => {
    const args = getFFmpegConcatArgs({
      inputs: ['a.webm', 'b.webm'],
      output: 'out.webm',
      format: 'webm',
      width: 320,
      fps: 24,
    });
    console.log(args);
    expect(args).toStrictEqual(WEBM_CONCAT_ARGS);
  });
});
