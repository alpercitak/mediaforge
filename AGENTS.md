# Mediaforge

Bun/Turborepo monorepo for a browser-only media tool built on ffmpeg.wasm. The Vue 3 + Vite app lives in `apps/web`; ffmpeg argument builders and media helpers live in `packages/*` (`@mediaforge/*`).

- Use Bun for dependencies and package scripts.
- Use the root dependency catalog (`workspaces.catalog`) for versions shared across workspaces.
- Use `@/` for `apps/web/src` imports across areas; relative imports within a flow or component folder.
- For review, diagnosis, or planning, inspect only. For implementation, preserve unrelated user changes.

## App Layout

- `src/views/<flow>/<flow>.vue` (`convert`, `crop`, `concat`, `home`, `settings`), lazily registered in the router in `src/main.ts`. Flow-only code lives under `views/<flow>/{components,stores,types}`.
- Each processing flow has a `components/button-<flow>.vue` that builds args with `@mediaforge/ffmpeg-<flow>/utils` and runs them through `useFfmpegRunner` (`src/composables/ffmpeg-runner.ts`).
- Processing pages wrap `layouts/process-layout`; app chrome is `layouts/app-layout`.
- Shared UI primitives go in `src/components/ui/`, app-specific shared components in `src/components/app/`.
- Global Pinia stores in `src/stores/` (`ffmpeg`, `media`, `option`); shared types in `src/types/index.ts`.
- Components are kebab-case single-file components with `<script setup lang="ts">` and scoped styles; global styles in `src/styles/global.css`.

## Packages

- Packages expose `./types` and `./utils` subpath exports built by bunup; `@mediaforge/ffmpeg` also exposes `./constants`. To add an entry, list it in `bunup.config.ts`, build, and commit the regenerated `package.json` `exports`.
- `ffmpeg-*` packages are pure functions returning `Array<string>` ffmpeg args via `ffmpegArg`; they never import ffmpeg.wasm.
- Quality presets live in `@mediaforge/ffmpeg/constants`. Format, MIME and media-type maps live in `packages/media/src/constants` and are consumed via `@mediaforge/media/utils` (`getMediaInfo`). Keep encoder tuning values in packages, not in components.
- Only `ffmpeg-concat`, `ffmpeg-convert` and `ffmpeg-crop` have tests (vitest): `__tests__/index.test.ts`, with expected args in `__tests__/fixtures/ffmpeg-args.ts`. Tests import sibling packages from `dist`, so run `bun run build` before `bun run test`; single package: `bun run --filter @mediaforge/ffmpeg-crop test`.

## Biome

Templates use kebab-case component tags, which Biome can't link to their imports, so unused-import/variable rules are off for `*.vue`. Never remove imports from `.vue` files based on tooling — check the template. Don't run `biome check --write --unsafe`.

## Implementation

Treat additional code as a cost.
Smallest change that solves the actual task.
Follow existing patterns.
No hypothetical future requirements, no unrelated refactors, no wrapper/factory/dependency for a single use unless it removes concrete complexity today.
Small duplication beats premature abstraction.
Default, not absolute — if the task genuinely needs structure, build it and say why in one line.
Scope is the task, nothing more.
Worth doing but out of scope → mention it, don't implement it.
If the issue is ambiguous, follow existing convention.

## Defensive Programming

Trust internal TypeScript invariants. No assertions/guards/validation/fallbacks for states this codebase already controls, unless you can name the concrete failure prevented. Validate only at real trust boundaries: user input (dropped or picked files), ffmpeg output, persisted data (`localStorage`), platform APIs. Handle errors only with a real recovery path — otherwise let them propagate. Don't invent recovery, don't swallow, don't build infra for it.

## TypeScript / Vue

Precise types over runtime checks — no `any`, no unnecessary assertions, no non-null assertions where the type can be modeled correctly. No `ref` unless it affects render/behavior. No derived state duplication — use `computed`. No `watch` where `computed` works. Use `storeToRefs` for store state. Revoke object URLs you replace or discard.

## Stopping

Implement, verify with checks, stop. Don't keep hardening or generalizing once it's done — note anything extra you noticed, don't build it.

## Before Finishing

Verify with `bun run build`, `bun run test`, and `bun run check` (Biome).
Keep `docs/TODO.md` updated: remove completed work and add newly identified remaining work.
Commit in small, feature-based Conventional Commits (`fix(crop): …`, `chore(deps): …`); no attribution trailers.
Cut from your own diff: unneeded abstractions, redundant guards, one-use helpers, speculative config, unrelated changes, obvious-code comments. Equal correctness → ship the smaller one.
