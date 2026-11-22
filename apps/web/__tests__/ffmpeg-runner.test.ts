import { describe, expect, it } from 'vitest';
import { parseProbe } from '@/composables/ffmpeg-runner';

const probe = (streams: Array<object>, duration?: string) => JSON.stringify({ streams, format: { duration } });

describe('parseProbe', () => {
  it('should read size, duration and audio presence', () => {
    const text = probe([{ codec_type: 'video', width: 640, height: 360 }, { codec_type: 'audio' }], '2.500000');
    expect(parseProbe(text, 'a.mp4')).toStrictEqual({ width: 640, height: 360, duration: 2.5, hasAudio: true });
  });

  it('should report no audio when there is no audio stream', () => {
    const text = probe([{ codec_type: 'video', width: 320, height: 240 }], '1');
    expect(parseProbe(text, 'b.mp4').hasAudio).toBe(false);
  });

  it('should reject output without a sized video stream or a positive duration', () => {
    expect(() => parseProbe(probe([{ codec_type: 'audio' }], '1'), 'c.mp3')).toThrow('FFprobe could not read c.mp3.');
    expect(() => parseProbe(probe([{ codec_type: 'video', width: 0, height: 0 }], '1'), 'd.webp')).toThrow();
    expect(() => parseProbe(probe([{ codec_type: 'video', width: 640, height: 360 }], 'N/A'), 'e.mp4')).toThrow();
    expect(() => parseProbe('', 'f.mp4')).toThrow();
  });

  it('should propagate malformed JSON', () => {
    expect(() => parseProbe('{', 'g.mp4')).toThrow(SyntaxError);
  });
});
