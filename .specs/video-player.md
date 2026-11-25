---
name: video-player
category: content
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: 9e873700bb4f063311759e48e94dbd1c6e73dff2e61b68fd0078a24c8c6633f5
created: 2026-11-19
last_updated: 2026-11-25
---

# VideoPlayer — Component Spec

## Purpose

A native video player with play and pause, seek with time, mute and volume, captions and full screen. It also shows the states of a generated video before it plays: generating (with an optional percentage) and error. It plays the URL the app hands it (https, `blob:` or `data:`) and fetches nothing.

## When to use

- A generated or attached video in a chat message or artifact, from generating to playing.
- A recorded clip in an app screen.

## When NOT to use

- A third-party player page (YouTube, Vimeo) → use `embed`.
- A docs clip → use `doc-frame`.
- A stored file of any type → use `file-preview`.

## Related

- `embed` — third-party players.
- `file-preview` — stored files of any type.

## Best practices

- Give a `poster` and an `aria-label`.
- Mark the caption track in the page's language as `default`.
- Pass `progress` only when the generator reports one.

## Usage

```vue
<script setup>
  import VideoPlayer from '@aziontech/webkit/video-player'
</script>

<template>
  <VideoPlayer
    src="https://example.com/media/launch-recap.mp4"
    mime-type="video/mp4"
    poster="https://example.com/media/launch-recap.jpg"
    aria-label="Launch recap"
    :captions="[
      { src: 'https://example.com/media/launch-recap.en.vtt', srclang: 'en', label: 'English', default: true }
    ]"
  />
</template>
```

## Props

| Prop        | Type                                              | Default     | Required | JSDoc                                                                                                   |
| ----------- | ------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `src`       | `string`                                          | `''`        | false    | URL of the video: https, blob or data.  |
| `mimeType`  | `string`                                          | `''`        | false    | Media type, such as video/mp4.      |
| `poster`    | `string`                                          | `''`        | false    | Still image shown before play.                                                    |
| `captions`  | `VideoPlayerCaption[]`                            | `[]`        | false    | WebVTT caption tracks.               |
| `status`    | `'pending' \| 'running' \| 'success' \| 'error'`  | `'success'` | false    | Generation status; success plays.                          |
| `progress`  | `number`                                          | undefined   | false    | Percent done while generating; unset is indeterminate.                             |
| `error`     | `string`                                          | `''`        | false    | Message of the error state.                                |
| `ariaLabel` | `string`                                          | `''`        | false    | Accessible name; empty reads Video.                                                    |

`VideoPlayerCaption` is `{ src: string; srclang: string; label: string; default?: boolean }`. `VideoPlayerStatus` is declared as `'pending' | 'running' | 'success' | 'error'`, a subset of the shared status set. Both are exported.

## Events

| Event   | Payload      | Notes |
| ------- | ------------ | ----- |
| `retry` | `MouseEvent` | Try again in the error state was pressed. The button renders only when this event has a listener; a file that failed to load is loaded again, and the app sets `status` back to `pending` or `running` when it generates the video again. |

## Slots

| _none_ | — | — |

## States

- `data-status` mirrors `status`; a file that fails to load, or no `src`, shows `error`.
- `pending` / `running`: `Skeleton`, a `role="status"` message, `Progress` and the percentage; no controls.
- `error`: `EmptyState` with `error` or the default message; no playback controls. With a `retry` listener it shows a Try again `Button` (`az az-refresh`, outline, medium) under the message.
- `success`: the video and its controls; `data-paused`, `data-muted`.

## Motion & Animations

| Trigger                  | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback          |
| ------------------------ | ----------------------------------------- | ------------------------------------------------- | -------------------------------- |
| generating placeholder   | `Skeleton` (its own shimmer)              | semantic, owned by `Skeleton`                     | `Skeleton`'s `motion-reduce:animate-none` |
| indeterminate bar        | `Progress` (its own indeterminate motion) | semantic, owned by `Progress`                     | `Progress`'s own reduced-motion fallback |

The video never plays on its own: there is no autoplay, so nothing moves until the reader presses Play.

## Tokens

