import { storeToRefs } from 'pinia';
import { useMediaStore } from '@/stores/media';
import type { MediaExtension, MediaType } from '@/types/media';

export const extractExtension = (file: File): MediaExtension => (file.name.split('.').pop() ?? '') as MediaExtension;

export const extractType = (file: File): MediaType => (file.type.split('/')[0] ?? '') as MediaType;

export const useFileInput = () => {
  const mediaStore = useMediaStore();
  const { medias } = storeToRefs(mediaStore);
  const { clearMedias } = mediaStore;

  const processFiles = (fileList: FileList | null): void => {
    clearMedias();
    medias.value = Array.from(fileList ?? []).map((file) => ({
      id: crypto.randomUUID(),
      file,
      original: {
        src: URL.createObjectURL(file),
        extension: extractExtension(file),
        type: extractType(file),
      },
    }));
  };

  return {
    processFiles,
  };
};
