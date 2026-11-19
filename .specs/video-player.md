---
name: video-player
category: content
structure: monolithic
status: approved
spec_version: 1
template: 2
checksum: 269104ce16ff373f94f6d7783111e14d13f0020674655c20dab0ea934c514a76
created: 2026-11-19
last_updated: 2026-11-19
---

# VideoPlayer — Component Spec

## Purpose

Plays one video file in the page with its own controls: play and pause, a seek bar with the elapsed and total time, mute and volume, captions, and full screen. It also renders the two states a generated video goes through before it can play: a generating state (waiting, then running with an optional percentage) and an error state. It is built on the native video element with no player library; it plays what the app hands it (a URL, a `blob:` or a `data:` URL) and fetches or generates nothing.

## When to use

- A video an AI model produced or a user attached, shown inside a chat message or an artifact.
- Showing a video while it is still being generated, then the finished video in the same place.
- A recorded clip in an app screen (a session recording, a tutorial) that needs labelled, keyboard-operable controls.

## When NOT to use

- A third-party player page (YouTube, Vimeo, a status page) → use `embed`, which frames another origin's document.
- A short muted clip that illustrates documentation → use `doc-frame`, which frames stills and clips in docs.
- A file of any type in a storage browser → use `file-preview`, which picks the right preview for the type.
- Decorative motion behind marketing copy → do not use a video at all; use the marketing media components.

## Related

- `embed` — an `iframe` for third-party players and documents; no controls of its own.
- `doc-frame` — documentation frame for stills and clips.
- `file-preview` — type-aware preview of a stored file, with Download.
- `progress` — the bar the generating state shows.
- `empty-state` — the error state inside this component.

## Best practices

- Always give a `poster`: it is what a reader sees before playing, and it keeps the frame from flashing empty.
- Name the video with `aria-label` when the page holds more than one, so each player's region reads differently.
- Pass every caption track you have in `captions`; mark the one in the page's language as `default`.
- Pass `progress` only when the generator reports one; without it the generating bar is indeterminate, which is honest about an unknown wait.
- Hand an expiring URL (a signed or generated link) as `src` and refresh it before it expires; the player shows the error state when the file cannot load.

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
| `src`       | `string`                                          | `''`        | false    | URL of the video file: an https, blob or data URL. Empty with a success status shows the error state.  |
| `mimeType`  | `string`                                          | `''`        | false    | Media type of the file (`video/mp4`, `video/webm`), so the browser can skip a file it cannot play.      |
| `poster`    | `string`                                          | `''`        | false    | URL of the still image shown before the video plays.                                                    |
| `captions`  | `VideoPlayerCaption[]`                            | `[]`        | false    | Caption tracks: a WebVTT URL, its language, a label, and whether it is the default track.               |
| `status`    | `'pending' \| 'running' \| 'success' \| 'error'`  | `'success'` | false    | Where the video is: waiting to generate, generating, ready to play, or failed.                          |
| `progress`  | `number`                                          | undefined   | false    | Percent done (0 to 100) while generating. Unset shows an indeterminate bar.                             |
| `error`     | `string`                                          | `''`        | false    | Why the video could not be produced or loaded, shown in the error state.                                |
| `ariaLabel` | `string`                                          | `''`        | false    | Accessible name of the player. Empty names it Video.                                                    |

`VideoPlayerCaption` is `{ src: string; srclang: string; label: string; default?: boolean }`. `VideoPlayerStatus` is declared as `'pending' | 'running' | 'success' | 'error'`, a subset of the shared status set. Both are exported.

## Events

| Event    | Payload | Notes |
| -------- | ------- | ----- |
| _none_   | —       | —     |

## Slots

| _none_ | — | — |

## States

- `data-status`: `pending` | `running` | `success` | `error`, mirroring `status`; a file that fails to load also shows `error`.
- `pending` and `running`: the frame is a `Skeleton` with a `role="status"` region that says Waiting to generate or Generating video, a `Progress` bar (indeterminate without `progress`) and the percentage; the root has `aria-busy`. No controls.
- `error` (or the file fails to load, or no `src`): the frame is an `EmptyState` with the `error` text or the default message. No controls.
- `success`: the video with the controls bar under it.
- `data-paused` while the video is paused; `data-muted` while it is muted.
- Captions toggle: `aria-pressed` while the default track shows. Mute: `aria-pressed` while muted.
- Full screen: the frame (video and controls) goes full screen; the button's label switches between Enter and Exit full screen. The button is hidden where the browser offers no full screen.
- A live stream or a file with no known duration hides the total time and disables the seek bar (`Slider` disabled tokens).
- Buffering during playback (the media `waiting` event) renders nothing extra: the browser keeps the last frame, and `aria-busy` is not set, so a short stall is not announced.
- States it does not have: `disabled`, `readonly` and `invalid` (it is not a form control); `loading` is `pending` / `running`; an empty `src` is the error state.

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

