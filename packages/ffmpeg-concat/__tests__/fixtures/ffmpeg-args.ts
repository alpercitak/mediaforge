const VIDEO_FILTERS =
  '[0:v]fps=24,scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2,setsar=1[v0];[1:v]fps=24,scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2,setsar=1[v1]';

const AUDIO_FILTERS =
  '[0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,apad,atrim=duration=2.5[a0];anullsrc=r=48000:cl=stereo,atrim=duration=1.5[a1]';

const VP8_ARGS = [
  '-c:v',
  'libvpx',
  '-pix_fmt',
  'yuv420p',
  '-crf',
  '10',
  '-b:v',
  '1M',
  '-deadline',
  'good',
  '-cpu-used',
  '4',
];

export const MP4_CONCAT_ARGS = [
  '-i',
  'a.mp4',
  '-i',
  'b.mp4',
  '-filter_complex',
  `${VIDEO_FILTERS};[v0][v1]concat=n=2:v=1:a=0[v]`,
  '-map',
  '[v]',
  '-c:v',
  'libx264',
  '-preset',
  'ultrafast',
  '-crf',
  '28',
  '-pix_fmt',
  'yuv420p',
  '-movflags',
  '+faststart',
  'out.mp4',
];

export const WEBM_CONCAT_ARGS = [
  '-i',
  'a.webm',
  '-i',
  'b.webm',
  '-filter_complex',
  `${VIDEO_FILTERS};[v0][v1]concat=n=2:v=1:a=0[v]`,
  '-map',
  '[v]',
  ...VP8_ARGS,
  'out.webm',
];

export const MP4_AUDIO_CONCAT_ARGS = [
  '-i',
  'a.mp4',
  '-i',
  'b.mp4',
  '-filter_complex',
  `${VIDEO_FILTERS};${AUDIO_FILTERS};[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`,
  '-map',
  '[v]',
  '-map',
  '[a]',
  '-c:v',
  'libx264',
  '-preset',
  'ultrafast',
  '-crf',
  '28',
  '-pix_fmt',
  'yuv420p',
  '-c:a',
  'aac',
  '-b:a',
  '128k',
  '-movflags',
  '+faststart',
  'out.mp4',
];

export const WEBM_AUDIO_CONCAT_ARGS = [
  '-i',
  'a.webm',
  '-i',
  'b.webm',
  '-filter_complex',
  `${VIDEO_FILTERS};${AUDIO_FILTERS};[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]`,
  '-map',
  '[v]',
  '-map',
  '[a]',
  ...VP8_ARGS,
  '-c:a',
  'libvorbis',
  '-q:a',
  '4',
  'out.webm',
];
