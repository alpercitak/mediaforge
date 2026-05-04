import type { CoordinateDimension } from '@mediaforge/media/types';

export type CropOptions = {
  input: string;
  output: string;
  crop: CoordinateDimension;
};