| Region            | Token (DESIGN.md)                          |
| ----------------- | ------------------------------------------ |
| frame             | `var(--bg-surface)`, `var(--border-default)` |
| video backdrop    | `var(--bg-canvas)`                         |
| shape             | `var(--shape-card)`                        |
| controls gap      | `var(--spacing-2xs)`, `var(--spacing-xs)`  |
| time              | `.text-label-sm`, `var(--text-muted)`      |
| generating label  | `.text-body-md`, `var(--text-default)`     |
| percentage        | `.text-label-sm`, `var(--text-muted)`      |
| ring              | `var(--ring-color)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `role="group"` named by `ariaLabel` (or Video). Native buttons and range inputs, each labelled; the seek bar reads like 1:05 of 3:20.
- Keyboard: `Tab`, `Enter` / `Space`, arrows (seek 1 s, volume 5), `Home` / `End`; `Esc` leaves full screen.
- No autoplay; status changes are announced, never move focus. Buttons 40 px (44 px coarse), bars 40 px.

## Internationalization

| Key                          | English source           | Override prop |
| ---------------------------- | ------------------------ | ------------- |
| `videoPlayer.label`          | `Video`                  | `ariaLabel`   |
| `videoPlayer.play`           | `Play`                   | —             |
| `videoPlayer.pause`          | `Pause`                  | —             |
| `videoPlayer.seek`           | `Seek`                   | —             |
| `videoPlayer.seekValue`      | `{current} of {duration}`| —             |
| `videoPlayer.mute`           | `Mute`                   | —             |
| `videoPlayer.volume`         | `Volume`                 | —             |
| `videoPlayer.captions`       | `Captions (CC)`          | —             |
| `videoPlayer.captionsShort`  | `CC` (the visible text of the Captions button; its accessible name is `videoPlayer.captions`, which contains it) | — |
| `videoPlayer.enterFullscreen`| `Enter full screen`      | —             |
| `videoPlayer.exitFullscreen` | `Exit full screen`       | —             |
| `videoPlayer.pending`        | `Waiting to generate`    | —             |
| `videoPlayer.running`        | `Generating video`       | —             |
| `videoPlayer.error`          | `The video could not load` | `error`     |
| `videoPlayer.retry`          | `Try again`              | —             |

- Formatting: the percentage goes through `formatNumber` with `style: 'percent'` and the `ConfigProvider` locale (so `42 %` or `%42` where a locale writes it so); the time digits through `formatNumber`, reading `m:ss` (`h:mm:ss` from one hour).

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the controls bar mirrors, so Play sits at the start edge.
- Icons: none mirrored (play, pause, volume and full screen glyphs are not directional).
- Seek bar: media time does not mirror. The seek slider sits in a `dir="ltr"` box, so it fills from the left and `ArrowRight` moves forward in every direction, as Material's media progress and the browsers' own players do (spec_version 2).
- Keyboard: the volume bar fills from the start edge; `Slider` maps `ArrowLeft` to louder under right-to-left.
- User data: the time is wrapped in `dir="ltr"` so `1:05 / 3:20` keeps its order (the ` / ` is punctuation, the same in every shipped locale; screen readers get `videoPlayer.seekValue` instead, and the visible time is `aria-hidden`); caption text follows the track's own language.

## Responsive

- Container queries: the root is a container; below `@md` the volume bar is hidden (Mute stays) and the seek bar takes the remaining width.
- Narrow (≤ 640 px or a narrow chat bubble): the frame keeps a 16:9 ratio and scales down; the controls stay on one row.
- Touch: 40 px targets; the buttons take a 44 px hit area under `pointer: coarse`, the two bars stay 40 px tall (see Accessibility); no hover-only affordance (the controls are always visible under the video).
- Reflow: no horizontal scroll at 320 px or at 200 % zoom; the controls bar wraps (`flex-wrap`), putting the seek bar on its own full-width row when the row runs out of room, and the time text does not wrap inside itself (`whitespace-nowrap`). Mute carries `ms-auto`, so when Mute, Captions and full screen wrap to a second row (a 320 px column) they sit together at the inline end instead of scattering from the start.

## Performance

- Bundle budget: 12.05 KB gzip for `./video-player` in `.size-limit.json` (measured 11.85 KB + 0.2 KB), including `Slider`, `IconButton`, `Button`, `Progress`, `Skeleton` and `EmptyState`, whose own budgets add up to 14.5 KB; no `cn` (tailwind-merge), the root merges the consumer class through `$attrs`.
- Runtime budget: time updates follow the media element's `timeupdate` event (about 4 per second); no animation frame loop.
- Heavy parts: none; `preload="metadata"` loads only the header until Play.

## Examples

The component has no `variant` or `size`; its axis is `status`, so one composite Statuses example shows the generating and error states side by side next to the Default (ready) example.

- Default — a ready video with a poster and an English caption track.
- Statuses — the pending, running (with a percentage) and error (with Try again) states side by side.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
