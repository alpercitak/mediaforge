import { storeToRefs } from 'pinia';
import type { MediaExtension, MediaType } from '@mediaforge/media/types';
import { useMediaStore } from '@/stores/media';

const EXTENSIONS: ReadonlyArray<string> = ['gif', 'jpg', 'mp4', 'png', 'webm', 'webp'] satisfies Array<MediaExtension>;

// Unsupported containers (mov, heic, …) are processed under the default extension of their media type.
const DEFAULT_EXTENSION = { image: 'png', video: 'mp4' } as const satisfies Record<MediaType, MediaExtension>;

const isMediaType = (value: string): value is MediaType => value === 'image' || value === 'video';

const isMediaExtension = (value: string): value is MediaExtension => EXTENSIONS.includes(value);

const extractExtension = (file: File, type: MediaType): MediaExtension => {
  const suffix = file.name.split('.').pop()?.toLowerCase() ?? '';
  const extension = suffix === 'jpeg' ? 'jpg' : suffix;
  return isMediaExtension(extension) ? extension : DEFAULT_EXTENSION[type];
};

export const useFileInput = () => {
  const mediaStore = useMediaStore();
  const { medias } = storeToRefs(mediaStore);
  const { clearMedias } = mediaStore;

  const processFiles = (fileList: FileList | null): void => {
    clearMedias();
    medias.value = Array.from(fileList ?? []).flatMap((file) => {
      const type = file.type.split('/')[0] ?? '';
      if (!isMediaType(type)) {
        return [];
      }
      return [
        {
          id: crypto.randomUUID(),
          file,
          original: {
            src: URL.createObjectURL(file),
            extension: extractExtension(file, type),
            type,
          },
        },
      ];
    });
  };

  return {
    processFiles,
  };
};
