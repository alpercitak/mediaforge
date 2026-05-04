export interface ConvertOptions extends QualityOptions {
  input: string;
  output: string;
  startTime?: number;
  duration?: number;
}

export type ConvertPipeline = (opts: ConvertOptions) => Array<string>;

export interface QualityOptions {
  width: number;
  fps: number;
  colors: number;
}

export type Quality = 'default' | 'low' | 'medium' | 'high' | 'hd';
