# TODO

## Bugs

- Crop to mp4 fails on odd dimensions: round `scaledCrop` down to even numbers (`apps/web/src/views/crop/stores/crop.ts`); convert uses `scale=W:-1`, use `-2` for mp4/webm (`packages/ffmpeg-convert`; latent until Convert offers mp4/webm).
- Crop breaks on uppercase or unknown extensions (`IMG.JPG`, `.jpeg`, `.mov`): normalize and validate the extension in `layouts/process-layout/composables/file-input.ts`.
- Concat drops audio (`a=0`) and always outputs 320×180.
- ffmpeg core loads from unpkg at runtime (`src/stores/ffmpeg.ts`); self-host it. Load failures are only logged: status stays ⏳, no retry or user-facing error.

## Improvements

- Download names double the extension (`clip.mp4.gif`) in `components/app/button-download.vue`.
- Re-cropping leaks the previous processed object URL.
- Convert only offers gif/webp at the default preset; packages support apng/mp4/webm and five presets.
- Crop box is mouse-only (no touch).
- Concurrent `getFFmpeg` calls can create two instances.

## Tooling

- CI only builds; run `bun run test` and `bun run check` too.
- `turbo.json` marks `test` as `persistent` and lacks `dependsOn: ["^build"]`, so tests fail on a clean checkout.
- `ffmpeg-convert`/`ffmpeg-crop` bunup configs list a missing `src/constants` entry; `media` has an unexported `src/constants`.
- `bunup` is in `dependencies` instead of `devDependencies` in every package.
- `ffmpeg-concat` has no tsconfig; tests leave `console.log(args)` in.
- README calls the project a library.
