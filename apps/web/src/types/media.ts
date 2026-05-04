export interface CoordinateDimension extends Dimension {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export type MediaExtension = Exclude<MediaFormat, 'apng'>;

export type MediaFormat = 'apng' | 'gif' | 'jpg' | 'mp4' | 'png' | 'webm' | 'webp';

export type MediaMimeType = 'image/png' | 'image/gif' | 'image/jpeg' | 'image/webp' | 'video/mp4' | 'video/webm';

export type MediaType = 'image' | 'video';

export type MediaInfo = {
  type: MediaType;
  extension: MediaExtension;
  mimeType: MediaMimeType;
};
