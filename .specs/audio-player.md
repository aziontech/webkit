---
name: audio-player
category: content
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: e4fd5938d02390681d8e8db1f6cfd69c21d9d5f55f684123e4bc9900756e8f89
created: 2026-11-19
last_updated: 2026-11-19
---

# AudioPlayer — Component Spec

## Purpose

A compact player for one audio clip: play and pause, a seek bar between the current time and the duration, mute and volume, and, when asked for, a playback speed control, a download link and a transcript. It plays what the app hands it (a URL, an object URL or a `data:` URL built from base64 audio) on the browser's own audio element; it fetches and decodes nothing. It owns the generating, buffering and error states, so an AI reply that speaks, or a stored recording, looks the same everywhere.

## When to use

- An AI reply that carries audio: speech generated from text, generated music or sound, an audio part of a chat message.
- A voice note or recording a person attached to a message or a ticket.
- Previewing one stored audio file in a detail pane or drawer.

## When NOT to use

- Video, or audio that needs a picture → use `DocFrame` (a captured clip) or `Embed` (a hosted player).
- Recording audio or a live voice conversation → use `PromptInput` and its dictate button.
- A file of any type with a type-aware fallback → use `FilePreview`.
- Background or decorative sound that the reader did not ask for → do not autoplay audio; leave it out.

## Related

- `FilePreview` — the preview of a stored file of any type; an audio file can open in an `AudioPlayer` instead.
- `ChatMessage` — the message an audio reply sits in.
- `Slider` — the seek and volume controls inside this component.
- `IconButton` — the play, mute and download controls inside this component.

## Best practices

- Build `src` once from the source the app has: a URL as it is, base64 audio as `data:<mimeType>;base64,<value>`, a `Blob` as an object URL (revoke it when the player unmounts).
- Pass `duration` when the generator reports it, so the time shows before the browser has read the file.
- Set `loading` while the audio is being generated, so the player holds its place in the reply instead of appearing when it is done.
- Pass the text the audio speaks as `transcript`; a reader who cannot hear it reads it instead (WCAG 1.2.1).
- Give each player a `title` when a message holds more than one, so each control group has its own name.
- Never start playback on mount; the reader presses Play.
- In a narrow column only Mute is left for the volume; the device volume covers the rest on a phone.

## Usage

```vue
<script setup>
  import AudioPlayer from '@aziontech/webkit/audio-player'
</script>

<template>
  <AudioPlayer
    src="https://example.com/audio/welcome.mp3"
    title="Welcome message"
    :duration="42"
    transcript="Welcome to Acme. Your store is live on the edge."
    :playback-rates="[1, 1.5, 2]"
    downloadable
    file-name="welcome.mp3"
  />
</template>
```

## Props