- The root is a `div` with `role="group"` named by `ariaLabel` (or Video): a chat with several videos does not fill the landmark list.
- Every control is a native button or range input with a visible focus ring: Play/Pause (label switches), the seek bar (a `Slider`; its native input takes the forwarded `aria-valuetext` attribute, which overrides `Slider`'s own value text, so it reads like 1:05 of 3:20), Mute (`aria-pressed`; the volume bar keeps its value while muted), Volume (range 0 to 100, its `aria-valuetext` the locale percent, like the generating percentage), Captions (`aria-pressed`, shown only with tracks), Full screen.
- Keyboard: `Tab` moves through the controls; `Enter` / `Space` press a button; arrow keys move the seek bar by one second and the volume by five; `Home` / `End` jump to the start or end; under right-to-left the arrows follow the bar's direction (`Slider` handles it). `Esc` leaves full screen (the browser's own key); focus stays on the full screen button, whose label switches back to Enter full screen.
- Status changes: focus is never moved. The `role="status"` region announces Waiting to generate and Generating video; when the status turns to `success` the region is gone and the controls appear in place, when it turns to `error` the `EmptyState` title is announced through `EmptyState`'s own `role="status"` region (no second live region around it).
- Several caption tracks: the Captions toggle shows the track marked `default`, else the first track; it turns that one track on or off (`mode` showing / disabled). Language choice is out of scope; one player shows one language at a time.
- The video element has no native controls and is hidden from the tab order; the custom controls are the only path, so there is one set of names.
- Captions: `track kind="captions"` elements from `captions`; the toggle shows or hides the default track.
- Generating: `role="status"` with `aria-live="polite"` announces the state; the `Progress` bar is named by the same message (`videoPlayer.pending` or `videoPlayer.running`).
- No autoplay (WCAG 2.2.2): the video plays only on a press of Play.
- Touch targets: the buttons are 40 px (`IconButton` and `Button` size `large`) and grow their hit area to 44 px under `pointer: coarse`. The seek and volume bars are `Slider`s, 40 px tall with no coarse hit area of their own: that is above the 24 px minimum of WCAG 2.5.8 and meets the 40 px floor; growing `Slider` to 44 px on coarse pointers is a `Slider` follow-up, not part of this spec.
- The disabled seek bar (unknown duration) uses `Slider`'s disabled tokens; it carries no information a reader needs, so it is exempt from text contrast (WCAG 1.4.3 inactive component).
- Contrast ≥4.5:1 for the time and labels on `--bg-surface`.

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

- Formatting: the percentage goes through `formatNumber` with `style: 'percent'` and the `ConfigProvider` locale (so `42 %` or `%42` where a locale writes it so); the time digits through `formatNumber`, reading `m:ss` (`h:mm:ss` from one hour).

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the controls bar mirrors, so Play sits at the start edge.
- Icons: none mirrored (play, pause, volume and full screen glyphs are not directional).
- Keyboard: the seek and volume bars fill from the start edge; `Slider` maps `ArrowLeft` to forward under right-to-left.
- User data: the time is wrapped in `dir="ltr"` so `1:05 / 3:20` keeps its order (the ` / ` is punctuation, the same in every shipped locale; screen readers get `videoPlayer.seekValue` instead, and the visible time is `aria-hidden`); caption text follows the track's own language.

## Responsive

- Container queries: the root is a container; below `@md` the volume bar is hidden (Mute stays) and the seek bar takes the remaining width.
- Narrow (≤ 640 px or a narrow chat bubble): the frame keeps a 16:9 ratio and scales down; the controls stay on one row.
- Touch: 40 px targets; the buttons take a 44 px hit area under `pointer: coarse`, the two bars stay 40 px tall (see Accessibility); no hover-only affordance (the controls are always visible under the video).
- Reflow: no horizontal scroll at 320 px or at 200 % zoom; the controls bar wraps (`flex-wrap`), putting the seek bar on its own full-width row when the row runs out of room, and the time text does not wrap inside itself (`whitespace-nowrap`).

## Performance

- Bundle budget: 9 KB gzip for `./video-player` in `.size-limit.json`, including `Slider`, `IconButton`, `Button`, `Progress`, `Skeleton` and `EmptyState`; lowered to the measured size plus about 0.2 KB at build time.
- Runtime budget: time updates follow the media element's `timeupdate` event (about 4 per second); no animation frame loop.
- Heavy parts: none; `preload="metadata"` loads only the header until Play.

## Examples

The component has no `variant` or `size`; its axis is `status`, so one composite Statuses example shows the generating and error states side by side next to the Default (ready) example.

- Default — a ready video with a poster and an English caption track.
- Statuses — the pending, running (with a percentage) and error states side by side.

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
