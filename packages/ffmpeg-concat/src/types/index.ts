import type { MediaFormat } from '@mediaforge/media/types';

export type ConcatFormat = Extract<MediaFormat, 'mp4' | 'webm'>;

export type ConcatInput = {
  name: string;
  duration: number;
  hasAudio: boolean;
};

export type ConcatOptions = {
  inputs: Array<ConcatInput>;
  output: string;
  format: ConcatFormat;
  width: number;
  height: number;
  fps?: number;
};