| Prop            | Type       | Default   | Required | JSDoc                                                                                                                   |
| --------------- | ---------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src`           | `string`   | `''`      | false    | Audio source: a URL, an object URL or a data URL built from base64 audio. Empty disables the controls.                  |
| `title`         | `string`   | `''`      | false    | Name of the clip, shown above the controls and used as the accessible name of the control group.                       |
| `duration`      | `number`   | undefined | false    | Length of the clip in seconds, shown until the browser reads it from the file. Unset shows a placeholder.              |
| `transcript`    | `string`   | `''`      | false    | Text the audio speaks, shown in a collapsible Transcript section under the controls. Empty hides the section.          |
| `playbackRates` | `number[]` | `[]`      | false    | Playback speeds the speed control cycles through, in order. Empty hides it; it starts at 1 when listed, else the first. |
| `downloadable`  | `boolean`  | `false`   | false    | Shows a Download link to `src`.                                                                                         |
| `fileName`      | `string`   | `''`      | false    | File name the Download link saves the audio as. Empty lets the browser pick one.                                        |
| `loading`       | `boolean`  | `false`   | false    | The audio is still being generated or fetched: the play control shows a spinner and the other controls are disabled.  |
| `error`         | `string`   | `''`      | false    | Why the audio cannot play. Set, the controls are disabled and this text replaces the time.                             |
| `disabled`      | `boolean`  | `false`   | false    | Disables every control and applies the disabled tokens.                                                                 |
| `ariaLabel`     | `string`   | `''`      | false    | Accessible name of the control group when there is no `title`. Empty falls back to the catalog's Audio player.         |

## Events

| Event   | Payload | Notes                                                                                          |
| ------- | ------- | ---------------------------------------------------------------------------------------------- |
| `play`  | `Event` | Playback started (the audio element's `play` event).                                           |
| `pause` | `Event` | Playback paused, by the reader or because the clip reached its end (the element's `pause` event). |

## Slots

_none_

## States

- `data-playing` is set while the audio plays; the play control shows Pause.
- `data-loading` mirrors `loading` (the audio is still being generated or fetched): the play control shows a `Spinner` (through `IconButton`'s `loading`) and is inert, every other control is disabled, the root has `aria-busy`, and a visually hidden `role="status"` line says Loading audio.
- `data-buffering` is set while the browser waits for data after Play (the audio element's `waiting` until `playing`): a small `Spinner` replaces the current time, the root has `aria-busy` and the status line says Loading audio, and every control stays enabled; Play keeps its Pause name so the reader can stop a stalled clip.
- `data-error` is set when `error` is set or the audio element reports an error; the controls are disabled and the error line (`role="alert"`) replaces the time. The app's text wins; with no text the catalog's message shows.
- `data-disabled` mirrors `disabled`; it is also set when `src` is empty and nothing is loading.
- `data-muted` is set while the audio is muted; the mute control shows Unmute and the volume slider reads 0.
- Empty: `src` empty with `loading` false sets `data-disabled`; the times show `--:--` and the Download link is not rendered.
- Unknown duration (no `duration` and the file not read yet): the times show `--:--` and the seek bar is disabled until the browser reports the length.
- The transcript is a native `details` disclosure, closed by default; its `open` attribute is the only open state, with no `data-state` on the root.
- Not applicable: `readonly` and `invalid` (the player takes no value input).
- A new `src` resets the time, the playing state and the error.

## Motion & Animations

| Trigger                  | Animation / Transition                                              | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                         |
| ------------------------ | ------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| loading indicator        | `Spinner` (inside `IconButton`)                                     | semantic (Spinner's own)                          | `Spinner`'s own `motion-reduce:` fallback       |
| hover/focus state change | inherited from `IconButton`, `Button` and `Slider`                  | inherited                                         | inherited `motion-reduce:transition-none`       |

## Tokens

| Region                 | Token (DESIGN.md)                          |
| ---------------------- | ------------------------------------------ |
| surface                | `var(--bg-surface)`                        |
| border                 | `var(--border-default)`                    |
| shape                  | `var(--shape-card)`                        |
| spacing (padding, gap) | `var(--spacing-xs)`, `var(--spacing-sm)`   |
| title                  | `.text-label-md`, `var(--text-default)`    |
| time                   | `.text-body-xs`, `var(--text-muted)`       |
| error line             | `.text-body-xs`, `var(--text-danger)`      |
| transcript summary     | `.text-label-sm`, `var(--text-default)`    |
| transcript text        | `.text-body-sm`, `var(--text-muted)`       |
| transcript spacing     | `var(--spacing-2xs)`                       |
| summary focus shape    | `var(--shape-control)`, ring offset `var(--bg-canvas)` |
| disabled               | `var(--text-disabled)`                     |
| ring                   | `var(--ring-color)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `role="group"` named by `title` (`aria-labelledby`), else `ariaLabel`, else the catalog's Audio player.
- Visible focus: every control is an `IconButton`, `Button` or `Slider` with the ring token.
- Play is one toggle `IconButton` whose name follows its state (Play / Pause); its glyph is decorative. It is inert only under `loading`, `error`, `disabled` or an empty `src`; while buffering it stays operable.
- The seek bar is a `Slider` named Seek, from 0 to the duration in whole seconds, with a spoken `aria-valuetext` (`42 seconds of 3 minutes, 5 seconds`); it changes once a second at most.
- Mute is a toggle named Mute / Unmute; volume is a `Slider` named Volume, 0 to 100, with `aria-valuetext` from `formatNumber` (`style: 'percent'`).
- The speed control is a `Button` whose visible text is the rate (`1.5×`) and whose name is Playback speed 1.5×, so the name contains the visible text.
- Patterns (WAI-ARIA APG): Slider for seek and volume; Button with a name that follows its state for Play/Pause and Mute/Unmute; Button for speed; Link for Download; Disclosure for the transcript.
- Download is an anchor with the `download` attribute, named Download audio.
- The transcript is a native `details`/`summary` disclosure, so it opens with Enter or Space and announces its expanded state.
- Keyboard: `Tab` moves through Play, Seek, Mute, Volume, Speed, Download, Transcript; `Enter`/`Space` press the buttons; on the sliders the arrow keys step 1 second (seek) or 1 % (volume), `PageUp`/`PageDown` take larger steps, `Home`/`End` go to the start or the end.
- No autoplay (WCAG 1.4.2); the audio never starts without a press on Play.
- Contrast ≥4.5:1 for the title, the time and the error line; ≥3:1 for the glyphs and the slider tracks. Disabled controls render `--text-disabled` on `--bg-disabled` through `IconButton`, `Button` and `Slider`; inactive controls are exempt from 1.4.3 and 1.4.11.
- Touch target: Play is drawn 40 × 40 px and the other buttons 32 × 32 px (above the 24 px minimum, WCAG 2.5.8); on `pointer: coarse` `IconButton` and `Button` add their 44 × 44 px hit area, and the `Slider` inputs are 40 px tall.

