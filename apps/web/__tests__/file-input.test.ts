import { describe, expect, it } from 'vitest';
import { extractExtension, isMediaType } from '@/layouts/process-layout/composables/file-input';

const file = (name: string) => new File([], name);

describe('file-input', () => {
  it('should accept only image and video media types', () => {
    expect(isMediaType('image')).toBe(true);
    expect(isMediaType('video')).toBe(true);
    expect(isMediaType('application')).toBe(false);
    expect(isMediaType('')).toBe(false);
  });

  it('should lowercase extensions and map jpeg to jpg', () => {
    expect(extractExtension(file('IMG.JPG'), 'image')).toBe('jpg');
    expect(extractExtension(file('photo.jpeg'), 'image')).toBe('jpg');
    expect(extractExtension(file('clip.MP4'), 'video')).toBe('mp4');
    expect(extractExtension(file('my.clip.webm'), 'video')).toBe('webm');
  });

  it('should fall back to the media type default for unsupported or missing extensions', () => {
    expect(extractExtension(file('clip.mov'), 'video')).toBe('mp4');
    expect(extractExtension(file('photo.heic'), 'image')).toBe('png');
    expect(extractExtension(file('noextension'), 'video')).toBe('mp4');
  });
});
