import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import { QUALITY_OPTION_MAP } from '@mediaforge/ffmpeg/constants';
import type { Quality } from '@mediaforge/ffmpeg/types';
import type { ConvertFormat } from '@mediaforge/ffmpeg-convert/types';
import { CONVERT_FORMATS } from '@mediaforge/ffmpeg-convert/utils';
import type { Option } from '@/types';

const STORAGE_KEY = 'mediaforge:options' as const;

const DEFAULT_OPTION = {
  autoplay: true,
  controls: false,
  muted: true,
  loop: true,
  blur: false,
  convertFormat: 'gif',
  convertQuality: 'default',
} as const satisfies Option;

const isConvertFormat = (value: unknown): value is ConvertFormat => CONVERT_FORMATS.some((format) => format === value);

const isQuality = (value: unknown): value is Quality => typeof value === 'string' && value in QUALITY_OPTION_MAP;

const loadOption = (): Option => {
  if (typeof localStorage === 'undefined') {
    return { ...DEFAULT_OPTION };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_OPTION };
    }
    const parsed = JSON.parse(stored) as Partial<Option>;
    return {
      ...DEFAULT_OPTION,
      ...parsed,
      convertFormat: isConvertFormat(parsed.convertFormat) ? parsed.convertFormat : DEFAULT_OPTION.convertFormat,
      convertQuality: isQuality(parsed.convertQuality) ? parsed.convertQuality : DEFAULT_OPTION.convertQuality,
    };
  } catch {
    return { ...DEFAULT_OPTION };
  }
};

export const useOptionStore = defineStore('option', () => {
  const option = reactive<Option>(loadOption());

  watch(
    option,
    (value) => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  return {
    option,
  };
});
