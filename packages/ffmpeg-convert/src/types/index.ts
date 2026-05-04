import type { QualityOptions } from '@mediaforge/ffmpeg/types';

export interface ConvertOptions extends QualityOptions {
  input: string;
  output: string;
  startTime?: number;
  duration?: number;
}
