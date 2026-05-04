import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import type { Option } from '@/types';

const STORAGE_KEY = 'mediaforge:options' as const;

const DEFAULT_OPTION = {
  autoplay: true,
  controls: false,
  muted: true,
  loop: true,
  blur: false,
} as const satisfies Option;

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
    return { ...DEFAULT_OPTION, ...parsed };
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
