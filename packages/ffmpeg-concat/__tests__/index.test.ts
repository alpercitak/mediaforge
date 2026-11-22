import { describe, expect, it } from 'vitest';
import { getFFmpegConcatArgs } from '../src/utils';
import {
  MP4_AUDIO_CONCAT_ARGS,
  MP4_CONCAT_ARGS,
  WEBM_AUDIO_CONCAT_ARGS,
  WEBM_CONCAT_ARGS,
} from './fixtures/ffmpeg-args';

const silent = (name: string, duration: number) => ({ name, duration, hasAudio: false });
const withAudio = (name: string, duration: number) => ({ name, duration, hasAudio: true });

describe('ffmpeg-concat', () => {
  it('should return empty args when inputs are less than two', () => {
    const args = getFFmpegConcatArgs({
      inputs: [silent('single.mp4', 1)],
      output: 'out.mp4',
      format: 'mp4',
      width: 320,
      height: 180,
    });
    expect(args).toStrictEqual([]);
  });

  it('should generate [mp4] args without audio when no input has audio', () => {
    const args = getFFmpegConcatArgs({
      inputs: [silent('a.mp4', 2.5), silent('b.mp4', 1.5)],
      output: 'out.mp4',
      format: 'mp4',
      width: 320,
      height: 180,
      fps: 24,
    });
    expect(args).toStrictEqual(MP4_CONCAT_ARGS);
  });

  it('should generate [webm] args without audio when no input has audio', () => {
    const args = getFFmpegConcatArgs({
      inputs: [silent('a.webm', 2.5), silent('b.webm', 1.5)],
      output: 'out.webm',
      format: 'webm',
      width: 320,
      height: 180,
      fps: 24,
    });
    expect(args).toStrictEqual(WEBM_CONCAT_ARGS);
  });

  it('should keep audio and fill silent inputs with silence for [mp4]', () => {
    const args = getFFmpegConcatArgs({
      inputs: [withAudio('a.mp4', 2.5), silent('b.mp4', 1.5)],
      output: 'out.mp4',
      format: 'mp4',
      width: 320,
      height: 180,
      fps: 24,
    });
    expect(args).toStrictEqual(MP4_AUDIO_CONCAT_ARGS);
  });

  it('should keep audio and fill silent inputs with silence for [webm]', () => {
    const args = getFFmpegConcatArgs({
      inputs: [withAudio('a.webm', 2.5), silent('b.webm', 1.5)],
      output: 'out.webm',
      format: 'webm',
      width: 320,
      height: 180,
      fps: 24,
    });
    expect(args).toStrictEqual(WEBM_AUDIO_CONCAT_ARGS);
  });

  it('should round odd output dimensions down to even', () => {
    const args = getFFmpegConcatArgs({
      inputs: [silent('a.mp4', 1), silent('b.mp4', 1)],
      output: 'out.mp4',
      format: 'mp4',
      width: 641,
      height: 361,
    });
    expect(args[5]).toContain('scale=640:360:');
    expect(args[5]).toContain('pad=640:360:');
  });
});
