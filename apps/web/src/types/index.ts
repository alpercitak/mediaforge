import type { Quality } from '@mediaforge/ffmpeg/types';
import type { ConvertFormat } from '@mediaforge/ffmpeg-convert/types';
import type { MediaExtension, MediaType } from '@mediaforge/media/types';

export type Media = {
  id: string;
  file: File;
  original: MediaItem;
  processed?: MediaItem;
  isInProgress?: boolean;
  failed?: boolean;
};

export type Medias = Array<Media>;

export type MediaItem = {
  src: string;
  type: MediaType;
  extension: MediaExtension;
};

export type Option = {
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  blur: boolean;
  convertFormat: ConvertFormat;
  convertQuality: Quality;
};
