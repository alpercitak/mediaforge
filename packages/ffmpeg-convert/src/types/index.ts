import type { QualityOptions } from '@mediaforge/ffmpeg/types';
import type { MediaFormat } from '@mediaforge/media/types';

export type ConvertFormat = Extract<MediaFormat, 'apng' | 'gif' | 'mp4' | 'webm' | 'webp'>;

export interface ConvertOptions extends QualityOptions {
  input: string;
  output: string;
  startTime?: number;
  duration?: number;
}
