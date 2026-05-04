import type { MediaFormat } from '@mediaforge/media/types';

export type ConcatFormat = Extract<MediaFormat, 'mp4' | 'webm'>;

export type ConcatOptions = {
  inputs: Array<string>;
  output: string;
  format: ConcatFormat;
  width?: number;
  fps?: number;
};