## Internationalization

| Key                       | English source               | Override prop |
| ------------------------- | ---------------------------- | ------------- |
| `audioPlayer.label`       | `Audio player`               | `ariaLabel`   |
| `audioPlayer.play`        | `Play`                       | —             |
| `audioPlayer.pause`       | `Pause`                      | —             |
| `audioPlayer.seek`        | `Seek`                       | —             |
| `audioPlayer.position`    | `{current} of {total}`       | —             |
| `audioPlayer.mute`        | `Mute`                       | —             |
| `audioPlayer.unmute`      | `Unmute`                     | —             |
| `audioPlayer.volume`      | `Volume`                     | —             |
| `audioPlayer.rate`        | `{rate}×`                    | —             |
| `audioPlayer.speed`       | `Playback speed {rate}`      | —             |
| `audioPlayer.download`    | `Download audio`             | —             |
| `audioPlayer.downloadTitle` | `Download {title}`         | —             |
| `audioPlayer.loading`     | `Loading audio`              | —             |
| `audioPlayer.error`       | `The audio could not play.`  | `error`       |
| `audioPlayer.transcript`  | `Transcript`                 | —             |

- Formatting: `formatNumber` (`Intl.NumberFormat`, the `ConfigProvider` locale) for the shown time, `m:ss` under an hour and `h:mm:ss` from an hour on, and for the rate inside `audioPlayer.rate` (a locale can move the sign: `×1,5`). The spoken `aria-valuetext` uses `formatNumber` with `style: 'unit'` (`hour`, `minute`, `second`, long) joined by `formatList` (`type: 'unit'`). An unknown duration shows `--:--`; the seek bar is disabled then, so it announces nothing. `audioPlayer.downloadTitle` names the link when `title` is set (the title fills `{title}`), so two players in one message have distinct link names.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the row mirrors, so the current time sits at the start and the duration at the end.
- Icons: none mirrored; play, pause, volume and download glyphs keep their shape (media glyphs do not flip).
- Seek bar: media time does not mirror. The seek slider sits in a `dir="ltr"` box, so it fills from the left and `ArrowRight` moves forward in every direction, as Material's media progress and the browsers' own players do (spec_version 2).
- Keyboard: the volume slider follows `Slider`'s right-to-left map (`ArrowLeft` raises it in right-to-left).
- User data: the times and the speed label are wrapped in `bdi` so `0:42` and `1.5×` keep their order; the title and the transcript are `dir="auto"`.

## Responsive

- Layout: two rows at every width. The top row holds Play, the title (it takes the free space and truncates), Mute, the volume slider, Speed and Download; the bottom row holds the current time, the seek bar and the duration, so the seek bar always has the full width of the player.
- Container queries: the root is the `audio-player` container; under `@sm` (24rem) the volume slider hides and Mute stays. The volume slider is 6rem wide.
- Narrow (≤ 640 px or a narrow container): at a 244 px content width the top row needs about 190 px (40 + 32 + 64 + 32 and the gaps) and the bottom row keeps a seek bar of at least 6rem between the two times; the title truncates with an ellipsis.
- Touch: 44 × 44 px hit areas on `pointer: coarse` through `IconButton` and `Button`, 40 px tall `Slider` inputs; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px or at 200 % zoom; the seek bar is the part that shrinks (`min-w-0`).

## Performance

- Bundle budget: 9.95 KB gzip for `./audio-player` in `.size-limit.json` (measured 9.73 KB plus ~0.2 KB), including `IconButton`, `Spinner`, `Button`, `Slider` and the locale helpers (vue external).
- Runtime budget: one `timeupdate` update per browser tick (about 4 a second), no timers of its own; every listener is on the audio element and goes with it.
- Heavy parts: none; the browser's audio element decodes, `preload="metadata"` reads only the header until Play.

## Examples

The component has no `variant` or `size`; the examples show the states an AI reply goes through and the optional controls.

- Default — a clip with a title, its duration and the transcript.
- Playback rates — the speed control with the Download link (`playbackRates`, `downloadable`, `fileName`), file `playback-rates.vue`.
- Loading — the player while the speech is still being generated.
- Error — the player when the audio cannot play, with the app's message.
- Disabled — every control disabled.

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
- Do not change `structure` after `status: implemented`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
