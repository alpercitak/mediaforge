import { MEDIA_MIME_MAP, MEDIA_TYPE_MAP } from '../constants';
import type { MediaExtension, MediaFormat, MediaInfo, MediaMimeType, MediaType } from '../types';

export const getMediaExtension = (format: MediaFormat): MediaExtension => (format === 'apng' ? 'png' : format);

export const getMediaMimeType = (format: MediaFormat): MediaMimeType => MEDIA_MIME_MAP[format];

export const getMediaType = (format: MediaFormat): MediaType => MEDIA_TYPE_MAP[format];

export const getMediaInfo = (format: MediaFormat): MediaInfo => ({
  type: getMediaType(format),
  extension: getMediaExtension(format),
  mimeType: getMediaMimeType(format),
});
