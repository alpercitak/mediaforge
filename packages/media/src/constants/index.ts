import type { MediaFormat, MediaMimeType, MediaType } from '../types';

export const MEDIA_MIME_MAP = {
  apng: 'image/png',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  mp4: 'video/mp4',
  webm: 'video/webm',
} as const satisfies Record<MediaFormat, MediaMimeType>;

export const MEDIA_TYPE_MAP = {
  apng: 'image',
  gif: 'image',
  jpg: 'image',
  png: 'image',
  webp: 'image',
  mp4: 'video',
  webm: 'video',
} as const satisfies Record<MediaFormat, MediaType>;
