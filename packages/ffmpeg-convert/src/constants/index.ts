import type { Quality, QualityOptions } from '../types';

export const QUALITY_SETTINGS = {
  default: { width: 320, fps: 24, colors: 256 },
  low: { width: 320, fps: 10, colors: 256 },
  medium: { width: 480, fps: 15, colors: 256 },
  high: { width: 720, fps: 20, colors: 256 },
  hd: { width: 1080, fps: 24, colors: 256 },
} as const satisfies Record<Quality, QualityOptions>;
