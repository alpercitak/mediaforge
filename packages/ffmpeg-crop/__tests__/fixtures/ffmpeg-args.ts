export const VIDEO_ARGS = ['-i', 'input.mp4', '-vf', 'crop=400:320:20:40', '-preset', 'ultrafast', 'output.mp4'];

export const IMAGE_ARGS = ['-i', 'input.jpg', '-vf', 'crop=400:320:20:40', '-frames:v', '1', 'output.jpg'];
