# TODO

## Bugs

- Convert uses `scale=W:-1`; use `-2` for mp4/webm to avoid odd heights (`packages/ffmpeg-convert`; latent until Convert offers mp4/webm).
- Concat drops audio (`a=0`) and always outputs 320×180.

## Improvements

- Download names double the extension (`clip.mp4.gif`) in `components/app/button-download.vue`.
- Re-cropping leaks the previous processed object URL.
- Convert only offers gif/webp at the default preset; packages support apng/mp4/webm and five presets.
- Crop box is mouse-only (no touch).
- Concurrent `getFFmpeg` calls can create two instances.
- `@ffmpeg/core` is pinned in `src/stores/ffmpeg.ts` (`CORE_VERSION`), outside Dependabot; bump it with `@ffmpeg/ffmpeg`.
