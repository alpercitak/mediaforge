import { describe, expect, it } from 'vitest';
import { getFFmpegConvertArgs } from '../src/utils';
import { APNG_ARGS, GIF_ARGS, MP4_ARGS, WEBM_ARGS, WEBP_ARGS } from './fixtures/ffmpeg-args';

const BASE_OPTIONS = {
  input: 'input.mp4',
  fps: 24,
  width: 320,
  colors: 256,
};

describe('ffmpeg-convert', () => {
  it('should generate [apng] args correctly', () => {
    const args = getFFmpegConvertArgs('apng', { ...BASE_OPTIONS, output: 'output.apng' });
    expect(args).toStrictEqual(APNG_ARGS);
  });

  it('should generate [gif] args correctly', () => {
    const args = getFFmpegConvertArgs('gif', { ...BASE_OPTIONS, output: 'output.gif' });
    expect(args).toStrictEqual(GIF_ARGS);
  });

  it('should generate [mp4] args correctly', () => {
    const args = getFFmpegConvertArgs('mp4', { ...BASE_OPTIONS, output: 'output.mp4' });
    expect(args).toStrictEqual(MP4_ARGS);
  });

  it('should generate [webm] args correctly', () => {
    const args = getFFmpegConvertArgs('webm', { ...BASE_OPTIONS, output: 'output.webm' });
    expect(args).toStrictEqual(WEBM_ARGS);
  });

  it('should generate [webp] args correctly', () => {
    const args = getFFmpegConvertArgs('webp', { ...BASE_OPTIONS, output: 'output.webp' });
    expect(args).toStrictEqual(WEBP_ARGS);
  });
});
